import requests
from bs4 import BeautifulSoup
from time import sleep
from tool import parse_date_en, clean_description
from producer import send_to_kafka



url = "https://www.gulftalent.com/oman/jobs"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0 Safari/537.36"
}



def get_job_description(link):
    """Récupère la description complète à partir de la page de l'offre"""
    try:
        response = requests.get(link, headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        desc_container = soup.find("div", class_="panel-body content-visibility-auto job-description")
        if desc_container:
            paragraphs = desc_container.find_all("p")
            full_description = "\n".join(
                [p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)]
            )
            return full_description
        else:
            return "N/A"
    except Exception as e:
        print(f"Erreur lors de l'extraction de la description sur {link} : {e}")
        return "N/A"


def extract_job_data(row):
    """Extrait les données principales d'une offre à partir d'une ligne du tableau"""
    title_tag = row.find("a", class_="ga-job-impression")
    company_tag = row.find("a", class_="text-base text-muted text-secondary-hover")
    location_tag = row.find("a", class_="text-base text-regular text-secondary-hover")
    date_tag = row.find("td", class_="col-sm-4")

    return {
        "title": title_tag.get_text(strip=True) if title_tag else "N/A",
        "company": company_tag.get_text(strip=True) if company_tag else "N/A",
        "location": location_tag.get_text(strip=True) if location_tag else "N/A",
        "date_posted": parse_date_en(date_tag.get_text(strip=True)) if date_tag else "0000-00-00T00:00:00",
        "url": (
            "https://www.gulftalent.com"  + title_tag["href"]
            if title_tag and title_tag.has_attr("href") else "N/A"
        ),
        "source": "gulftalent"  
    }


def scrape_gulftalent(base_url):
    """Scrape toutes les pages disponibles en évitant les doublons"""
    current_page = 1
    visited_urls = set()

    while True:
        print(f"\n[INFO] Scraping Page {current_page}: {base_url}")
        response = requests.get(base_url, headers=HEADERS)
        if response.status_code != 200:
            print(f"[ERROR] Échec de requête HTTP {response.status_code}")
            break

        soup = BeautifulSoup(response.text, "html.parser")
        job_rows = soup.find_all("tr", class_="content-visibility-auto")

        if not job_rows:
            print("[INFO] Aucune offre trouvée. Fin du scraping.")
            break

        for row in job_rows:
            job_data = extract_job_data(row)

            job_data["description"] = get_job_description(job_data["url"]) if job_data["url"] != "N/A" else "N/A"
            job_data["description"] = clean_description(job_data["description"])

            send_to_kafka(job_data)

            sleep(1)  

        pagination = soup.find("ul", class_="pagination")
        next_link_tag = pagination.find("a", string="Next") if pagination else None

        if next_link_tag and next_link_tag.has_attr("href"):
            next_page_url = "https://www.gulftalent.com"  + next_link_tag["href"]
            if next_page_url in visited_urls:
                print("[INFO] Page déjà visitée. Arrêt du scraping.")
                break
            visited_urls.add(next_page_url)
            base_url = next_page_url
            current_page += 1
        else:
            print("\n[INFO] Fin de la pagination.")
            break

if __name__ == "__main__":
    base_url = "https://www.gulftalent.com/oman/jobs"
    jobs = scrape_gulftalent(base_url)
