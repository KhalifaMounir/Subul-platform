from .models import User, Certification, Quiz, Job
from . import db

def get_user_by_email(email):
    return User.query.filter_by(email=email).first()