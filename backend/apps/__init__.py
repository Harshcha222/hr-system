# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# import os
# from dotenv import load_dotenv

# from flask_mail import Mail

# mail = Mail()
# load_dotenv()

# db = SQLAlchemy()
# migrate = Migrate()
# jwt = JWTManager()

# # def create_app():
# #     app = Flask(__name__)

# #     app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# #     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# #     app.config['JWT_SECRET_KEY'] = 'secret-key'

# #     db.init_app(app)
# #     migrate.init_app(app, db)
# #     jwt.init_app(app)
# #     CORS(app)

# #     from apps.routes import auth_bp
# #     # from apps.routes import user_bp
# #     from apps.routes import task_bp

# #     app.register_blueprint(auth_bp)
# #     # app.register_blueprint(user_bp)
# #     app.register_blueprint(task_bp)

# #     return app

# def create_app():
#     app = Flask(__name__)

#     app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#     app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    
#     app.config['MAIL_SERVER'] = 'smtp.gmail.com'
#     app.config['MAIL_PORT'] = 587
#     app.config['MAIL_USE_TLS'] = True
#     app.config['MAIL_USERNAME'] = 'hchaturvedi000@gmail.com'
#     app.config['MAIL_PASSWORD'] = 'lqze hksd iusm nrpw'  

#     db.init_app(app)
#     migrate.init_app(app, db)
#     jwt.init_app(app)
#     CORS(app)
#     mail.init_app(app)

#     from apps.routes import auth_bp
#     from apps.routes import task_bp
#     from apps.routes import interview_bp

#     app.register_blueprint(auth_bp)
#     app.register_blueprint(task_bp)
#     app.register_blueprint(interview_bp)


#     return app

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash
import os

load_dotenv()

mail = Mail()
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///hr_system.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecretkey1234567890abcd')

    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    mail.init_app(app)

    from apps.routes import auth_bp, task_bp, interview_bp
    from apps.models import User

    app.register_blueprint(auth_bp)
    app.register_blueprint(task_bp)
    app.register_blueprint(interview_bp)

    with app.app_context():
        db.create_all()

        demo_users = [
            {
                "name": "Admin",
                "email": "admin@test.com",
                "password": "admin123",
                "role": "admin"
            },
            {
                "name": "Employer",
                "email": "employer@test.com",
                "password": "123456",
                "role": "employer"
            },
            {
                "name": "HR",
                "email": "hr@test.com",
                "password": "123456",
                "role": "hr"
            },
            {
                "name": "Candidate",
                "email": "candidate@test.com",
                "password": "123456",
                "role": "candidate"
            }
        ]

        for u in demo_users:
            existing_user = User.query.filter_by(email=u["email"]).first()
            if not existing_user:
                user = User(
                    name=u["name"],
                    email=u["email"],
                    password=generate_password_hash(u["password"]),
                    role=u["role"]
                )
                db.session.add(user)

        db.session.commit()

    return app