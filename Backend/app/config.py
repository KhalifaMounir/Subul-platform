import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-fallback')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///subul.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False