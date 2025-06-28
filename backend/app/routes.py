from flask import Blueprint, request, jsonify,current_app
from app import db, login_manager
from app.models import User
from flask_login import login_user, logout_user, login_required
from werkzeug.security import check_password_hash
from flask_login import current_user
from app.models import Job, User, Certification, Quiz, LabGuide, Video
from werkzeug.utils import secure_filename
import os
from flask_login import logout_user
from flask_cors import CORS




bp = Blueprint('routes', __name__)

# Allow from Next.js origin
CORS(bp, supports_credentials=True, origins=['http://localhost:3000'])
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({
            'message': 'Login successful',
            'user_id': user.id,
            'is_admin': user.is_admin  # Add is_admin
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200
    

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

@bp.route('/certifications/<int:cert_id>', methods=['GET'])
@login_required
def get_certification(cert_id):
    cert = Certification.query.get_or_404(cert_id)
    if cert not in current_user.certifications:
        return jsonify({'message': 'غير مصرح لك بالوصول إلى هذه الدورة'}), 403
    return jsonify({'id': cert.id, 'name': cert.name}), 200

@bp.route('/certifications/<int:cert_id>/lessons', methods=['GET'])
@login_required
def get_lessons(cert_id):
    cert = Certification.query.get_or_404(cert_id)
    if cert not in current_user.certifications:
        return jsonify({'message': 'غير مصرح لك بالوصول إلى هذه الدورة'}), 403

    lessons = Lesson.query.filter_by(certification_id=cert_id).all()
    result = []
    for lesson in lessons:
        subparts = Subpart.query.filter_by(lesson_id=lesson.id).all()
        result.append({
            'id': lesson.id,
            'title': lesson.title,
            'completed': lesson.completed,
            'subparts': [
                {
                    'id': subpart.id,
                    'title': subpart.title,
                    'duration': subpart.duration,
                    'videoUrl': subpart.video_url,
                    'completed': subpart.completed,
                    'isQuiz': subpart.is_quiz
                } for subpart in subparts
            ]
        })
    return jsonify(result), 200

@bp.route('/subparts/<int:subpart_id>/complete', methods=['POST'])
@login_required
def complete_subpart(subpart_id):
    subpart = Subpart.query.get_or_404(subpart_id)
    lesson = Lesson.query.get(subpart.lesson_id)
    cert = Certification.query.get(lesson.certification_id)
    if cert not in current_user.certifications:
        return jsonify({'message': 'غير مصرح لك بالوصول إلى هذه الدورة'}), 403
    subpart.completed = True
    lesson.completed = all(s.completed for s in lesson.subparts)
    db.session.commit()
    return jsonify({'message': 'Subpart marked as completed'}), 200
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


#Submit Answer Route

@bp.route('/quiz/<int:quiz_id>/answer', methods=['POST'])
@login_required
def submit_quiz_answer(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    data = request.get_json()
    selected = data.get('selected_option')

    if not selected:
        return jsonify({'error': 'Selected option required'}), 400

    is_correct = selected.strip().lower() == quiz.answer.strip().lower()

    # Optional: check if already answered
    existing = UserQuizAnswer.query.filter_by(user_id=current_user.id, quiz_id=quiz_id).first()
    if existing:
        return jsonify({'message': 'Already answered this question'}), 400

    answer = UserQuizAnswer(
        user_id=current_user.id,
        quiz_id=quiz_id,
        selected_option=selected,
        is_correct=is_correct
    )
    db.session.add(answer)
    db.session.commit()

    return jsonify({
        'quiz_id': quiz.id,
        'selected': selected,
        'correct_answer': quiz.answer,
        'is_correct': is_correct
    }), 200

#Route to Get Quiz Results for a User

@bp.route('/quiz/results/<int:cert_id>', methods=['GET'])
@login_required
def get_quiz_results(cert_id):
    quizzes = Quiz.query.filter_by(cert_id=cert_id).all()
    results = []

    for quiz in quizzes:
        answer = UserQuizAnswer.query.filter_by(user_id=current_user.id, quiz_id=quiz.id).first()
        results.append({
            'quiz_id': quiz.id,
            'question': quiz.question,
            'selected': answer.selected_option if answer else None,
            'correct': quiz.answer,
            'is_correct': answer.is_correct if answer else None,
            'timestamp': quiz.timestamp
        })

    return jsonify(results), 200




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