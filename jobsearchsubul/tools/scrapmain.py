from careerjet import scrape_careerjet
from expat import scrape_expat
from gulftalent import scrape_gulftalent
from naukrigulf import run_scraping
from qureos import scrape_qureos_jobs
from himalayas import scrape_himalayas  


def main():

    print("scraping careerjet...")
    scrape_careerjet()

    #print("scraping expat...")
    #scrape_expat()

    print("scraping gulftalent...")
    scrape_gulftalent("https://www.gulftalent.com/oman/jobs")

    print("scraping naukri...")
    run_scraping("https://www.naukrigulf.com/jobs-in-oman?industryType=25&locale=en&xz=1_2_5")

    print("Lancement du scraping qureos...")
    scrape_qureos_jobs()

    print("Lancement du scraping himalayas...")
    scrape_himalayas()
    



    print("final of Scraping.")


if __name__ == "__main__":
    main()
