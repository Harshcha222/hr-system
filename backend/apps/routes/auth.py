from flask import Blueprint, request, jsonify
from functools import wraps
from apps import db
from apps.models import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
auth_bp = Blueprint('auth_bp', __name__)

# def roles_required(allowed_roles):
#     def wrapper(fn):
#         @wraps(fn)
#         def decorator(*args, **kwargs):
#             verify_jwt_in_request()
#             user_id = get_jwt_identity()

#             user = User.query.get(user_id)  # fetch from DB

#             if user.role not in allowed_roles:
#                 return jsonify({"msg": "Access denied"}), 403

#             return fn(*args, **kwargs)
#         return decorator
#     return wrapper

def roles_required(allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()

            user = User.query.get(user_id)

            if not user or user.role not in allowed_roles:
                return jsonify({"msg": "Access denied"}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper

@auth_bp.route('/users', methods=['POST'])
@roles_required(['admin'])
def create_user():
    data = request.get_json()

    allowed_roles = ['admin', 'employer', 'hr', 'candidate']

    if data['role'] not in allowed_roles:
        return {"msg": "Invalid role"}, 400

    user = User(
        name=data['name'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        role=data['role']
    )

    db.session.add(user)
    db.session.commit()

    return {"msg": "User created"}










@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
    "msg": "Login successful",
    "role": user.role,
    "access_token": token
})


# --- New: List users by role (for dropdowns) ---
from sqlalchemy import or_

@auth_bp.route('/users', methods=['GET'])
def list_users():
    role = request.args.get('role')
    q = User.query
    if role:
        q = q.filter_by(role=role)
    users = q.all()
    return jsonify([
        {"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users
    ])


# --- New: Activity feed endpoint ---

from apps.models import ActivityLog
from datetime import timedelta

def to_ist(dt):
    if dt is None:
        return None
    return (dt + timedelta(hours=5, minutes=30))


@auth_bp.route('/activity', methods=['GET'])
def activity_feed():
    logs = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).limit(50).all()
    return jsonify([
        {"message": log.message, "timestamp": to_ist(log.timestamp).isoformat()} for log in logs
    ])

