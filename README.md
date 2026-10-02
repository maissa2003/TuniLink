# 🇹🇳🇨🇦 TuniLink — Workforce & Payroll Management Platform

<p align="center">
  <img src="https://img.shields.io/badge/TuniLink-Tunisia%20%7C%20Canada-2563EB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Boot-Java%2017-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p align="center">
  <b>A full-stack platform connecting Canadian clients with Tunisian talent.</b>
</p>

<p align="center">
  Recruitment • HR • Payroll • Finance • Cost Management • Invoicing
</p>

---

## 🌍 About the Project

**TuniLink** is a full-stack workforce and payroll management platform designed to connect **Tunisia-based operations with Canadian clients and employers**.

The platform centralizes the complete workforce lifecycle in one application:

> 👤 Recruitment → 📄 Contracts → 💰 Payroll → 📊 Cost Tracking → 🧾 Invoicing → 🤝 Client Management

It helps Canadian clients communicate their workforce needs, enables HR teams to manage candidates and employees, and provides finance teams with tools for **salary simulation, cost calculation, margins, taxes, payroll, and invoicing**.

---

## 🎯 Project Objective

The main objective of TuniLink is to simplify the management of **cross-border workforce operations between Tunisia and Canada**.

### 🇨🇦 For Canadian Clients

* Submit workforce and recruitment requirements
* Request specific employee profiles
* View assigned employees
* Run salary simulations
* Review invoices and billing information
* Follow project and collaboration history

### 🇹🇳 For Tunisian Operations

* Manage candidates and employees
* Handle contracts and documents
* Process payroll
* Calculate operational costs
* Track taxes and margins
* Generate invoices
* Manage employee requests and information

---

# 👥 User Roles

The platform provides different workspaces according to the user's role:

| Role                  | Main Responsibilities                                     |
| --------------------- | --------------------------------------------------------- |
| 🛡️ **Super Admin**   | Platform and system management                            |
| 🏢 **Agency Manager** | Business and operational management                       |
| 👩‍💼 **HR**          | Candidates, employees, contracts and recruitment          |
| 💰 **Finance**        | Payroll, taxes, margins, costs and invoices               |
| 👨‍💻 **Employee**    | Personal information, documents, leave and payslips       |
| ⚙️ **Operations**     | Infrastructure and operational cost management            |
| 🇨🇦 **Client**       | Recruitment requests, employees, simulations and invoices |

---

# 🚀 Main Features

## 👩‍💼 HR Management

* Candidate management
* Recruitment requests
* Employee management
* Contract management
* Leave request management
* Employee document management
* Payroll input management
* Employee simulations
* Recruitment workflow

---

## 👨‍💻 Employee Portal

Employees have access to their own self-service workspace.

### Features

* 📄 View contract information
* 💰 Access salary and payslip information
* 🏖️ Submit leave requests
* 📁 Upload personal documents
* 📊 Track activity through a personal dashboard

---

## 💰 Finance & Payroll

The financial module provides centralized cost and payroll management.

### Features

* Payroll processing
* Salary calculations
* Tax management
* Margin calculation
* Infrastructure cost tracking
* Operational expense tracking
* Invoice generation
* Financial dashboards
* Profitability analysis

---

## 🇨🇦 Client Portal

Canadian clients can manage their workforce requirements through a dedicated portal.

### Client Workflow

```text
Canadian Client
      │
      ▼
📋 Submit Workforce Request
      │
      ▼
👩‍💼 HR Reviews Requirement
      │
      ▼
🔎 Candidate Recruitment
      │
      ▼
👤 Employee Assignment
      │
      ▼
💰 Salary & Cost Simulation
      │
      ▼
📊 Margin & Financial Calculation
      │
      ▼
🧾 Invoice Generation
```

---

# 💵 Cost & Budget Management

One of the key functionalities of TuniLink is **cost visibility**.

The platform helps calculate and track different expenses related to workforce management, including:

* 👨‍💻 Employee salaries
* 🧾 Taxes
* 🏢 Infrastructure costs
* 🌐 Internet expenses
* 💻 Equipment
* 🏠 Office-related expenses
* 📊 Operational costs
* 💰 Margins
* 🧾 Client billing

This allows the platform to provide a clearer view of the **overall cost and budget associated with a client project**.

---

# 🔄 Recruitment & Business Workflow

```text
┌─────────────────────┐
│   🇨🇦 Canadian      │
│       Client        │
└──────────┬──────────┘
           │
           │ Recruitment Request
           ▼
┌─────────────────────┐
│     👩‍💼 HR Team     │
│ Candidate Selection │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    👤 Employee      │
│     Assignment      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    💰 Finance       │
│ Payroll & Costs     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     📊 Simulation   │
│ Cost + Margin       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    🧾 Invoice       │
│   Canadian Client   │
└─────────────────────┘
```

