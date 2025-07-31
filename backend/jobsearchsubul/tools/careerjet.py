import csv
import re
import requests
from bs4 import BeautifulSoup
from tool import parse_date_en
from producer import send_to_kafka

url = 'https://www.careerjet.com.om/jobs?l=Oman&lid=119810&radius=15'

def get_jobs_links(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Erreur HTTP {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    job_articles = soup.find_all("article", class_="job clicky")

    links = []
    for job in job_articles:
        job_url = job.get("data-url")
        if job_url:
            full_url = f"https://www.careerjet.com.om{job_url}"
            links.append(full_url)
    return links


def get_job_details(link):
    response = requests.get(link)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.find("h1")
    company = soup.find("p", class_="company")
    description_section = soup.find("section", class_="content")
    date_badge = soup.find("span", class_="badge badge-r badge-s")


    description = description_section.text if description_section else "N/A"
    description = re.sub(r"[\s\n\t\xa0]+", " ", description).strip()


    location = "N/A"
    details_ul = soup.find("ul", class_="details")
    if details_ul:
        for li in details_ul.find_all("li"):
            icon = li.find("use")
            if icon and "#icon-location" in icon.get("xlink:href", ""):
                location = li.text.strip()
                break

    job_details = {
        "title": title.text.strip() if title else "N/A",
        "company": company.text.strip() if company else "N/A",
        "location": location,
        "description": description,
        "date_posted": parse_date_en(date_badge.text.strip()) if date_badge else "0000-00-00T00:00:00",
        "url": link,
        "source": "careerjet"
    }

    return job_details



def scrape_careerjet():
    all_jobs = []
    BASE_URL = 'https://www.careerjet.com.om/jobs?l=Oman&lid=119810&radius=15'
    base_url = BASE_URL
    current_page = 1

    while True:
        print(f"Scraping page {current_page}...")

        job_links = get_jobs_links(base_url)

        if not job_links:
            print("Stop Scraping, no job offer found in this page.")
            break

        for link in job_links:
            try:
                job = get_job_details(link)
                send_to_kafka(job)
                all_jobs.append(job) 

            except Exception as e:
                print(f"Error during the scraping of {link}: {e}")

        try:
            response = requests.get(base_url)
            soup = BeautifulSoup(response.text, "html.parser")
            next_button = soup.find("button", class_="ves-control ves-add btn btn-r btn-primary-inverted next")

            if next_button and "data-value" in next_button.attrs:
                next_page = next_button["data-value"]
                base_url = f"https://www.careerjet.com.om/jobs?s=&l=Oman&radius=15&p={next_page}"
                current_page += 1
            else:
                print("End of results, no nextpage.")
                break
        except Exception as e:
            print(f"Error in handling pagination : {e}")
            break

    return all_jobs


def clean_text(text):
    if not isinstance(text, str):
        return text
    return ''.join(c for c in text if c.isprintable())

if __name__ == "__main__":
    jobs = scrape_careerjet()


