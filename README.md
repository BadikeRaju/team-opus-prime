# Enterprise Project Management System

> A full-stack enterprise project management platform built with Django, Django REST Framework, React.js, MySQL, Redis, and Celery to streamline project planning, task management, sprint tracking, and team collaboration.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-5.x-success)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

# Overview

Enterprise Project Management System (EPMS) is a scalable project management platform designed to help organizations manage projects, teams, and workflows efficiently. It provides project planning, sprint management, Kanban boards, task assignment, progress tracking, analytics dashboards, and role-based access control through an intuitive web interface.

The application follows a modern full-stack architecture using Django REST Framework for backend APIs and React.js for an interactive frontend.

---

### Full Application Demo & Workflow Walkthrough
A complete video demonstration covering user authentication, project creation, sprint planning, Kanban board drag-and-drop actions, and real-time dashboard analytics.
![App Demo Recording](./EpmsDemo.gif)

# Features

## Project Management

- Create and manage multiple projects
- Archive completed projects
- Project overview dashboard
- Project progress tracking

---

## Sprint Management

- Create sprints
- Sprint planning
- Sprint backlog
- Sprint status tracking

---

## Task Management

- Create tasks
- Assign tasks
- Set priorities
- Due dates
- Labels
- Task comments
- Task attachments
- Activity history

---

## Kanban Board

- Drag-and-drop task management
- To Do
- In Progress
- Review
- Testing
- Completed

---

## Team Collaboration

- Team management
- Project members
- Workspace collaboration
- Task discussions
- Activity timeline

---

## Role-Based Access Control

Supported roles

- Admin
- Project Manager
- Team Lead
- Developer
- Tester

---

## Dashboard & Analytics

- Project completion statistics
- Sprint progress
- Team productivity
- Task distribution
- Workload visualization

---

## Notifications

- Task assigned
- Status updated
- Deadline reminders
- Sprint notifications

---

# Tech Stack

## Frontend

- React.js
- React Router
- Redux Toolkit
- Tailwind CSS
- Chart.js
- Axios

---

## Backend

- Python
- Django
- Django REST Framework
- JWT Authentication

---

## Database

- MySQL

---

## Background Processing

- Redis
- Celery

---

## Tools

- Docker
- Git
- GitHub
- Postman

---

# System Architecture

```
                 React.js
                     │
               REST API
                     │
      Django REST Framework
                     │
    -----------------------------
    │            │             │
Authentication  Projects      Tasks
    │            │             │
    │         Sprint       Dashboard
    │            │             │
    -----------------------------
             MySQL Database
                    │
           Redis + Celery
      (Background Notifications)
```

---

# Modules

## User Management

- User registration
- Login
- Profile management
- Role management

---

## Project Module

- Create project
- Edit project
- Delete project
- Archive project
- Team assignment

---

## Sprint Module

- Sprint planning
- Sprint backlog
- Sprint completion
- Sprint analytics

---

## Task Module

- Task creation
- Task assignment
- Priority management
- Status updates
- Comments
- Attachments

---

## Dashboard Module

- Active projects
- Sprint progress
- Productivity charts
- Team workload

---

## Notification Module

- Task reminders
- Status updates
- Deadline alerts
- Activity notifications

---

# REST APIs

## Authentication

```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/profile
```

---

## Projects

```http
GET    /api/projects
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

---

## Sprints

```http
GET    /api/sprints
POST   /api/sprints
PUT    /api/sprints/{id}
DELETE /api/sprints/{id}
```

---

## Tasks

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
```

---

## Dashboard

```http
GET /api/dashboard
```

---

# Database Design

## User

- id
- username
- email
- password
- role

---

## Project

- id
- name
- description
- owner
- status
- created_at

---

## Sprint

- id
- project
- start_date
- end_date
- status

---

## Task

- id
- project
- sprint
- assignee
- priority
- status
- due_date

---

## Activity

- id
- user
- task
- action
- timestamp

---

## Notification

- id
- user
- message
- status

---

# Security Features

- JWT Authentication
- Password Hashing
- Protected REST APIs
- Role-Based Access Control
- Input Validation
- Secure File Upload

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/enterprise-project-management-system.git

cd enterprise-project-management-system
```

---

## Backend

Create virtual environment

```bash
python -m venv venv
```

Activate

Linux/macOS

```bash
source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
python manage.py migrate
```

Start server

```bash
python manage.py runserver
```

---

## Frontend

```bash
cd frontend

npm install

npm start
```

---

## Redis

```bash
docker run -d -p 6379:6379 redis
```

---

## Celery Worker

```bash
celery -A config worker --loglevel=info
```

---

# Future Enhancements

- Gantt Charts
- Calendar View
- Email Notifications
- Project Templates
- Time Reports
- Budget Tracking
- Resource Allocation
- File Versioning
- AI Task Prioritization
- AI Sprint Planning
- Team Performance Analytics

---

# Skills Demonstrated

- Python
- Django
- Django REST Framework
- React.js
- REST APIs
- JWT Authentication
- MySQL
- Redis
- Celery
- Docker
- Redux Toolkit
- Chart.js
- Project Management Systems
- Role-Based Access Control
- Dashboard Development
- Backend Development
- Full Stack Development

---

# Use Cases

- Software Development Teams
- Agile Project Management
- Startup Project Tracking
- Enterprise Workflow Management
- Scrum Teams
- Product Development
- Team Collaboration

---

# License

This project is licensed under the MIT License.

---

# Author

**Raju Badike**
