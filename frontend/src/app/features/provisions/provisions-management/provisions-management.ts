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
import { Provision, ProvisionStatus, ProvisionType, CreateProvisionDto, UpdateProvisionDto } from '../../../shared/models/provision';
import { ColumnConfig, TableConfig, TableAction } from '../../../shared/models/data-table.interface';
import { MatDialog } from '@angular/material/dialog';
import { ProvisionFormDialogComponent } from '../../../shared/dialogs/provision-form-dialog/provision-form-dialog';
import { CsvImportDialogComponent } from '../../../shared/dialogs/csv-import-dialog/csv-import-dialog';

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

  // EXPANDED TABLE CONFIGURATION - INCLUDES ALL BACKEND PROVISION COLUMNS
  tableConfig: TableConfig = {
    showSelection: true,
    showActions: true,
    showPagination: true,
    showSearch: true,
    showColumnControls: true,
    enableColumnManagement: true,
    columns: [
      // === ESSENTIAL COLUMNS ===
      {
        key: 'requestNumber',
        label: 'Request Number',
        sortable: true,
        filterable: true,
        visible: true,
        width: '140px'
      },
      {
        key: 'customerName',
        label: 'Customer Name',
        sortable: true,
        filterable: true,
        visible: true,
        width: '200px'
      },
      {
        key: 'firstName',
        label: 'First Name',
        sortable: true,
        filterable: true,
        visible: false,
        width: '180px'
      },
      {
        key: 'lastName',
        label: 'Last Name',
        sortable: true,
        filterable: true,
        visible: true,
        width: '180px'
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        filterable: true,
        visible: true,
        width: '120px',
        type: 'status'
      },
      {
        key: 'createdAt',
        label: 'Created Date',
        sortable: true,
        filterable: true,
        visible: true,
        width: '120px',
        type: 'date'
      },
      // NOTE: actions column is added by the table component automatically

      // === IDENTIFICATION ===
      { key: 'id', label: 'ID', sortable: false, filterable: false, visible: false, width: '260px' },
      { key: 'isManualRequestNumber', label: 'Manual Request No?', sortable: true, filterable: true, visible: false, width: '140px' },

      // === CUSTOMER INFORMATION ===
      {
        key: 'addressLine1',
        label: 'Address Line 1',
        sortable: true,
        filterable: true,
        visible: false,
        width: '250px'
      },
      {
        key: 'province',
        label: 'Province',
        sortable: true,
        filterable: true,
        visible: true,
        width: '140px'
      },
      {
        key: 'city',
        label: 'City',
        sortable: true,
        filterable: true,
        visible: true,
        width: '140px'
      },
      {
        key: 'barangay',
        label: 'Barangay',
        sortable: true,
        filterable: true,
        visible: false,
        width: '140px'
      },
      {
        key: 'landmark',
        label: 'Landmark',
        sortable: true,
        filterable: true,
        visible: false,
        width: '180px'
      },
      {
        key: 'contactPhone',
        label: 'Contact Phone',
        sortable: true,
        filterable: true,
        visible: false,
        width: '140px'
      },
      {
        key: 'accountNumber',
        label: 'Account Number',
        sortable: true,
        filterable: true,
        visible: false,
        width: '150px'
      },

      // === DISPATCH & ACTIVITY ===
      { key: 'resource', label: 'Resource', sortable: true, filterable: true, visible: true, width: '160px' },
      { key: 'date', label: 'Date', sortable: true, filterable: true, visible: false, width: '130px', type: 'date' },
      { key: 'prDispatch', label: 'Dispatch', sortable: true, filterable: true, visible: false, width: '180px' },
      {
        key: 'activityType',
        label: 'Activity Type',
        sortable: true,
        filterable: true,
        visible: false,
        width: '150px'
      },
      {
        key: 'verificationType',
        label: 'Verification Type',
        sortable: true,
        filterable: true,
        visible: false,
        width: '150px'
      },
      {
        key: 'activityLane',
        label: 'Activity Lane',
        sortable: true,
        filterable: true,
        visible: false,
        width: '150px'
      },
      {
        key: 'activityGrouping',
        label: 'Activity Grouping',
        sortable: true,
        filterable: true,
        visible: false,
        width: '160px'
      },
      {
        key: 'activityClassification',
        label: 'Activity Classification',
        sortable: true,
        filterable: true,
        visible: false,
        width: '170px'
      },
      {
        key: 'activityStatus',
        label: 'Activity Status',
        sortable: true,
        filterable: true,
        visible: false,
        width: '150px'
      },
      { key: 'positionInRoute', label: 'Position In Route', sortable: true, filterable: true, visible: false, width: '140px' },
  
      // === SERVICE INFORMATION ===
      { key: 'marketSegment', label: 'Market Segment', sortable: true, filterable: true, visible: false, width: '150px' },
      { key: 'zone', label: 'Zone', sortable: true, filterable: true, visible: false, width: '120px' },
      { key: 'exchange', label: 'Exchange', sortable: true, filterable: true, visible: false, width: '120px' },
      { key: 'nodeLocation', label: 'Node Location', sortable: true, filterable: true, visible: false, width: '150px' },
      { key: 'cabinetLocation', label: 'Cabinet Location', sortable: true, filterable: true, visible: false, width: '160px' },
      { key: 'modemOwnership', label: 'Modem Ownership', sortable: true, filterable: true, visible: false, width: '160px' },
      { key: 'priority', label: 'Priority', sortable: true, filterable: true, visible: false, width: '120px' },
      { key: 'homeServiceDevice', label: 'Home Service Device', sortable: true, filterable: true, visible: false, width: '170px' },
      { key: 'packageType', label: 'Package Type', sortable: true, filterable: true, visible: false, width: '140px' },
      { key: 'neType', label: 'NE Type', sortable: true, filterable: true, visible: false, width: '120px' },
      { key: 'complaintType', label: 'Complaint Type', sortable: true, filterable: true, visible: false, width: '150px' },

      // === TIMING ===
      { key: 'dateCreated', label: 'Date Created', sortable: true, filterable: true, visible: false, width: '150px', type: 'date' },
      { key: 'dateExtracted', label: 'Date Extracted', sortable: true, filterable: true, visible: false, width: '150px', type: 'date' },
      { key: 'startedDateTime', label: 'Started DateTime', sortable: true, filterable: true, visible: false, width: '170px', type: 'date' },
      { key: 'completionDateTime', label: 'Completion DateTime', sortable: true, filterable: true, visible: false, width: '170px', type: 'date' },
      { key: 'start', label: 'Start', sortable: true, filterable: true, visible: false, width: '120px' },
      { key: 'end', label: 'End', sortable: true, filterable: true, visible: false, width: '120px' },
      { key: 'sawa', label: 'SAWA', sortable: true, filterable: true, visible: false, width: '120px' },
      { key: 'tandemOutsideStatus', label: 'Tandem Outside Status', sortable: true, filterable: true, visible: false, width: '190px' },

      // === WORKFLOW & ASSIGNMENT ===
      {
        key: 'assignedAuditor',
        label: 'Assigned Auditor',
        sortable: true,
        filterable: true,
        visible: true,
        width: '140px'
      },
      {
        key: 'assignedAuditorId',
        label: 'Auditor ID',
        sortable: false,
        filterable: true,
        visible: false,
        width: '120px'
      },
      {
        key: 'uploadedBy',
        label: 'Uploaded By',
        sortable: true,
        filterable: true,
        visible: false,
        width: '140px'
      },
      {
        key: 'uploadedById',
        label: 'Uploader ID',
        sortable: false,
        filterable: true,
        visible: false,
        width: '120px'
      },
  
      {
        key: 'updatedAt',
        label: 'Last Updated',
        sortable: true,
        filterable: true,
        visible: false,
        width: '130px',
        type: 'date'
      },
      // === QUALITY & REMARKS ===
      {
        key: 'auditNotes',
        label: 'Audit Notes',
        sortable: false,
        filterable: true,
        visible: false,
        width: '100px'
      },
      {
        key: 'auditPhotos',
        label: 'Audit Photos',
        sortable: false,
        filterable: false,
        visible: false,
        width: '100px'
      },
      {
        key: 'qualityScore',
        label: 'Quality Score',
        sortable: true,
        filterable: true,
        visible: false,
        width: '110px',
        type: 'number'
      },
      {
        key: 'remarks',
        label: 'Remarks',
        sortable: false,
        filterable: true,
        visible: false,
        width: '200px'
      },
      {
        key: 'managerNotes',
        label: 'Manager Notes',
        sortable: false,
        filterable: true,
        visible: false,
        width: '200px'
      },
      {
        key: 'extendedData',
        label: 'Extended Data',
        sortable: false,
        filterable: false,
        visible: false,
        width: '160px'
      }
    ]
  };

  // Table actions - KEEP EXISTING
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
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProvisions();
    
    // Log the table configuration for debugging
    console.log('📋 Table configured with columns:', this.tableConfig.columns?.length);
    console.log('📋 Visible columns by default:', 
      this.tableConfig.columns?.filter(col => col.visible).map(col => col.key)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Update loadProvisions to use search parameter
  loadProvisions() {
    this.loading = true;
    
    this.provisionsService.getProvisions(
      this.currentPage,
      this.pageSize,
      this.searchQuery, // This will now filter results
      undefined, // status filter
      undefined, // sortBy
      undefined  // sortOrder
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.provisions = response.provisions || [];
        this.totalCount = response.total || 0;
        this.loading = false;
        
        // Log sample data for debugging
        if (this.provisions.length > 0) {
          console.log('📊 Sample provision data keys:', Object.keys(this.provisions[0]));
        }
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

  // Action handlers - KEEP ALL EXISTING METHODS
  viewProvision(provision: Provision) {
    this.dialog.open(ProvisionFormDialogComponent, {
      width: '800px',
      data: { provision, mode: 'view' }
    });
  }

  editProvision(provision: Provision) {
    const dialogRef = this.dialog.open(ProvisionFormDialogComponent, {
      width: '800px',
      data: { provision, mode: 'edit' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'update') {
        this.updateProvision(provision.id, result.data);
      }
    });
  }

  private updateProvision(id: string, updateData: UpdateProvisionDto) {
    this.provisionsService.updateProvision(id, updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Provision updated successfully', 'Close', {
            duration: 3000
          });
          this.loadProvisions();
        },
        error: (error) => {
          console.error('Error updating provision:', error);
          this.snackBar.open('Failed to update provision', 'Close', {
            duration: 3000
          });
        }
      });
  }

  assignAuditor(provision: Provision) {
    // TODO: Implement auditor assignment dialog
    console.log('Assign auditor to:', provision);
    this.snackBar.open('Auditor assignment feature coming soon', 'Close', {
      duration: 3000
    });
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
    const dialogRef = this.dialog.open(CsvImportDialogComponent, {
      width: '900px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.imported) {
        this.snackBar.open(`Import completed. Success: ${result.result.successful}, Failed: ${result.result.failed}`, 'Close', {
          duration: 4000
        });
        this.loadProvisions();
      }
    });
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
          link.download = `provisions_export_${new Date().toISOString().split('T')[0]}.csv`;
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
    const statusLabels = {
      [ProvisionStatus.PENDING_ASSIGNMENT]: 'Pending Assignment',
      [ProvisionStatus.AUDIT_ASSIGNED]: 'Audit Assigned',
      [ProvisionStatus.AUDIT_IN_PROGRESS]: 'Audit In Progress',
      [ProvisionStatus.AUDIT_COMPLETED]: 'Audit Completed',
      [ProvisionStatus.PASSED]: 'Passed',
      [ProvisionStatus.FAILED]: 'Failed',
      [ProvisionStatus.BACKJOB]: 'Backjob',
      [ProvisionStatus.COMPLETED]: 'Completed',
      [ProvisionStatus.CANCELLED]: 'Cancelled',
      [ProvisionStatus.SUSPENDED]: 'Suspended'
    } as const;
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

  // Add this method inside the ProvisionsManagementComponent class
  createNewProvision() {
    const dialogRef = this.dialog.open(ProvisionFormDialogComponent, {
      width: '800px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'create') {
        this.createProvision(result.data);
      }
    });
  }

  // Also add this helper method
  private createProvision(createData: CreateProvisionDto) {
    this.provisionsService.createProvision(createData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Provision created successfully', 'Close', {
            duration: 3000
          });
          this.loadProvisions();
        },
        error: (error) => {
          console.error('Error creating provision:', error);
          this.snackBar.open('Failed to create provision', 'Close', {
            duration: 3000
          });
        }
      });
  }
}