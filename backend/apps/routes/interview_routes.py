 

 # from flask import Blueprint, request, jsonify

# from functools import wraps
# from apps import db
# from apps.models import ActivityLog, User, Interview
# from apps.routes.auth import roles_required
# from flask_jwt_extended import get_jwt_identity
# from datetime import datetime
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_jwt_extended import create_access_token
# from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
# from flask import jsonify
# from flask_mail import Message
# from apps import mail

# interview_bp = Blueprint('interview_bp', __name__)


# @interview_bp.route('/interviews', methods=['POST'])
# @roles_required(['hr'])
# def schedule_interview():
#     data = request.get_json()
#     current_user_id = int(get_jwt_identity())

#     # Validate candidate
#     candidate = User.query.filter_by(id=data['candidate_id'], role='candidate').first()
#     if not candidate:
#         return jsonify({"msg": "Invalid candidate"}), 400

#     allowed_modes = ['Voice', 'Video', 'Chat']
#     if data.get('mode') not in allowed_modes:
#         return jsonify({"msg": "Invalid mode"}), 400

#     interview = Interview(
#         candidate_id=data['candidate_id'],
#         datetime=datetime.fromisoformat(data['datetime']),
#         mode=data['mode'],
#         created_by=current_user_id,
#         task_id=data.get('task_id')
#     )
#     log = ActivityLog(message=f"Interview scheduled for candidate {data['candidate_id']}")
#     db.session.add(log)
#     db.session.add(interview)
#     db.session.commit()
#     msg = Message(
#         subject="Interview Scheduled",
#         sender="your_email@gmail.com",
#         recipients=[candidate.email]
#     )

#     msg.body = f"""
# Hello {candidate.name},

# Your interview has been scheduled.

# 📅 Date & Time: {interview.datetime}
# 🎤 Mode: {interview.mode}
# 🔗 Join here: http://localhost:5000/call-room/{interview.id}

# Best of luck!
# """

#     mail.send(msg)

#     # ✅ Activity log
#     log = ActivityLog(
#         message=f"Interview scheduled for {candidate.name} via {interview.mode}"
#     )
#     db.session.add(log)
#     db.session.commit()
#     from datetime import timedelta
#     def to_ist(dt):
#         if dt is None:
#             return None
#         return (dt + timedelta(hours=5, minutes=30))
#     return jsonify({
#         "msg": "Interview scheduled",
#         "interview_id": interview.id,
#         "datetime": to_ist(interview.datetime).isoformat() if interview.datetime else None,
#         "mode": interview.mode,
#         "call_link": f"/call-room/{interview.id}"
#     })

import threading
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import get_jwt_identity
import requests

from apps import db
from apps.models import Interview, User, ActivityLog
from apps.routes.auth import roles_required

interview_bp = Blueprint('interview_bp', __name__)


def send_email_async(app, candidate_email, candidate_name, interview):
    with app.app_context():
        try:
            payload = {
                "from": "Acme <onboarding@resend.dev>",
                "to": [candidate_email],
                "subject": "Interview Scheduled",
                "html": f"""
                <p>Hello {candidate_name},</p>
                <p>Your interview has been scheduled.</p>
                <p><b>Date & Time:</b> {interview.datetime}</p>
                <p><b>Mode:</b> {interview.mode}</p>
                <p><b>Call Link:</b> /call-room/{interview.id}</p>
                """
            }

            headers = {
                "Authorization": f"Bearer {current_app.config['RESEND_API_KEY']}",
                "Content-Type": "application/json"
            }

            response = requests.post(
                "https://api.resend.com/emails",
                json=payload,
                headers=headers,
                timeout=20
            )

            print("RESEND STATUS:", response.status_code, response.text)

        except Exception as e:
            print("EMAIL SENDING FAILED:", str(e))


@interview_bp.route('/interviews', methods=['POST'])
@roles_required(['hr'])
def schedule_interview():
    data = request.get_json()
    current_user_id = int(get_jwt_identity())

    candidate = User.query.filter_by(id=data['candidate_id'], role='candidate').first()
    if not candidate:
        return jsonify({"msg": "Invalid candidate"}), 400

    allowed_modes = ['Voice', 'Video', 'Chat']
    if data.get('mode') not in allowed_modes:
        return jsonify({"msg": "Invalid mode"}), 400

    interview_time = datetime.fromisoformat(data['datetime'])

    existing = Interview.query.filter_by(
        candidate_id=data['candidate_id'],
        datetime=interview_time
    ).first()

    if existing:
        return jsonify({"msg": "Interview already scheduled at this time"}), 400

    interview = Interview(
        candidate_id=data['candidate_id'],
        datetime=interview_time,
        mode=data['mode'],
        created_by=current_user_id,
        task_id=data.get('task_id')
    )

    db.session.add(interview)
    db.session.commit()

    app = current_app._get_current_object()
    thread = threading.Thread(
        target=send_email_async,
        args=(app, candidate.email, candidate.name, interview)
    )
    thread.daemon = True
    thread.start()

    log = ActivityLog(
        message=f"Interview scheduled for {candidate.name} via {interview.mode}"
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({
        "msg": "Interview scheduled",
        "interview_id": interview.id,
        "datetime": interview.datetime.isoformat(),
        "mode": interview.mode,
        "call_link": f"/call-room/{interview.id}"
    }), 201