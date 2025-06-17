from flask import Blueprint, request, jsonify,current_app
from app import db, login_manager
from app.models import User
from flask_login import login_user, logout_user, login_required
from werkzeug.security import check_password_hash
from flask_login import current_user
from app.models import Job, User, Certification, Quiz, LabGuide, Video
from werkzeug.utils import secure_filename
import os
bp = Blueprint('routes', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'Login successful', 'user_id': user.id}), 200
    return jsonify({'message': 'Invalid credentials'}), 401


    

@bp.route('/dashboard', methods=['GET'])
@login_required
def dashboard():
    return jsonify({'message': 'Welcome to your dashboard'}), 200

@bp.route('/certifications', methods=['GET'])
@login_required
def certifications():
    all_certs = Certification.query.all()
    user_cert_ids = {cert.id for cert in current_user.certifications}  

    result = []
    for cert in all_certs:
        result.append({
            'id': cert.id,
            'name': cert.name,
            'booked_by_user': cert.id in user_cert_ids  # True/False     if user booked it
        })

    return jsonify(result), 200


@bp.route('/quiz/<int:cert_id>', methods=['GET'])
@login_required
def get_quiz(cert_id):
    quiz_items = Quiz.query.filter_by(cert_id=cert_id).all()
    return jsonify([
        {
            'id': q.id,
            'question': q.question,
            'options': q.options,
            'answer': q.answer  
        } for q in quiz_items
    ]), 200


@bp.route('/lab/<int:cert_id>', methods=['GET'])
@login_required
def get_lab_guide(cert_id):
    guide = LabGuide.query.filter_by(cert_id=cert_id).first()
    if guide:
        return jsonify({'id': guide.id, 'pdf_url': guide.pdf_url}), 200
    return jsonify({'message': 'Lab guide not found'}), 404


@bp.route('/video/<int:cert_id>', methods=['GET'])
@login_required
def get_video(cert_id):
    videos = Video.query.filter_by(cert_id=cert_id).all()
    return jsonify([
        {'id': v.id, 'title': v.title, 'url': v.url} for v in videos
    ]), 200

@bp.route('/jobs/<int:cert_id>', methods=['GET'])
@login_required
def get_jobs(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return jsonify({'message': 'Certification not found'}), 404

    jobs = cert.jobs

    if not jobs:
        return jsonify({'message': 'No jobs found for this certification'}), 404

    return jsonify([
        {
            'id': job.id,
            'title': job.title,
            'description': job.description
        } for job in jobs
    ]), 200



@bp.route('/quiz/<int:cert_id>', methods=['POST'])
@login_required
def add_quiz(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return jsonify({'error': 'Certification not found'}), 404

    data = request.get_json()
    question = data.get('question')
    options = data.get('options')
    answer = data.get('answer')

    if not question or not options or not answer:
        return jsonify({'error': 'Question, options and answer required'}), 400

    quiz = Quiz(cert_id=cert_id, question=question, options=options, answer=answer)
    db.session.add(quiz)
    db.session.commit()

    return jsonify({
        'id': quiz.id,
        'cert_id': cert_id,
        'question': question,
        'options': options,
        'answer': answer
    }), 201


@bp.route('/video/<int:cert_id>', methods=['POST'])
@login_required
def add_video(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return jsonify({'error': 'Certification not found'}), 404

    data = request.get_json()
    title = data.get('title')
    url = data.get('url')

    if not title or not url:
        return jsonify({'error': 'Video title and URL required'}), 400

    video = Video(cert_id=cert_id, title=title, url=url)
    db.session.add(video)
    db.session.commit()

    return jsonify({'id': video.id, 'title': title, 'url': url}), 201