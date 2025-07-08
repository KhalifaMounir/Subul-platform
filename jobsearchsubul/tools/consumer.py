import os
import time
import json
import logging
import psycopg2
from psycopg2 import OperationalError
from confluent_kafka import Consumer, KafkaException
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_CHAT_ENDPOINT = os.getenv("AZURE_OPENAI_CHAT_ENDPOINT")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = AzureOpenAI(
    api_key=AZURE_OPENAI_API_KEY,
    api_version=AZURE_OPENAI_API_VERSION,
    azure_endpoint=AZURE_OPENAI_CHAT_ENDPOINT
)

def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        input=[text],
        model=AZURE_OPENAI_DEPLOYMENT_NAME
    )
    return response.data[0].embedding

def wait_for_postgres(max_retries=15, delay=3):
    for attempt in range(max_retries):
        try:
            conn = psycopg2.connect(DATABASE_URL)

            logger.info("Connexion à PostgreSQL")
            return conn
        except OperationalError:
            logger.warning(f"PostgreSQL pas prêt, tentative {attempt + 1}/{max_retries}")
            time.sleep(delay)
    raise Exception("Impossible de se connecter à PostgreSQL")

def wait_for_kafka():
    while True:
        try:
            conf = {
                'bootstrap.servers': 'kafka:9092',
                'group.id': 'job_consumer_group',
                'auto.offset.reset': 'earliest'
            }
            consumer = Consumer(conf)
            consumer.subscribe(['jobs_topic'])
            logger.info("Connexion à Kafka réussie.")
            return consumer
        except KafkaException as e:
            logger.warning(f"Kafka pas prêt : {e}")
            time.sleep(3)

def create_table_if_not_exists(conn):
    cursor = conn.cursor()
    cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id SERIAL PRIMARY KEY,
            title TEXT,
            company TEXT,
            location TEXT,
            url TEXT UNIQUE,
            description TEXT,
            date_posted TIMESTAMP,
            embedding vector(1536)
        );
    """)
    conn.commit()
    cursor.close()

def job_exists(conn, url: str) -> bool:
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM jobs WHERE url = %s LIMIT 1;", (url,))
    exists = cursor.fetchone() is not None
    cursor.close()
    return exists

def insert_job(conn, job):
    try:
        url = job.get('url')
        if not url:
            logger.warning(" Job sans URL, ignoré.")
            return

        if job_exists(conn, url):
            logger.info(f"ℹJob déjà existant, ignoré : {url}")
            return

        title = job.get('title', '')
        company = job.get('company', '')
        description = job.get('description', '')
        text_to_embed = f"{title} {description}"
        embedding = get_embedding(text_to_embed)

        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO jobs (title, company, location, url, description, date_posted, embedding)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (
            title,
            company,
            job.get('location'),
            url,
            description,
            job.get('date_posted'),
            embedding
        ))
        conn.commit()
        cursor.close()
        logger.info(f"Job inséré : {title}")
    except Exception as e:
        logger.error(f"Erreur d’insertion : {e}")
        conn.rollback()

def consume():
    conn = wait_for_postgres()
    create_table_if_not_exists(conn)
    consumer = wait_for_kafka()

    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                logger.warning(f"Kafka error : {msg.error()}")
                continue
            try:
                job_data = json.loads(msg.value().decode('utf-8'))
                insert_job(conn, job_data)
            except Exception as e:
                logger.error(f" Erreur de traitement du message Kafka : {e}")
    except KeyboardInterrupt:
        logger.info(" Arrêt du consumer.")
    finally:
        consumer.close()
        conn.close()

if __name__ == "__main__":
    consume()
