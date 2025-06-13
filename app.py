from flask import Flask, render_template, redirect, url_for
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-fallback')

@app.route('/')
def index():
    # Temporary: Bypass login for testing frontend
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)