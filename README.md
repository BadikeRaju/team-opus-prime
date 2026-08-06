# Project Orbit

Enterprise Project Management System (EPMS)

Tech Stack

Frontend

 React.js

 Redux Toolkit

 React Router

 Axios

 Tailwind CSS

 Chart.js

Backend

 Python

 Django

 Django REST Framework

 Django Simple JWT

 Django Channels (Real-time notifications)

 Celery (Background Tasks)

 Redis (Celery Broker)

Database

 MySQL

Development Tools

 Git

 GitHub

 Docker

 Postman

 VS Code

Project Overview

Enterprise Project Management System (EPMS) is a full-stack web application that helps organizations manage software projects, teams, tasks, sprint planning, employee collaboration, document sharing, and project analytics through a secure role-based system.

The platform supports multiple organizations, allowing administrators to create projects, assign employees, track project progress, monitor productivity, and generate reports through an intuitive dashboard.

User Roles

Super Admin

 Manage organizations

 View system analytics

 Manage users

Organization Admin

 Create projects

 Invite employees

 Assign managers

 Manage departments

 Configure permissions

Project Manager

 Create tasks

 Create sprints

 Assign developers

 Monitor progress

 Review completed work

Developer

 View assigned tasks

 Update task status

 Upload files

 Track working hours

 Add comments

Viewer

 Read-only access

Major Modules

1. Authentication

 Registration

 Login

 JWT Authentication

 Forgot Password

 Reset Password

 Change Password

 Profile Management

2. Organization Management

 Organizations

 Departments

 Teams

 Employee Directory

3. Project Management

Each project includes:

 Name

 Description

 Start Date

 End Date

 Priority

 Status

 Team Members

 Project Manager

4. Task Management

Each task includes:

 Title

 Description

 Priority

 Due Date

 Assigned Employee

 Labels

 Status

 Estimated Hours

 Actual Hours

Task workflow:

Backlog
   ↓
To Do
   ↓
In Progress
   ↓
Testing
   ↓
Completed

5. Kanban Board

 Drag-and-drop task movement

 Live task updates

 Progress tracking

6. Sprint Management

 Sprint creation

 Sprint goals

 Sprint duration

 Sprint completion percentage

7. Time Tracking

 Start timer

 Pause timer

 Stop timer

 Daily work logs

8. File Management

 Upload project documents

 Download files

 Attach files to tasks

9. Comments

 Comment on tasks

 Reply to comments

 Mention team members

10. Notifications

Using Django Channels:

 Task assigned

 Task completed

 Comment added

 Sprint started

 Deadline reminder

11. Dashboard

Admin Dashboard

 Total Projects

 Active Employees

 Pending Tasks

 Completed Tasks

Manager Dashboard

 Sprint Progress

 Team Workload

 Upcoming Deadlines

Developer Dashboard

 Assigned Tasks

 Completed Tasks

 Today's Work

 Pending Reviews

12. Reports

Generate:

 Employee Report

 Project Report

 Sprint Report

 Productivity Report

13. Search

Search by:

 Project

 Employee

 Task

 Department

14. Activity Log

Record events such as:

 Project created

 Task assigned

 Status updated

 File uploaded

Database (MySQL)

Main Tables:

 Users

 Roles

 Organizations

 Departments

 Employees

 Projects

 ProjectMembers

 Sprints

 Tasks

 Comments

 Attachments

 Notifications

 TimeLogs

 ActivityLogs

REST APIs

Authentication

POST /register
POST /login
POST /logout
POST /refresh-token

Projects

GET /projects
POST /projects
PUT /projects/{id}
DELETE /projects/{id}

Tasks

GET /tasks
POST /tasks
PUT /tasks/{id}
DELETE /tasks/{id}
PATCH /tasks/{id}/status

Employees

GET /employees
POST /employees
PUT /employees/{id}
DELETE /employees/{id}

Comments

POST /tasks/{id}/comments
GET /tasks/{id}/comments

Advanced Features

 JWT Authentication

 Role-Based Access Control (RBAC)

 Custom Django Permissions

 Pagination

 Search

 Filtering

 Sorting

 Soft Delete

 File Uploads

 Docker

 API Documentation (Swagger/OpenAPI)

 Unit Testing

 Responsive UI

Folder Structure

EPMS/
│
├── backend/
│   ├── accounts/
│   ├── organizations/
│   ├── employees/
│   ├── projects/
│   ├── tasks/
│   ├── sprints/
│   ├── notifications/
│   ├── reports/
│   ├── common/
│   ├── config/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── services/
│   ├── hooks/
│   └── utils/
│
└── docker-compose.yml

Why this project is strong

This project demonstrates:

 Django & Django REST Framework

 React integration

 JWT authentication

 Role-based authorization

 MySQL database design

 REST API development

 Real-time features with Django Channels

 Background task processing with Celery

 Docker-based development

 Clean, modular project architecture.   Create this website

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5c65eed7-0064-425f-a853-f045601cb4f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
