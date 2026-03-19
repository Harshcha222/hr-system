# Salarite Virtual HR – Mini ATS & HR Dashboard

## Overview
This project is a mini web dashboard for Salarite's Virtual HR + ATS platform. It allows employers to assign tasks to Virtual HR, monitor progress in real time, and enables Virtual HR to schedule interviews and update task statuses. 

---

## Features
- **Employer Dashboard:** Assign tasks, set priority, assign to HR, and monitor live status.
- **Virtual HR Dashboard:** View assigned tasks, mark tasks as In Progress/Completed, and schedule interviews.
- **Interview Scheduling:** HR can schedule interviews (Voice/Video/Chat) for candidates.
- **Live Monitoring:** Employers see real-time task updates and an activity feed.
- **Internal Call Room:** Placeholder for inbuilt call room at `/call-room/{id}`.
- **Demo Users:** Pre-seeded users for easy login and testing.
- **Admin User Management:** Admins can register new users (Employer, HR, Candidate) and assign roles from the Admin Dashboard.
- **Email Notification:** When an interview is scheduled, the candidate receives an email notification automatically.
- **Role-Based Authentication & Authorization:** The system uses JWT-based authentication and enforces role-based access control. Each user only has access to features and data relevant to their role. For example, HR users can only view and manage their own assigned tasks, not those of others.

---

## Tech Stack
- **Backend:** Python (Flask, SQLite)
- **Frontend:** React (Vite)
- **Database:** SQLite
- **Real-time:** Auto-refresh (every 5 seconds)
- **Deployment:** (Add your Render/Railway links after deployment)

---

## Demo Credentials
| Role      | Email               | Password |
|-----------|---------------------|----------|
| Admin     | admin@test.com      | admin123 |
| Employer  | employer@test.com   | 123456   |
| HR        | hr@test.com         | 123456   |
| Candidate | candidate@test.com  | 123456   |

---

## Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd hr-system
```

### 2. Backend Setup
```
cd backend
python -m venv venv
# Activate the virtual environment:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate
pip install -r requirements.txt
python run.py
```
The backend will start at https://hr-system-mwrd.onrender.com.

### 3. Frontend Setup
```
cd ../frotend
npm install
npm run dev
```
The frontend will start at https://hr-system-frotend.onrender.com.

---

## Usage
- **Login** using one of the demo credentials above.
- **Employer** can assign tasks and monitor progress.
- **HR** can update task statuses and schedule interviews.
- **Admin** can register new users and manage roles.
- **Live updates** are visible on dashboards (auto-refresh).

---

## Deployment
- Deploy backend and frontend to [Render]
- Update the API URLs in the frontend if deploying to a different domain.
- Add your live demo links here:
  - **Live Demo:** [Frontend Link] https://hr-system-frotend.onrender.com | [Backend Link] https://hr-system-mwrd.onrender.com

---

## Optional: Walkthrough Video
- (Add a link to your 2-minute walkthrough video here if available)

---

## Contact
For any issues, please contact the repository owner.
