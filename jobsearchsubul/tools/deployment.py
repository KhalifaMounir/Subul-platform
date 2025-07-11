from prefect.deployments import Deployment
from prefect.server.schemas.schedules import CronSchedule
from jobsearchsubul.tools.prefectflow import job_scraping_flow  # Correction du nom

deployment = Deployment.build_from_flow(
    flow=job_scraping_flow,
    name="daily-jobsearch",
    schedule=CronSchedule(cron="* * * * *", timezone="UTC"),  # Toutes les minutes pour test
    work_queue_name="default",
    parameters={"dummy_param": "default"} 
)

if __name__ == "__main__":
    deployment.apply()