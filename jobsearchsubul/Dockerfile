FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gnupg wget unzip cron libnss3 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 \
    libxrandr2 libxss1 libxtst6 libasound2 libatk-bridge2.0-0 libgtk-3-0 fonts-liberation curl \
    python3-pip netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

RUN wget -qO - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /usr/share/keyrings/google-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-archive-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

RUN CHROMEDRIVER_VERSION="138.0.7204.49" && \
    wget -q https://storage.googleapis.com/chrome-for-testing-public/${CHROMEDRIVER_VERSION}/linux64/chromedriver-linux64.zip && \
    unzip chromedriver-linux64.zip && \
    mv chromedriver-linux64/chromedriver /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm -rf chromedriver*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY jobsearchsubul ./jobsearchsubul
COPY backend/app ./app
COPY backend/config.py ./config.py

ENV PYTHONPATH=/app

HEALTHCHECK --interval=5s --timeout=10s --retries=10 \
    CMD nc -z kafka 9092 || exit 1

CMD bash -c "while ! nc -z kafka 9092; do sleep 2; done && \
             python jobsearchsubul/tools/deployment.py && \
             prefect agent start -q default"