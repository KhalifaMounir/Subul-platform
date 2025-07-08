from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime

default_args = {
    'start_date': datetime(2024, 1, 1),
    'retries': 1
}

with DAG('job_scraping_pipeline',
         default_args=default_args,
         schedule_interval='@daily',
         catchup=False) as dag:

    scrape_jobs = BashOperator(
        task_id='scrape_jobs',
        bash_command='python /opt/airflow/tools/scrapmain.py'
    )

    consume_jobs = BashOperator(
        task_id='consume_jobs',
        bash_command='python /opt/airflow/tools/consumer.py'
    )

    scrape_jobs >> consume_jobs
