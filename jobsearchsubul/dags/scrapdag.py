# dags/job_scraping_dag.py
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
import sys
sys.path.append('/opt/airflow/scripts/tools')  
from scrapmain import main                    


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'daily_job_scraping',
    default_args=default_args,
    description='Exécute quotidiennement le scraping des offres d\'emploi',
    schedule_interval='0 0 * * *',
    start_date=datetime(2025, 4, 5),
    catchup=False,
)

run_scraping_task = PythonOperator(
    task_id='run_scraping',
    python_callable=main,
    dag=dag,
)

run_scraping_task