from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import os
from app.s3_utils import generate_presigned_url

# Association tables
user_certifications = db.Table(
    'user_certifications',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('certification_id', db.Integer, db.ForeignKey('certification.id'), primary_key=True)
)

job_certifications = db.Table(
    'job_certifications',
    db.Column('job_id', db.Integer, db.ForeignKey('job.id'), primary_key=True),
    db.Column('certification_id', db.Integer, db.ForeignKey('certification.id'), primary_key=True)
)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    certifications = db.relationship('Certification', secondary=user_certifications, backref='users')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Certification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    lessons = db.relationship('Lesson', backref='certification', lazy=True)
class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'))
    question = db.Column(db.String(256))
    options = db.Column(db.JSON)
    answer = db.Column(db.String(128))
    timestamp = db.Column(db.Float) # When to show the quiz in the video

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128))
    description = db.Column(db.Text)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'))
    certifications = db.relationship('Certification', secondary=job_certifications, backref='jobs')

class LabGuide(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'))
    object_key = db.Column(db.String(255))

    @property
    def pdf_url(self):
        return generate_presigned_url(os.getenv("S3_BUCKET_NAME"), self.object_key)

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cert_id = db.Column(db.Integer, db.ForeignKey('certification.id'))
    title = db.Column(db.String(128))
    object_key = db.Column(db.String(255))

    @property
    def url(self):
        return generate_presigned_url(os.getenv("S3_BUCKET_NAME"), self.object_key)

class UserQuizAnswer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    selected_option = db.Column(db.String(128), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)

    user = db.relationship('User', backref='quiz_answers')
    quiz = db.relationship('Quiz', backref='user_answers')

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    certification_id = db.Column(db.Integer, db.ForeignKey('certification.id'), nullable=False)
    subparts = db.relationship('Subpart', backref='lesson', lazy=True)
    completed = db.Column(db.Boolean, default=False)

class Subpart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    duration = db.Column(db.String(50), nullable=False)
    video_url = db.Column(db.String(255), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    is_quiz = db.Column(db.Boolean, default=False)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.id'), nullable=False)