import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manager-dashboard.html',
  styleUrls: ['./manager-dashboard.scss']
})
export class ManagerDashboardComponent implements OnInit {
  currentUser: any;
  dashboardStats = {
    totalProvisions: 0,
    pendingAssignment: 0,
    auditAssigned: 0,
    passed: 0,
    failed: 0,
    backjobs: 0
  };

  recentActivity: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardStats();
    this.loadRecentActivity();
  }

  loadDashboardStats() {
    // TODO: Will connect to backend API in next step
    // For now, show realistic placeholder data
    this.dashboardStats = {
      totalProvisions: 1247,
      pendingAssignment: 23,
      auditAssigned: 15,
      passed: 1109,
      failed: 45,
      backjobs: 8
    };
  }

  loadRecentActivity() {
    // Placeholder data for recent activity
    this.recentActivity = [
      {
        id: 1,
        type: 'provision_uploaded',
        message: 'New provision batch uploaded (50 requests)',
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: 2,
        type: 'audit_completed',
        message: 'Audit completed for REQ-2024-001247 - PASSED',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 3,
        type: 'audit_assigned',
        message: '12 audits assigned to John Auditor',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ];
  }

  logout() {
    this.authService.logout().subscribe();
  }
}