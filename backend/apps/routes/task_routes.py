from flask import Blueprint, request, jsonify
from apps import db
from apps.models import ActivityLog, Task, User
from apps.routes.auth import roles_required
from flask_jwt_extended import get_jwt_identity
from datetime import datetime

task_bp = Blueprint('task_bp', __name__)

# @task_bp.route('/tasks', methods=['POST'])
# @roles_required(['employer'])
# def create_task():
#     data = request.get_json()
#     current_user_id = get_jwt_identity() 

    
#     hr_user = User.query.filter_by(id=data['assigned_to'], role='hr').first()
#     if not hr_user:
#         return jsonify({"msg": "Assigned user is not HR or does not exist"}), 400

#     task = Task(
#         title=data['title'],
#         description=data.get('description', ''),
#         assigned_to=data['assigned_to'],
#         priority=data.get('priority', 'Medium'),
#         created_by=current_user_id
#     )

#     db.session.add(task)
#     db.session.commit()

#     return jsonify({"msg": "Task created", "task_id": task.id})




@task_bp.route('/tasks', methods=['POST'])
@roles_required(['employer'])
def create_task():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    # Check HR
    hr_user = User.query.filter_by(id=data['assigned_to'], role='hr').first()
    if not hr_user:
        return jsonify({"msg": "Assigned user is not HR"}), 400

    # Priority validation
    allowed_priorities = ['Normal', 'Medium', 'High']
    priority = data.get('priority', 'Medium')

    if priority not in allowed_priorities:
        return jsonify({"msg": "Invalid priority"}), 400

    task = Task(
        title=data['title'],
        description=data.get('description', ''),
        assigned_to=data['assigned_to'],
        priority=priority,
        created_by=current_user_id
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({"msg": "Task created", "task_id": task.id})


@task_bp.route('/tasks/my', methods=['GET'])
@roles_required(['employer'])
def get_my_tasks():
    current_user_id = get_jwt_identity()
    tasks = Task.query.filter_by(created_by=current_user_id).all()

    from datetime import timedelta
    def to_ist(dt):
        if dt is None:
            return None
        return (dt + timedelta(hours=5, minutes=30))
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "assigned_to": t.assigned_to,
        "status": t.status,
        "created_at": to_ist(t.created_at).isoformat() if t.created_at else None,
        "completed_at": to_ist(t.completed_at).isoformat() if t.completed_at else None
    } for t in tasks])














#------------------------------------------------------------hr routes------------------------------------------------------------



@task_bp.route('/tasks/assigned', methods=['GET'])
@roles_required(['hr'])
def get_assigned_tasks():
    current_user_id = int(get_jwt_identity())

    tasks = Task.query.filter_by(assigned_to=current_user_id).all()

    from datetime import timedelta
    def to_ist(dt):
        if dt is None:
            return None
        return (dt + timedelta(hours=5, minutes=30))
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "priority": t.priority,
        "status": t.status,
        "created_at": to_ist(t.created_at).isoformat() if t.created_at else None,
        "completed_at": to_ist(t.completed_at).isoformat() if t.completed_at else None
    } for t in tasks])




@task_bp.route('/tasks/<int:task_id>/status', methods=['PUT'])
@roles_required(['hr'])
def update_task_status(task_id):
    data = request.get_json()
    current_user_id = int(get_jwt_identity())

    task = Task.query.get(task_id)

    if not task:
        return jsonify({"msg": "Task not found"}), 404

    if task.assigned_to != current_user_id:
        return jsonify({"msg": "Not your task"}), 403

  
    allowed_status = ['Pending', 'In Progress', 'Completed']
    if data.get('status') not in allowed_status:
        return jsonify({"msg": "Invalid status"}), 400

    task.status = data.get('status')

    if task.status == 'Completed':
        task.completed_at = datetime.utcnow()

    log = ActivityLog(message=f"Task {task.id} marked {task.status}")
    db.session.add(log)

    db.session.commit()

    return jsonify({"msg": "Task updated"})




#------------------------------------------------------------summary route for employer------------------------------------------------------------
@task_bp.route('/summary', methods=['GET'])
@roles_required(['employer'])
def task_summary():
    current_user_id = int(get_jwt_identity())

    total = Task.query.filter_by(created_by=current_user_id).count()
    completed = Task.query.filter_by(created_by=current_user_id, status='Completed').count()
    pending = Task.query.filter_by(created_by=current_user_id, status='Pending').count()
    in_progress = Task.query.filter_by(created_by=current_user_id, status='In Progress').count()

    return jsonify({
        "total": total,
        "completed": completed,
        "pending": pending,
        "in_progress": in_progress
    })