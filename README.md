# GETSHub Quality Management System

A comprehensive Quality Management System for telecommunications provision auditing, built as part of a Computer Science thesis project.

## Project Overview

GETSHub is a web-based quality management system designed to streamline the audit process for telecommunications provision requests. The system supports role-based access control and provides tools for managers to assign audits and track quality metrics.

## Technology Stack

- **Backend**: NestJS (Node.js framework)
- **Frontend**: Angular 17+
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Containerization**: Docker
- **Version Control**: Git & GitHub

## System Architecture

- **Role-Based Access Control**: Super Admin, Manager, QA Auditor
- **Provision Management**: Upload and track provision requests
- **Quality Auditing**: Photo uploads, quality scoring, audit workflow
- **Dashboard Analytics**: Real-time statistics and reporting

## Development Setup

1. **Prerequisites**: Docker Desktop, Node.js 18+, Angular CLI
2. **Database**: `docker-compose up -d postgres`
3. **Backend**: `cd backend && npm run start:dev`
4. **Frontend**: `cd frontend && ng serve`

## Test Accounts

- **Super Admin**: admin / admin123
- **Manager**: manager1 / admin123
- **QA Auditor**: auditor1 / admin123

## Project Status

- ✅ **Phase 1-7**: Complete authentication system with role-based dashboards
- ✅ **Phase 8 (Backend)**: Provision management backend infrastructure complete
- 🚧 **Phase 8 (Frontend)**: Provision management UI (next step)
- ⏳ **Phase 9**: Quality audit system
- ⏳ **Phase 10**: Reporting and analytics

### Latest Commits
- **Phase 8 Backend**: Provisions module, entities, DTOs, and PostgreSQL integration
- **Authentication**: JWT-based auth with role-based access control
- **Database**: PostgreSQL with Docker containerization

## Thesis Information

**Student**: [Your Name]  
**Institution**: [Your University]  
**Program**: Computer Science  
**Thesis Title**: Quality Management System for Telecommunications Provision Auditing  

## License

This project is developed for academic purposes as part of a thesis requirement.