from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'login'
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    
    from app.routes import bp
    from app.admin_routes import admin_bp
    app.register_blueprint(bp)
    app.register_blueprint(admin_bp)

    with app.app_context():
        db.create_all()
    
    return app