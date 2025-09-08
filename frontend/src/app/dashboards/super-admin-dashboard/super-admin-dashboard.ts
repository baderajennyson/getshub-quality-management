import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './super-admin-dashboard.html',
  styleUrls: ['./super-admin-dashboard.scss']
})
export class SuperAdminDashboardComponent implements OnInit {
  currentUser: any;
  systemStats = {
    totalUsers: 0,
    activeAuditors: 0,
    systemLogs: 0,
    dataUsage: 0
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSystemStats();
  }

  loadSystemStats() {
    // Placeholder data
    this.systemStats = {
      totalUsers: 45,
      activeAuditors: 12,
      systemLogs: 1523,
      dataUsage: 2.4
    };
  }

  logout() {
    this.authService.logout().subscribe();
  }
}