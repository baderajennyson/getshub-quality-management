import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SuperAdminDashboardComponent } from './dashboards/super-admin-dashboard/super-admin-dashboard';
import { ManagerDashboardComponent } from './dashboards/manager-dashboard/manager-dashboard';
import { QaAuditorDashboardComponent } from './dashboards/qa-auditor-dashboard/qa-auditor-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Role-based dashboard routes
  { path: 'admin/dashboard', component: SuperAdminDashboardComponent },
  { path: 'manager/dashboard', component: ManagerDashboardComponent },
  { path: 'auditor/dashboard', component: QaAuditorDashboardComponent },
  
  // Generic dashboard redirect (will be handled by auth service)
  { path: 'dashboard', redirectTo: '/login', pathMatch: 'full' },
];