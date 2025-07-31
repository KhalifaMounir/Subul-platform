from prefect import flow, task
from scrapmain import main

@task
def run_scraper():
    main()

@flow(name="Job Scraping Flow")
def job_scraping_flow(dummy_param: str = "default"):  
    run_scraper()

if __name__ == "__main__":
    job_scraping_flow()