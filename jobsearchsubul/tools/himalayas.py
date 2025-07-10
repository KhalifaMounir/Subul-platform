from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
import tempfile
from tool import parse_date_en
from producer import send_to_kafka

BASE_URL = "https://himalayas.app"
CATEGORY_PATHS = [
    "/jobs/countries/oman/aws",
    "/jobs/countries/oman/azure",
    "/jobs/countries/oman/google-cloud",
    "/jobs/countries/oman/cloud-devops"
]

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

def get_jobs_from_category(driver, category_path):
    current_url = BASE_URL + category_path
    jobs_meta = []
    visited_pages = set()

    while True:
        if current_url in visited_pages:
            print(f"Déjà visité : {current_url}")
            break
        visited_pages.add(current_url)

        driver.get(current_url)
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "article.flex.flex-shrink-0.cursor-pointer")
                )
            )
        except:
            print("Timeout, aucune offre trouvée.")
            break

        jobs_on_page = driver.find_elements(By.CSS_SELECTOR, "article.flex.flex-shrink-0.cursor-pointer")
        print(f"{len(jobs_on_page)} offres trouvées sur la page")

        for job_block in jobs_on_page:
            try:
                title_elem = job_block.find_element(By.CSS_SELECTOR, "a.text-xl.font-medium.text-gray-900")
                title = title_elem.text.strip()
                url = title_elem.get_attribute("href")

                date_elem = job_block.find_element(By.CSS_SELECTOR, "time.text-gray-600")
                raw_date = date_elem.get_attribute("textContent").strip()
                date_posted = parse_date_en(raw_date)

                company_elem = job_block.find_element(By.CSS_SELECTOR, "a.inline-flex.items-center.font-medium.text-gray-900")
                company = company_elem.text.strip()

                location = "Remote"

                jobs_meta.append({
                    "title": title,
                    "url": url,
                    "date_posted": date_posted,
                    "company": company,
                    "location": location
                })
            except Exception as e:
                print(f"Erreur lors de l'extraction d'une offre : {e}")
                continue

        try:
            next_btn = driver.find_element(
                By.CSS_SELECTOR, "nav[aria-label='pagination'] a.flex.flex-row-reverse"
            )
            next_href = next_btn.get_attribute("href")
            if not next_href or next_href in visited_pages:
                print("Fin de pagination")
                break
            current_url = next_href
            sleep(1)
        except:
            print("Pas de bouton 'Next'")
            break

    return jobs_meta

def get_job_description(driver, url):
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "article.mb-8.md\\:mb-12.md\\:text-lg"))
        )
        article = driver.find_element(By.CSS_SELECTOR, "article.mb-8.md\\:mb-12.md\\:text-lg")
        return article.text.strip()
    except Exception as e:
        print(f"Erreur de description ({url}) : {e}")
        return ""

def scrape_himalayas():
    driver = init_driver()
    try:
        for path in CATEGORY_PATHS:
            print(f"\n--- Catégorie {path} ---")
            jobs_meta = get_jobs_from_category(driver, path)

            for job in jobs_meta:
                description = get_job_description(driver, job['url'])
                job['description'] = description

                try:
                    send_to_kafka(job)
                    print(f"[Kafka OK] {job['title']} - {job['company']}")
                except Exception as e:
                    print(f"[Kafka ERROR] {job['title']} : {e}")

                sleep(1)
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_himalayas()
