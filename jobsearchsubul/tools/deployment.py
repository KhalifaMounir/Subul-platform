
from prefect.deployments import Deployment
from prefect.server.schemas.schedules import CronSchedule
from jobsearchsubul.tools.prefectflow import job_scraping_flow 

deployment = Deployment.build_from_flow(
    flow=job_scraping_flow,
    name="daily-jobsearch",
    schedule=CronSchedule(cron="0 0 * * *", timezone="UTC"),  
    work_queue_name="default",
    parameters={"dummy_param": "default"} 
)

if __name__ == "__main__":
    deployment.apply()