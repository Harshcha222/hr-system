from apps import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False) 
    password = db.Column(db.String(200))

    # Tasks where user is HR (assigned)
    assigned_tasks = db.relationship(
        'Task',
        foreign_keys='Task.assigned_to',
        backref='assigned_user',
        lazy=True
    )

    # Tasks where user is Employer (creator)
    created_tasks = db.relationship(
        'Task',
        foreign_keys='Task.created_by',
        backref='creator',
        lazy=True
    )


class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    priority = db.Column(db.String(20)) 
    status = db.Column(db.String(20), default="Pending") 
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  

    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)


class Interview(db.Model):
    __tablename__ = "interviews"

    id = db.Column(db.Integer, primary_key=True)
    datetime = db.Column(db.DateTime, nullable=False)
    mode = db.Column(db.String(20), nullable=False)

    candidate_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)

class ActivityLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)