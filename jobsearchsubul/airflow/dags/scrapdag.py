from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2024, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG('job_scraping_pipeline',
         default_args=default_args,
         schedule_interval='@daily',
         catchup=False,
         template_searchpath='/opt/airflow/tools') as dag:

    scrape_jobs = BashOperator(
        task_id='scrape_jobs',
        bash_command='python scrapmain.py',  # Now looks in /opt/airflow/tools
        env={
            'KAFKA_BROKER_URL': 'kafka:9092',
            'POSTGRES_HOST': 'postgres',
            'POSTGRES_PORT': '5432',
            'PYTHONPATH': '/opt/airflow/tools'
        }
    )

    consume_jobs = BashOperator(
        task_id='consume_jobs',
        bash_command='python consumer.py',
        env={
            'KAFKA_BROKER_URL': 'kafka:9092',
            'POSTGRES_HOST': 'postgres',
            'POSTGRES_PORT': '5432',
            'PYTHONPATH': '/opt/airflow/tools'
        }
    )

    scrape_jobs >> consume_jobs