---

# 🏗️ Architecture

TuniLink follows a **full-stack architecture** with a React frontend, Spring Boot backend, and PostgreSQL database.

```text
                 🌐 TuniLink Platform
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   ⚛️ React Frontend              🔐 Authentication
   TypeScript + Vite              JWT + Google OAuth
          │
          │ REST API
          ▼
   ☕ Spring Boot Backend
          │
    ┌─────┴─────────────┐
    │                   │
    ▼                   ▼
PostgreSQL          Business Logic
 Database            & Services
    │
    ▼
📊 HR • Payroll • Finance • Clients
```

---

# 🛠️ Technology Stack

## 🎨 Frontend

| Technology       | Purpose               |
| ---------------- | --------------------- |
| ⚛️ React         | User interface        |
| 🔷 TypeScript    | Type-safe development |
| ⚡ Vite           | Frontend build tool   |
| 🧭 React Router  | Application routing   |
| 🎨 Tailwind CSS  | UI styling            |
| 🖼️ Lucide React | Icons                 |
| 📊 Recharts      | Data visualization    |
| 🔗 Axios         | API communication     |

## ☕ Backend

| Technology          | Purpose               |
| ------------------- | --------------------- |
| ☕ Java 17           | Programming language  |
| 🌱 Spring Boot 3    | Backend framework     |
| 🔐 Spring Security  | Security              |
| 🗄️ Spring Data JPA | Database access       |
| 🐘 PostgreSQL       | Database              |
| 🔑 JWT              | Authentication        |
| 🔵 Google OAuth     | Social authentication |
| 📧 Mail Support     | Email functionality   |

## 🐳 Infrastructure

* Docker
* Docker Compose
* PostgreSQL Container
* Backend Container
* Frontend Container
* MailHog for local email testing

---

# 📁 Project Structure

```text
TuniLink/
│
├── 📂 backend/
│   └── Spring Boot API
│
├── 📂 frontend/
│   └── React Application
│
├── 📂 uploads/
│   └── Documents & uploaded files
│
├── 🐳 docker-compose.yml
├── 📦 package.json
└── 📖 README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd Project_managment
```

## 2️⃣ Start the Application with Docker

```bash
docker compose up -d
```

This starts:

* 🐘 PostgreSQL
* ☕ Spring Boot Backend
* ⚛️ React Frontend
* 📧 MailHog

---

# 🌐 Application URLs

| Service       | URL                     |
| ------------- | ----------------------- |
| ⚛️ Frontend   | `http://localhost:5173` |
| ☕ Backend API | `http://localhost:8081` |
| 📧 MailHog    | `http://localhost:8025` |
| 🐘 PostgreSQL | `localhost:5432`        |

---

# 💻 Run Frontend Manually

```bash
cd frontend
npm install
npm run dev
```

---

# ☕ Run Backend Manually

```bash
cd backend
./mvnw spring-boot:run
```

---

# 🔐 Security

TuniLink uses a role-based security architecture to control access to different parts of the platform.

Authentication is supported through:

* 🔑 JWT authentication
* 🔵 Google OAuth
* 🛡️ Spring Security
* 👥 Role-based access control

---

# 💼 Business Value

TuniLink combines multiple business processes into one centralized platform:

```text
👥 Recruitment
      +
👩‍💼 HR Management
      +
💰 Payroll
      +
📊 Cost Control
      +
🧾 Invoicing
      +
🇨🇦 Client Management
      +
👨‍💻 Employee Self-Service
      ↓
🚀 TuniLink
```

The platform is designed for a **B2B staffing and workforce outsourcing environment**, particularly for operations managing employees between **Tunisia and Canada**.

---

# 🌟 Key Benefits

✅ Centralized workforce management
✅ Cross-border recruitment coordination
✅ Automated payroll workflows
✅ Salary and cost simulations
✅ Infrastructure and operational cost tracking
✅ Client invoicing
✅ Employee self-service
✅ Role-based access control
✅ Financial dashboards and reporting
✅ Dockerized development environment

---

# 👩‍💻 Project

**TuniLink — Tunisia 🇹🇳 × Canada 🇨🇦**

Built as a full-stack business management solution for international staffing, recruitment, HR, payroll and financial operations.

---

<p align="center">

### 🇹🇳 Connecting Tunisian Talent with Canadian Opportunities 🇨🇦

**TuniLink**

</p>
