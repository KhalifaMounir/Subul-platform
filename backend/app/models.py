from app import db, login_manager
from flask_login import UserMixin
from passlib.hash import scrypt
from werkzeug.security import generate_password_hash, check_password_hash

user_certifications = db.Table('user_certifications',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('certification_id', db.Integer, db.ForeignKey('certification.id'), primary_key=True)
)
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    certifications = db.relationship('Certification', secondary=user_certifications, backref='users')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)  

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)  


class Certification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'))
    question = db.Column(db.String(256))
    options = db.Column(db.JSON)
    answer = db.Column(db.String(128))
    timestamp = db.Column(db.Float)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'))
    title = db.Column(db.String(128))
    description = db.Column(db.Text)

class LabGuide(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'))
    pdf_url = db.Column(db.String(256))  
    
class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'))
    title = db.Column(db.String(128))
    url = db.Column(db.String(256))