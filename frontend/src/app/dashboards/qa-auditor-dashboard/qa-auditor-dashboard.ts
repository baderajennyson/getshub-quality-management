import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-qa-auditor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './qa-auditor-dashboard.html',
  styleUrls: ['./qa-auditor-dashboard.scss']
})
export class QaAuditorDashboardComponent implements OnInit {
  currentUser: any;
  auditorStats = {
    assignedAudits: 0,
    completedToday: 0,
    pendingAudits: 0,
    passRate: 0
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadAuditorStats();
  }

  loadAuditorStats() {
    // Placeholder data
    this.auditorStats = {
      assignedAudits: 15,
      completedToday: 3,
      pendingAudits: 12,
      passRate: 87.5
    };
  }

  logout() {
    this.authService.logout().subscribe();
  }
}