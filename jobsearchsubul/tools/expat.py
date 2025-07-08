import requests
from bs4 import BeautifulSoup
import time
import re
from tool import parse_date_en
from producer import send_to_kafka


url = "https://www.expat.com/en/jobs/middle-east/oman/"

def clean_text(text):
    if not isinstance(text, str):
        return text
    text = re.sub(r'[\s\n\t\xa0\u200b]+', ' ', text)
    return ''.join(c for c in text if c.isprintable()).strip()


base_url = "https://www.expat.com"
url = "https://www.expat.com/en/jobs/middle-east/oman/" 
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36"
}


def scrape_expat():
    current_page = 1
    next_url = url

    while True:
        print(f"\n[INFO] Scraping page {current_page} : {next_url}")
        response = requests.get(next_url, headers=headers)
        if response.status_code != 200:
            print(f"Error HTTP {response.status_code}")
            break

        soup = BeautifulSoup(response.content, "html.parser")
        job_boxes = soup.find_all("div", class_="item-box")

        if not job_boxes:
            print("[INFO] No offers found. Stop.")
            break

        for box in job_boxes:
            job = {}

            title_tag = box.find("a", class_="item-box__title")
            job_title = clean_text(title_tag.text.strip()) if title_tag else "N/A"

            company_div = box.find("div", class_="item-box__user")
            job_company = clean_text(company_div.text.strip()) if company_div else "N/A"

            misc = box.find("div", class_="item-box__misc")
            job_location = "N/A"
            job_date_posted = "0000-00-00T00:00:00"

            if misc:
                misc_texts = [clean_text(x.strip()) for x in misc.stripped_strings]
                job_location = misc_texts[0] if len(misc_texts) > 0 else "N/A"

                for text in misc_texts:
                    if "Added on" in text:
                        date_str = text.replace("Added on", "").strip()
                        parsed_date = parse_date_en(date_str)
                        job_date_posted = parsed_date or "0000-00-00T00:00:00"
                        break

            job_link = "N/A"
            if title_tag and title_tag.has_attr("href"):
                relative_url = title_tag["href"]
                job_link = base_url + relative_url if relative_url.startswith("/") else relative_url

            job_description = "N/A"
            if job_link != "N/A":
                try:
                    detail_resp = requests.get(job_link, headers=headers)
                    detail_soup = BeautifulSoup(detail_resp.content, "html.parser")
                    description_div = detail_soup.find("div", class_="block-description")
                    description = description_div.get_text(separator=" ", strip=True) if description_div else "N/A"
                    job_description = clean_text(description)
                except Exception as e:
                    print(f"[ERROR] Échec de récupération de la description pour {job_link}: {e}")


            job_data = {
                "title": job_title,
                "company": job_company,
                "location": job_location,
                "description": job_description,
                "date_posted": job_date_posted,
                "url": job_link,
                "source": "expat"
            }
            send_to_kafka(job_data)


        next_button = soup.find("a", {"rel": "next"})
        if next_button and "href" in next_button.attrs:
            next_url = base_url + next_button["href"]
            current_page += 1
            time.sleep(2)
        else:
            print("\n[INFO] Fin des résultats.")
            break

if __name__ == "__main__":
    jobs = scrape_expat()