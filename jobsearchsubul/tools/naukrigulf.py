from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from time import sleep
import tempfile

from tool import parse_date_en
from producer import send_to_kafka

BASE_URL = "https://www.naukrigulf.com/jobs-in-oman?industryType=25&locale=en&xz=1_2_5"

def get_options():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--no-sandbox')
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.110 Safari/537.36")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    user_data_dir = tempfile.mkdtemp()
    options.add_argument(f"--user-data-dir={user_data_dir}")
    return options

def init_driver():
    options = get_options()
    driver = webdriver.Chrome(service=Service(), options=options)
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": "Object.defineProperty(navigator, 'webdriver', { get: () => undefined })"
    })
    return driver

def get_job_description(driver, link):
    try:
        driver.get(link)
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "article.job-description"))
        )
        sleep(2)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        article = soup.find("article", class_="job-description")
        if not article:
            return "N/A"

        paragraphs = [p.get_text(strip=True) for p in article.find_all("p") if p.get_text(strip=True)]
        lists = [
            "- " + li.get_text(strip=True)
            for ul in article.find_all("ul")
            for li in ul.find_all("li") if li.get_text(strip=True)
        ]
        full_description = "\n".join(paragraphs + lists)
        return full_description.strip() or "N/A"
    except Exception as e:
        print(f"[ERROR] Description fetch error on {link} : {e}")
        return "N/A"

def extract_job_data(card):
    date_tag = card.find("span", class_="time")
    date_posted = date_tag.get_text(strip=True) if date_tag else "N/A"
    if "30+ days ago" in date_posted:
        return None

    title = card.find("p", class_="designation-title")
    company = card.find("a", class_="info-org")
    location_tag = card.select_one("li.info-loc")
    experience_tag = card.find("li", class_="info-exp")
    description_tag = card.find("p", class_="description")

    return {
        "title": title.get_text(strip=True) if title else "N/A",
        "company": company.get_text(strip=True) if company else "N/A",
        "location": location_tag.find_all("span")[-1].get_text(strip=True) if location_tag else "N/A",
        "experience": experience_tag.find("span").get_text(strip=True) if experience_tag else "N/A",
        "short_description": description_tag.get_text(strip=True) if description_tag else "N/A",
        "date_posted": parse_date_en(date_posted),
        "url": card.find("a", class_="info-position")["href"] if card.find("a", class_="info-position") else "N/A",
        "source": "naukrigulf"
    }

def scrape_naukri(driver, base_url):
    current_page = 1
    base_pagination_url = "https://www.naukrigulf.com/jobs-in-oman"
    query_params = "?industryType=25&xz=1_2_5"
    visited_urls = set()

    while True:
        current_url = f"{base_pagination_url}{query_params}" if current_page == 1 \
            else f"{base_pagination_url}-{current_page}{query_params}"

        if current_url in visited_urls:
            print("[INFO] URL déjà visitée - arrêt.")
            break
        visited_urls.add(current_url)

        print(f"\n[INFO] Scraping page {current_page}: {current_url}")
        driver.get(current_url)

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.ng-box.srp-tuple"))
            )
        except:
            print("[ERROR] Timeout ou fin des offres.")
            break

        soup = BeautifulSoup(driver.page_source, "html.parser")
        job_cards = soup.find_all("div", class_="ng-box srp-tuple")
        if not job_cards:
            print("[INFO] Aucune offre trouvée sur cette page.")
            break

        for card in job_cards:
            job_data = extract_job_data(card)
            if not job_data:
                continue

            link = job_data["url"]
            if link != "N/A" and not link.startswith("http"):
                job_data["url"] = "https://www.naukrigulf.com" + link

            job_data["description"] = get_job_description(driver, job_data["url"]) if job_data["url"] != "N/A" else "N/A"

            send_to_kafka(job_data)
            sleep(1)

        current_page += 1
        sleep(2)

def run_scraping(base_url):
    driver = init_driver()
    try:
        scrape_naukri(driver, base_url)
    finally:
        driver.quit()


if __name__ == "__main__":
    run_scraping(BASE_URL)
