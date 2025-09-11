// src/app/features/provisions/provisions-management/provisions-management.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { EnhancedDataTableComponent } from '../../../shared/components/enhanced-data-table/enhanced-data-table';
import { ProvisionsService } from '../../../core/services/provisions.service';
import { Provision, ProvisionStatus, ProvisionType } from '../../../shared/models/provision';
import { ColumnConfig, TableConfig, TableAction } from '../../../shared/models/data-table.interface';

@Component({
  selector: 'app-provisions-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatDialogModule,
    EnhancedDataTableComponent
  ],
  templateUrl: './provisions-management.html',
  styleUrls: ['./provisions-management.scss']
})
export class ProvisionsManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  provisions: Provision[] = [];
  loading = false;
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  searchQuery = '';
  selectedProvisions: Provision[] = [];

  // Table configuration
  tableConfig: TableConfig = {
    columns: [
      {
        key: 'requestNumber',
        label: 'Request #',
        sortable: true,
        width: '120px'
      },
      {
        key: 'customerName',
        label: 'Customer Name',
        sortable: true,
        width: '200px'
      },
      {
        key: 'customerAddress',
        label: 'Address',
        sortable: false,
        width: '250px'
      },
      {
        key: 'provisionType',
        label: 'Type',
        sortable: true,
        width: '150px',
        formatter: (value) => this.formatProvisionType(value)
      },
      {
        key: 'status',
        label: 'Status',
        type: 'status',
        sortable: true,
        width: '140px',
        formatter: (value) => this.formatStatus(value)
      },
      {
        key: 'estimatedCost',
        label: 'Est. Cost',
        type: 'number',
        sortable: true,
        width: '120px'
      },
      {
        key: 'assignedAuditor',
        label: 'Assigned To',
        sortable: false,
        width: '150px',
        formatter: (value) => value ? `${value.firstName} ${value.lastName}` : 'Unassigned'
      },
      {
        key: 'createdAt',
        label: 'Created',
        type: 'date',
        sortable: true,
        width: '120px'
      }
    ],
    showSearch: true,
    showSelection: true,
    showPagination: true,
    showActions: true,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    striped: true,
    hoverable: true,
    density: 'standard',
    emptyStateText: 'No provisions found',
    emptyStateIcon: 'assignment'
  };

  // Table actions
  tableActions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'visibility',
      color: 'primary',
      action: (row) => this.viewProvision(row)
    },
    {
      label: 'Edit',
      icon: 'edit',
      color: 'accent',
      action: (row) => this.editProvision(row),
      disabled: (row) => row.status === 'PASSED' || row.status === 'FAILED'
    },
    {
      label: 'Assign Auditor',
      icon: 'person_add',
      color: 'primary',
      action: (row) => this.assignAuditor(row),
      visible: (row) => row.status === 'PENDING_ASSIGNMENT'
    },
    {
      label: 'Delete',
      icon: 'delete',
      color: 'warn',
      action: (row) => this.deleteProvision(row),
      disabled: (row) => row.status !== 'PENDING_ASSIGNMENT'
    }
  ];

  constructor(
    private provisionsService: ProvisionsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProvisions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProvisions() {
    this.loading = true;
    
    this.provisionsService.getProvisions(
      this.currentPage,
      this.pageSize,
      this.searchQuery  // Fixed: search parameter in correct position
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.provisions = response.provisions || [];
        this.totalCount = response.total || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading provisions:', error);
        this.loading = false;
        this.snackBar.open('Failed to load provisions', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onPageChange(event: {page: number, pageSize: number}) {
    this.currentPage = event.page;
    this.pageSize = event.pageSize;
    this.loadProvisions();
  }

  onSortChange(event: {column: string, direction: 'asc' | 'desc'}) {
    // Implement sorting logic
    console.log('Sort change:', event);
    this.loadProvisions();
  }

  onSearchChange(searchQuery: string) {
    this.searchQuery = searchQuery;
    this.currentPage = 1;
    this.loadProvisions();
  }

  onSelectionChange(selectedRows: Provision[]) {
    this.selectedProvisions = selectedRows;
  }

  // Action handlers
  viewProvision(provision: Provision) {
    console.log('View provision:', provision);
    // TODO: Implement view details dialog
  }

  editProvision(provision: Provision) {
    console.log('Edit provision:', provision);
    // TODO: Implement edit dialog
  }

  assignAuditor(provision: Provision) {
    console.log('Assign auditor to:', provision);
    // TODO: Implement assign auditor dialog
  }

  deleteProvision(provision: Provision) {
    if (confirm(`Are you sure you want to delete provision ${provision.requestNumber}?`)) {
      this.provisionsService.deleteProvision(provision.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Provision deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadProvisions();
          },
          error: (error) => {
            console.error('Error deleting provision:', error);
            this.snackBar.open('Failed to delete provision', 'Close', {
              duration: 3000
            });
          }
        });
    }
  }

  // Bulk actions
  bulkAssignAuditor() {
    if (this.selectedProvisions.length === 0) return;
    console.log('Bulk assign auditor to:', this.selectedProvisions);
    // TODO: Implement bulk assign dialog
  }

  bulkDelete() {
    if (this.selectedProvisions.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${this.selectedProvisions.length} provisions?`)) {
      // TODO: Implement bulk delete
      console.log('Bulk delete:', this.selectedProvisions);
    }
  }

  uploadProvisions() {
    console.log('Upload provisions');
    // TODO: Implement file upload dialog
  }

  exportProvisions() {
    console.log('Export provisions');
    this.provisionsService.exportProvisions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `provisions_export_${new Date().toISOString().split('T')[0]}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Export error:', error);
          this.snackBar.open('Failed to export provisions', 'Close', {
            duration: 3000
          });
        }
      });
  }

  // Utility methods
  formatStatus(status: ProvisionStatus): string {
    const statusLabels: Record<ProvisionStatus, string> = {
      [ProvisionStatus.PENDING_ASSIGNMENT]: 'Pending Assignment',
      [ProvisionStatus.AUDIT_ASSIGNED]: 'Audit Assigned',
      [ProvisionStatus.AUDIT_IN_PROGRESS]: 'In Progress',
      [ProvisionStatus.AUDIT_COMPLETED]: 'Completed',
      [ProvisionStatus.PASSED]: 'Passed',
      [ProvisionStatus.FAILED]: 'Failed',
      [ProvisionStatus.BACKJOB]: 'Backjob'
    };
    return statusLabels[status] || status;
  }

  formatProvisionType(type: ProvisionType): string {
    const typeLabels: Record<ProvisionType, string> = {
      [ProvisionType.NEW_CONNECTION]: 'New Connection',
      [ProvisionType.RECONNECTION]: 'Reconnection',
      [ProvisionType.METER_CHANGE]: 'Meter Change',
      [ProvisionType.SERVICE_UPGRADE]: 'Service Upgrade',
      [ProvisionType.DISCONNECTION]: 'Disconnection'
    };
    return typeLabels[type] || type;
  }

  refreshData() {
    this.loadProvisions();
  }

    // Add these getter methods to fix template issues
  get pendingCount(): number {
    return this.provisions.filter(p => p.status === ProvisionStatus.PENDING_ASSIGNMENT).length;
  }

  get assignedCount(): number {
    return this.provisions.filter(p => p.status === ProvisionStatus.AUDIT_ASSIGNED).length;
  }

  get passedCount(): number {
    return this.provisions.filter(p => p.status === ProvisionStatus.PASSED).length;
  }

  get failedCount(): number {
    return this.provisions.filter(p => p.status === ProvisionStatus.FAILED).length;
  }
}