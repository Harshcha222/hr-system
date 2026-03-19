from apps import create_app, db
from apps.models import User
from werkzeug.security import generate_password_hash


def create_admin():
    app = create_app()

    with app.app_context():
        # check if admin already exists
        existing_admin = User.query.filter_by(email="admin@test.com").first()

        if existing_admin:
            print("Admin already exists!")
            return

        admin = User(
            name="Admin",
            email="admin@test.com",
            password = generate_password_hash("admin123"),
            role="admin"
        )

        db.session.add(admin)
        db.session.commit()

        print("Admin created successfully!")

if __name__ == "__main__":
    create_admin()