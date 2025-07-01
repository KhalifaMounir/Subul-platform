from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from app import db
from app.models import Certification, Quiz, LabGuide, Video, User, Subpart, Lesson
from werkzeug.utils import secure_filename
import os
from functools import wraps
from .s3_utils import generate_presigned_url, upload_fileobj , delete_s3_object 
import logging



logging.basicConfig(level=logging.DEBUG)
admin_bp = Blueprint('admin_routes', __name__)
ALLOWED_EXTENSIONS = {'pdf', 'mp4', 'mov'}

def allowed_file(filename):
       return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
# Admin access decorator


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            logging.debug("User not authenticated")
            return jsonify({'error': 'Authentication required'}), 401
        if not hasattr(current_user, 'is_admin') or not current_user.is_admin:
            logging.debug(f"User {current_user.username} is not an admin")
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/admin/users', methods=['POST'])
@login_required
@admin_required
def admin_create_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    is_admin = data.get('is_admin', False)  # Default to False

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    user = User(username=username, is_admin=is_admin)
    user.set_password(password)  # Use set_password to hash
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'id': user.id,
        'username': username,
        'is_admin': is_admin
    }), 201

# Add lesson
@admin_bp.route('/admin/lessons', methods=['POST'])
@login_required
@admin_required
def admin_add_lesson():
    data = request.get_json()
    title = data.get('title')
    certification_id = data.get('certification_id')

    # Validate input
    if not title:
        return jsonify({'error': 'Lesson title required'}), 400
    if not certification_id:
        return jsonify({'error': 'Certification ID required'}), 400

    # Check if certification exists
    certification = Certification.query.get(certification_id)
    if not certification:
        return jsonify({'error': 'Certification not found'}), 404

    # Create new lesson
    lesson = Lesson(title=title, certification_id=certification_id, completed=False)
    db.session.add(lesson)
    db.session.commit()

    return jsonify({
        'id': lesson.id,
        'title': lesson.title,
        'certification_id': lesson.certification_id,
        'completed': lesson.completed
    }), 201

# Add certification
@admin_bp.route('/admin/certifications', methods=['POST'])
@login_required
@admin_required
def admin_add_certification():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    if not name:
        return jsonify({'error': 'Certification name required'}), 400
    if not description:
        return jsonify({'error': 'Certification description required'}), 400

    cert = Certification(name=name, description=description)
    db.session.add(cert)
    db.session.commit()
    return jsonify({'id': cert.id, 'name': cert.name, 'description': cert.description}), 201



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

 
@admin_bp.route('/api/certifications/by-name', methods=['GET'])
@login_required
@admin_required
def get_cert_id_by_name():
    cert_name = request.args.get('name')
    if not cert_name:
        return jsonify({'error': 'Certification name is required'}), 400

    cert = Certification.query.filter_by(name=cert_name).first()
    if not cert:
        return jsonify({'error': 'Certification not found'}), 404

    return jsonify({'cert_id': cert.id}), 200

# add lab guide
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
          object_key = f"lab_guides/{cert_id}/{filename}"
          bucket_name = os.getenv('S3_BUCKET_NAME', 'subul-platform-014498640042')

          if upload_fileobj(file, bucket_name, object_key):
              lab_guide = LabGuide.query.filter_by(cert_id=cert_id).first()
              if not lab_guide:
                  lab_guide = LabGuide(cert_id=cert_id)
                  db.session.add(lab_guide)

              lab_guide.object_key = object_key
              db.session.commit()

              url = generate_presigned_url(bucket_name, object_key)
              return jsonify({'id': lab_guide.id, 'cert_id': cert_id, 'pdf_url': url}), 201
          else:
              return jsonify({'error': 'Upload to S3 failed'}), 500
      return jsonify({'error': 'Invalid file type. Only PDF, MP4, or MOV allowed'}), 400

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



# Delete video
@admin_bp.route('/admin/certifications/<int:cert_id>/video/<int:video_id>', methods=['DELETE'])
@login_required
@admin_required
def admin_delete_video(cert_id, video_id):
    video = Video.query.filter_by(id=video_id, cert_id=cert_id).first()
    if not video:
        return jsonify({'error': 'Video not found'}), 404

    # Optionally delete from S3
    try:
        delete_s3_object(os.getenv('S3_BUCKET_NAME'), video.object_key)
    except Exception as e:
        current_app.logger.warning(f"Failed to delete video from S3: {str(e)}")

    db.session.delete(video)
    db.session.commit()
    return jsonify({'message': 'Video deleted successfully'}), 200


