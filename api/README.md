# Employee Tracking System - Backend
This project is the backend part of an application developed to track daily entry and exit times of company employees, manage their annual leaves and provide reporting.

## Features
- Employee Entry/Exit Management
- Automatically records entry and exit times.
- Sends notifications to authorized personnel for employees who are late.
## Annual Leave Management

- 15 days of leave is automatically defined for new employees.
- Annual leaves can be defined by authorized personnel and requested by the employee.
- Leaves can be approved or rejected.
- Sends notification to authorized personnel when annual leave is less than 3 days.
## Monthly Work Reports

Provides reports summarizing the monthly working hours of each employee.
## Notification System

Creating notifications in the background with Celery. Sending push notifications with WebSocket.
## Technologies
- Python3.12
- Django (Backend Framework)
- Django Rest Framework (API)
- PostgreSQL (Database)
- Swagger (OpenAPI Documentation)
- Poetry(Python Dependency Management)
- Ruff(Code Quality and Formatting)
- Celery (Async Task Management)
- Redis (Message Broker for Celery)
- Daphne (ASGI server, WebSocket support)
- Docker (To run the entire system as a container)

## Documentation
Swagger integration has been made in the project.
To see the API documents: http://localhost:8000/swagger
## Backend Features and Usage
- Notification System
- Late employees: Every day, employees' lateness is checked and a notification is sent to the authorized person via Celery.
- When the days of leave decrease: When the annual leave decreases by 3 days, a notification is sent to the authorized person.

## Montly Work Reports
API: /api/reports/monthly-work/
- Parameters:
    year: Reports year.
    month: Reports month.
### Example API Endpoints
### Employee Check In / Check Out

POST /api/attendance/
json
{
  "type": "check-in"
}
### Annual Leave Request

POST /api/leave-management/
json
{
  "start_date": "2024-12-01",
  "end_date": "2024-12-05",
  "reason": "Annual leave"
}
### Leave Approve/Reject

POST /api/leave-management/{id}/change-status/
json
{
  "status": "approved"
}
