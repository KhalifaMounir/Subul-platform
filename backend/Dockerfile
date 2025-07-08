FROM python:3.10-slim

WORKDIR /app

# Copier requirements global à la racine du contexte
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/config.py ./config.py
COPY jobsearchsubul ./jobsearchsubul

ENV PYTHONPATH=/app
ENV FLASK_APP=app

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "120", "app:create_app()"]