#Add subpart 
@admin_bp.route('/admin/subparts', methods=['POST'])
@login_required
@admin_required
def create_subpart():
    data = request.get_json()
    title = data.get('title')
    duration = data.get('duration')
    lesson_id = data.get('lesson_id')

    if not all([title, duration, lesson_id]):
        return jsonify({'error': 'Title, duration, and lesson_id are required'}), 400

    # Optional: validate that lesson exists
    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return jsonify({'error': 'Lesson not found'}), 404

    new_subpart = Subpart(title=title, duration=duration, lesson_id=lesson_id)
    db.session.add(new_subpart)
    db.session.commit()

    return jsonify({
        'id': new_subpart.id,
        'title': new_subpart.title,
        'duration': new_subpart.duration,
        'lesson_id': new_subpart.lesson_id
    }), 201

# Get lab guide
@admin_bp.route('/admin/certifications/<int:cert_id>/lab', methods=['GET'])
@login_required
@admin_required
def get_lab_guide(cert_id):
      lab_guide = LabGuide.query.filter_by(cert_id=cert_id).first()
      if not lab_guide or not lab_guide.object_key:
          return jsonify({'error': 'Lab guide not found'}), 404

      bucket_name = os.getenv('S3_BUCKET_NAME', 'subul-platform-014498640042')
      url = generate_presigned_url(bucket_name, lab_guide.object_key)
      return jsonify({'id': lab_guide.id, 'cert_id': cert_id, 'pdf_url': url}), 200
#get video
@admin_bp.route('/admin/subparts/<int:subpart_id>/video', methods=['GET'])
@login_required
@admin_required
def get_video(subpart_id):
    video = Video.query.filter_by(subpart_id=subpart_id).first()
    if not video or not video.object_key:
        return jsonify({'error': 'Video not found'}), 404

    bucket_name = os.getenv('S3_BUCKET_NAME', 'subul-platform-014498640042')
    url = generate_presigned_url(bucket_name, video.object_key)
    return jsonify({
        'id': video.id,
        'subpart_id': subpart_id,
        'title': video.title,
        'url': url
    }), 200
#delete lab guide
@admin_bp.route('/admin/certifications/<int:cert_id>/lab/<int:lab_id>', methods=['DELETE'])
@login_required
@admin_required
def admin_delete_lab_guide(cert_id, lab_id):
    lab_guide = LabGuide.query.filter_by(id=lab_id, cert_id=cert_id).first()
    if not lab_guide:
        return jsonify({'error': 'Lab guide not found'}), 404

    # Delete the file from S3
    bucket_name = os.getenv('S3_BUCKET_NAME', 'subul-platform-014498640042')
    if lab_guide.object_key and not delete_s3_object(bucket_name, lab_guide.object_key):
        return jsonify({'error': 'Failed to delete S3 object'}), 500

    # Delete the database record
    db.session.delete(lab_guide)
    db.session.commit()
    return jsonify({'message': 'Lab guide deleted successfully'}), 200

###

@admin_bp.route('/admin/subparts/<int:subpart_id>/video', methods=['POST'])
@login_required
@admin_required
def admin_add_video(subpart_id):
    subpart = Subpart.query.get(subpart_id)
    if not subpart:
        return jsonify({'error': 'Subpart not found'}), 404

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        object_key = f"videos/{subpart_id}/{filename}"
        bucket_name = os.getenv('S3_BUCKET_NAME', 'subul-platform-014498640042')

        if upload_fileobj(file, bucket_name, object_key):
            video = Video(subpart_id=subpart_id, object_key=object_key, title=filename)
            db.session.add(video)
            db.session.commit()

            url = generate_presigned_url(bucket_name, object_key)
            return jsonify({
                'id': video.id,
                'subpart_id': subpart_id,
                'title': filename,
                'url': url
            }), 201
        else:
            return jsonify({'error': 'Upload to S3 failed'}), 500
    return jsonify({'error': 'Invalid file type. Only PDF, MP4, or MOV allowed'}), 400



@admin_bp.route('/lessons-and-subparts', methods=['GET'])
@login_required
def get_lessons_and_subparts():
    certifications = Certification.query.all()
    result = []

    for cert in certifications:
        lessons = Lesson.query.filter_by(certification_id=cert.id).all()
        cert_data = {
            'id': cert.id,
            'name': cert.name,
            'booked_by_user': cert in current_user.certifications,
            'lessons': []
        }

        for lesson in lessons:
            subparts = Subpart.query.filter_by(lesson_id=lesson.id).all()
            lesson_data = {
                'id': lesson.id,
                'title': lesson.title,
                'completed': lesson.completed,
                'subparts': [
                    {
                        'id': subpart.id,
                        'title': subpart.title,
                        'duration': subpart.duration,
                        'videoId': subpart.video.id if subpart.video else None,  
                        'completed': subpart.completed,
                        'isQuiz': subpart.is_quiz
                    } for subpart in subparts
                ]
            }
            cert_data['lessons'].append(lesson_data)

        result.append(cert_data)

    return jsonify(result), 200