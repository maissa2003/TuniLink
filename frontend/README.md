# TuniLink Project Management Platform

TuniLink is a multi-role workforce and payroll management platform designed to connect Tunisia-based operations with Canadian clients and employers. The system centralizes recruiting, HR administration, employee self-service, payroll, cost tracking, invoicing, and platform management in a single application.

## Overview

This project is a full-stack business management solution for international staffing operations. It supports several roles, including:

- Super Admin
- Agency Manager
- HR
- Finance
- Employee
- Infrastructure / Operations
- Client

The platform helps teams manage the full lifecycle of employee onboarding, payroll calculations, documents, simulation, and client billing.

## Main Functionalities

### 1. Admin and Platform Management
- Manage companies, users, and roles
- Configure platform-level administration
- Access dashboard summaries and centralized management views
- Monitor company and user activity from a unified admin area

### 2. HR Management
- Manage candidates and recruitment requests
- Track employee records and contracts
- Review leave requests
- Upload and manage employee documents
- Capture payroll inputs and operational HR data
- Generate employee simulations and staffing workflows

### 3. Employee Portal
- View personal contract information
- Access payslips and salary data
- Submit leave requests
- Upload and manage personal documents
- Track employee activity in a self-service dashboard

### 4. Finance and Payroll
- Manage payroll processing
- Track infrastructure and operating costs
- Manage taxes and margins
- Generate invoices
- Monitor reports and finance dashboards
- Support profitability analysis for client projects

### 5. Client Portal
- View assigned employees and project-related teams
- Run salary simulations
- Review invoices and billing details
- Track project history and collaboration activity
- Monitor workforce assignments from the client perspective

### 6. Infrastructure and Operations
- Track operational costs such as internet, office, equipment, and other resources
- Support cost visibility for management decisions
- Help finance and operations teams analyze dependency expenses

### 7. Recruitment and Workflow Automation
- Client request flow from request to employee assignment
- HR recruitment processing and validation
- Payroll and margin calculation before invoice generation
- Simulation and billing steps for Canadian clients

## Role-Based Workflow

The application is structured around a role-driven user experience:

- Admin area: company and system-wide control
- HR workspace: candidate, employee, contract, document, leave, and payroll workflows
- Employee workspace: personal and payslip management
- Finance workspace: payroll, taxes, margins, and invoice management
- Client workspace: assignments, invoice visibility, and simulations
- Manager / operations workspace: business processes for cross-functional teams

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Recharts
- Axios

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT authentication
- Google OAuth integration
- Mail support

### Infrastructure
- Docker Compose
- PostgreSQL container
- Backend container
- Frontend container
- MailHog for local email testing

## Project Structure

```text
Project_managment/
├── backend/                 # Spring Boot API
├── frontend/                # React frontend
├── uploads/                 # Documents and uploaded files
├── docker-compose.yml       # Local services setup
├── package.json             # Workspace-level dependencies
└── README.md                # Project overview (optional root file)
```

## Local Setup

### 1. Clone the project
```bash
git clone <repository-url>
cd Project_managment
```

### 2. Start the services with Docker
```bash
docker compose up -d
```

This starts:
- PostgreSQL database
- Backend API
- Frontend app
- MailHog mail testing interface

### 3. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8081
- MailHog UI: http://localhost:8025
- PostgreSQL: localhost:5432

## Running the frontend manually

```bash
cd frontend
npm install
npm run dev
```

## Running the backend manually

```bash
cd backend
./mvnw spring-boot:run
```

## Business Value

This project is designed to simplify cross-border workforce management by combining:

- recruitment coordination
- HR operations
- payroll and cost control
- employee self-service
- client invoicing and reporting
- secure role-based access

It is suitable for a B2B staffing or workforce outsourcing environment that manages employees between Tunisia and Canada.

## Notes

The application uses a role-based architecture and is optimized for a multi-tenant operations and payroll environment. The frontend routes are organized by role, while the backend exposes business logic for authentication, employee management, finance tracking, requests, and documents.

## License

This project is for internal business use unless otherwise specified by the project owner.
