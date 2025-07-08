import os
import re
import ast
import numpy as np
import psycopg2
from openai import AzureOpenAI
from dotenv import load_dotenv
from cachetools import TTLCache


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_CHAT_ENDPOINT")
)





def generate_profile_description(certifications):
    prompt = f"""
    Generate a professional profile description for someone with these certifications: 
    {', '.join(certifications)}. Focus on:
    - Technical skills implied by certifications
    - Target job roles and industries
    - Key technologies/tools mentioned
    Use maximum 2 concise sentences. Output ONLY the description text.
    """
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=100
    )
    return response.choices[0].message.content.strip()

def extract_keywords(certifications):
    keywords = set()
    for cert in certifications:
        cleaned = re.sub(r'(certified|professional|associate|specialist|exam)', '', cert, flags=re.IGNORECASE)
        keywords.add(cleaned.strip().lower())
        keywords.update([word.lower() for word in re.findall(r'\b(\w{4,})\b', cleaned)])
    return list(keywords)

def get_embedding(text):
    response = client.embeddings.create(
        input=[text],
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    )
    return response.data[0].embedding

def cosine_similarity(a, b):
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return np.dot(a, b) / (norm_a * norm_b)

def clean_text(text):
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'[^\w\s/-]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip().lower()

def keyword_match_score(text, keywords):
    text = text.lower()
    matches = sum(1 for kw in keywords if kw in text)
    return matches / len(keywords) if keywords else 0




job_cache = TTLCache(maxsize=100, ttl=3600)

def get_cert_cache_key(certifications):
    return '|'.join(sorted(certifications)).lower()

def find_best_jobs(certifications):
    key = get_cert_cache_key(certifications)

    if key in job_cache:
        print(" Résultats récupérés depuis le cache.")
        return job_cache[key]

    print(f"\n🎓 Certifications fournies: {', '.join(certifications)}")

    profile_text = generate_profile_description(certifications)
    print(f" Profil généré: {profile_text}")

    user_embedding = np.array(get_embedding(profile_text), dtype=float)
    keywords = extract_keywords(certifications)
    print(f" Mots-clés extraits: {keywords}")

    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor(name='job_cursor')

    keyword_condition = " OR ".join([
        "(title ILIKE %s OR description ILIKE %s)"
        for _ in keywords
    ])
    params = []
    for kw in keywords:
        like_kw = f"%{kw}%"
        params.extend([like_kw, like_kw])

    sql = f"""
        SELECT title, company, url, description, location, date_posted, embedding
        FROM jobs
        WHERE date_posted >= NOW() - INTERVAL '2 months'
        AND ({keyword_condition})
        LIMIT 500
    """

    cursor.execute(sql, params)

    results = []
    for title, company, url, description, location, date_posted, emb in cursor:
        try:
            emb_vector = np.array(ast.literal_eval(emb), dtype=float)
            similarity_score = cosine_similarity(user_embedding, emb_vector)

            combined_text = clean_text(f"{title} {description or ''}")
            keyword_score = keyword_match_score(combined_text, keywords)

            if similarity_score > 0.8:
                final_score = 0.8 * similarity_score + 0.2 * keyword_score
            else:
                final_score = 0.4 * similarity_score + 0.6 * keyword_score

            results.append({
                'title': title,
                'company': company,
                'url': url,
                'description': description,
                'location': location,
                'date_posted': date_posted,
                'final_score': final_score,
                'similarity_score': similarity_score,
                'keyword_score': keyword_score
            })
        except Exception as e:
            print(f"Erreur sur {title[:40]}: {e}")

    cursor.close()
    conn.close()

    results.sort(key=lambda x: x['final_score'], reverse=True)
    top_jobs = results[:100]

    job_cache[key] = top_jobs

    print(f"\n Top {min(10, len(top_jobs))} recommandations :\n")
    for i, job in enumerate(top_jobs[:10]):
        print(f"{i+1}. {job['title']} chez {job['company']}")
        print(f"   Score final : {job['final_score']:.2f} (Sim: {job['similarity_score']:.2f} | KW: {job['keyword_score']:.2f})")
        print(f"    {job['url']}\n")

    return top_jobs


if __name__ == "__main__":
    users = {
        "User1": ["AWS Certified Cloud Practitioner", "Azure Fundamentals"],
        "User2": ["Google Cloud Certified", "Certified Kubernetes Administrator"],
        "User3": ["Certified Data Scientist", "AWS Solutions Architect"]
    }

    for user, certs in users.items():
        print(f"\n {user}")
        find_best_jobs(certs)
