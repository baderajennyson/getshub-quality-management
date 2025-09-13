# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (NestJS)
```bash
cd backend
npm run start:dev        # Start backend in development mode
npm run build           # Build the backend
npm run lint            # Run ESLint
npm run test            # Run Jest tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run end-to-end tests
npm run format          # Format code with Prettier
```

### Frontend (Angular)
```bash
cd frontend
ng serve                # Start frontend development server
ng build                # Build the frontend
ng test                 # Run Karma/Jasmine tests
```

### Infrastructure
```bash
docker-compose up -d postgres    # Start PostgreSQL database
docker-compose up -d pgadmin     # Start pgAdmin (localhost:5050)
docker-compose up -d redis       # Start Redis cache
```

## Architecture

### Project Structure
- **Backend**: NestJS API with TypeORM, PostgreSQL, JWT authentication
- **Frontend**: Angular 17+ standalone components with Angular Material
- **Database**: PostgreSQL with entities for Users and Provisions
- **Authentication**: JWT-based with role-based access control (Super Admin, Manager, QA Auditor)

### Key Modules

#### Backend
- `auth/`: JWT authentication with Passport strategy
- `users/`: User management with role-based access
- `provisions/`: Core business logic for telecommunications provision auditing
- `database/`: TypeORM configuration and database module

#### Frontend
- `core/services/`: HTTP services for API communication (auth, provisions)
- `shared/components/`: Reusable components including enhanced data table
- `shared/dialogs/`: Modal dialogs for forms and imports
- `features/provisions/`: Main provisions management interface
- `dashboards/`: Role-specific dashboard components

### Database Entities
- **User**: Authentication and role management (Super Admin, Manager, QA Auditor)
- **Provision**: Complex telecommunications provision requests with extensive field mapping

### Key Features
- Enhanced data table with column management, sorting, filtering, and pagination
- CSV import/export functionality for provisions
- Role-based UI rendering and access control
- Comprehensive provision management with audit workflow

### Authentication Flow
- JWT tokens stored in localStorage
- Function-based HTTP interceptor for token attachment
- Role-based route guards and component rendering

### Test Accounts
- Super Admin: admin / admin123
- Manager: manager1 / admin123  
- QA Auditor: auditor1 / admin123

## Development Notes

### Database Connection
- Default credentials: getshub_user / getshub_pass
- Database: getshub_db
- Port: 5432 (exposed via Docker)

### API Endpoints
- Backend runs on port 3000 (default NestJS)
- Frontend proxy configuration may be in `frontend/proxy.conf.json`
- Environment configuration in `frontend/src/environments/`

### Code Conventions
- Angular: Standalone components with `.ts`, `.html`, `.scss` file structure
- NestJS: Standard module/controller/service pattern with DTOs
- TypeScript strict mode enabled
- Angular Material for UI components