from confluent_kafka import Producer
import json
import logging

conf = {'bootstrap.servers': 'kafka:9092'}
producer = Producer(conf)
logging.basicConfig(level=logging.INFO)

def delivery_report(err, msg):
    if err:
        logging.error(f'Message delivery failed: {err}')
    else:
        logging.info(f'Message delivered to {msg.topic()} [{msg.partition()}]')

def send_to_kafka(job_data: dict):
    print("Appel de send_to_kafka avec :", job_data["title"])
    try:
        producer.produce(
            'jobs_topic',
            key=job_data.get('url'),
            value=json.dumps(job_data),
            callback=delivery_report
        )
        producer.poll(0)
        producer.flush()  
    except Exception as e:
        logging.error(f"Erreur lors de l'envoi au Kafka : {e}")




