from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from app import db
from app.models import Certification, Quiz, LabGuide, Video
from werkzeug.utils import secure_filename
import os

admin_bp = Blueprint('admin_routes', __name__)

# Admin access decorator
def admin_required(f):
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not hasattr(current_user, 'is_admin') or not current_user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function


# Add certification
@admin_bp.route('/admin/certifications', methods=['POST'])
@login_required
@admin_required
def admin_add_certification():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Certification name required'}), 400

    cert = Certification(name=name)
    db.session.add(cert)
    db.session.commit()
    return jsonify({'id': cert.id, 'name': cert.name}), 201



# Add quiz to certification
@admin_bp.route('/admin/certifications/<int:cert_id>/quiz', methods=['POST'])
@login_required
@admin_required
def admin_add_quiz(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return jsonify({'error': 'Certification not found'}), 404

    data = request.get_json()
    question = data.get('question')
    options = data.get('options')
    answer = data.get('answer')

    if not question or not options or not answer:
        return jsonify({'error': 'Question, options, and answer required'}), 400

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

# Add lab guide to certification
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@admin_bp.route('/admin/certifications/<int:cert_id>/lab', methods=['POST'])
@login_required
@admin_required
def admin_add_lab_guide(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return jsonify({'error': 'Certification not found'}), 404

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        lab_guide = LabGuide.query.filter_by(cert_id=cert_id).first()
        if not lab_guide:
            lab_guide = LabGuide(cert_id=cert_id)
            db.session.add(lab_guide)

        lab_guide.pdf_url = file_path
        db.session.commit()

        return jsonify({'id': lab_guide.id, 'cert_id': cert_id, 'pdf_url': file_path}), 201
    return jsonify({'error': 'Invalid file type. Only PDF allowed'}), 400

# Add video to certification
@admin_bp.route('/admin/certifications/<int:cert_id>/video', methods=['POST'])
@login_required
@admin_required
def admin_add_video(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return jsonify({'error': 'Certification not found'}), 404

    data = request.get_json()
    title = data.get('title')
    url = data.get('url')

    if not title or not url:
        return jsonify({'error': 'Title and URL required'}), 400

    video = Video(cert_id=cert_id, title=title, url=url)
    db.session.add(video)
    db.session.commit()

    return jsonify({'id': video.id, 'cert_id': cert_id, 'title': title, 'url': url}), 201

# Edit certification
@admin_bp.route('/admin/certifications/<int:cert_id>', methods=['PUT'])
@login_required
@admin_required
def admin_edit_certification(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return jsonify({'error': 'Certification not found'}), 404

    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Certification name required'}), 400

    cert.name = name
    db.session.commit()
    return jsonify({'id': cert.id, 'name': cert.name}), 200

# Edit quiz
@admin_bp.route('/admin/certifications/<int:cert_id>/quiz/<int:quiz_id>', methods=['PUT'])
@login_required
@admin_required
def admin_edit_quiz(cert_id, quiz_id):
    quiz = Quiz.query.filter_by(id=quiz_id, cert_id=cert_id).first()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    data = request.get_json()
    question = data.get('question')
    options = data.get('options')
    answer = data.get('answer')

    if not question or not options or not answer:
        return jsonify({'error': 'Question, options, and answer required'}), 400

    quiz.question = question
    quiz.options = options
    quiz.answer = answer
    db.session.commit()

    return jsonify({
        'id': quiz.id,
        'cert_id': cert_id,
        'question': question,
        'options': options,
        'answer': answer
    }), 200

# Edit lab guide
@admin_bp.route('/admin/certifications/<int:cert_id>/lab/<int:lab_id>', methods=['PUT'])
@login_required
@admin_required
def admin_edit_lab_guide(cert_id, lab_id):
    lab_guide = LabGuide.query.filter_by(id=lab_id, cert_id=cert_id).first()
    if not lab_guide:
        return jsonify({'error': 'Lab guide not found'}), 404

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        lab_guide.pdf_url = file_path
        db.session.commit()

        return jsonify({'id': lab_guide.id, 'cert_id': cert_id, 'pdf_url': file_path}), 200
    return jsonify({'error': 'Invalid file type. Only PDF allowed'}), 400

# Edit video
@admin_bp.route('/admin/certifications/<int:cert_id>/video/<int:video_id>', methods=['PUT'])
@login_required
@admin_required
def admin_edit_video(cert_id, video_id):
    video = Video.query.filter_by(id=video_id, cert_id=cert_id).first()
    if not video:
        return jsonify({'error': 'Video not found'}), 404

    data = request.get_json()
    title = data.get('title')
    url = data.get('url')

    if not title or not url:
        return jsonify({'error': 'Title and URL required'}), 400

    video.title = title
    video.url = url
    db.session.commit()

    return jsonify({'id': video.id, 'cert_id': cert_id, 'title': title, 'url': url}), 200

# Delete certification
@admin_bp.route('/admin/certifications/<int:cert_id>', methods=['DELETE'])
@login_required
@admin_required
def admin_delete_certification(cert_id):
    cert = Certification.query.get(cert_id)
    if not cert:
        return jsonify({'error': 'Certification not found'}), 404

    db.session.delete(cert)
    db.session.commit()
    return jsonify({'message': 'Certification deleted successfully'}), 200

# Delete quiz
@admin_bp.route('/admin/certifications/<int:cert_id>/quiz/<int:quiz_id>', methods=['DELETE'])
@login_required
@admin_required
def admin_delete_quiz(cert_id, quiz_id):
    quiz = Quiz.query.filter_by(id=quiz_id, cert_id=cert_id).first()
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    db.session.delete(quiz)
    db.session.commit()
    return jsonify({'message': 'Quiz deleted successfully'}), 200

# Delete lab guide
@admin_bp.route('/admin/certifications/<int:cert_id>/lab/<int:lab_id>', methods=['DELETE'])
@login_required
@admin_required
def admin_delete_lab_guide(cert_id, lab_id):
    lab_guide = LabGuide.query.filter_by(id=lab_id, cert_id=cert_id).first()
    if not lab_guide:
        return jsonify({'error': 'Lab guide not found'}), 404

    db.session.delete(lab_guide)
    db.session.commit()
    return jsonify({'message': 'Lab guide deleted successfully'}), 200

# Delete video
@admin_bp.route('/admin/certifications/<int:cert_id>/video/<int:video_id>', methods=['DELETE'])
@login_required
@admin_required
def admin_delete_video(cert_id, video_id):
    video = Video.query.filter_by(id=video_id, cert_id=cert_id).first()
    if not video:
        return jsonify({'error': 'Video not found'}), 404

    db.session.delete(video)
    db.session.commit()
    return jsonify({'message': 'Video deleted successfully'}), 200