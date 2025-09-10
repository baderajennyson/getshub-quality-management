// frontend/src/app/features/provisions/provisions-management/provisions-management.component.ts

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { EnhancedDataTableComponent } from '../../../shared/components/enhanced-data-table/enhanced-data-table';
import { ProvisionsService, Provision } from '../../../core/services/provisions';
import { AuthService } from '../../../core/services/auth.service';
import { 
  TableConfig, 
  ColumnConfig, 
  TableAction, 
  BulkAction 
} from '../../../shared/interfaces/data-table.interface';

@Component({
  selector: 'app-provisions-management',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    EnhancedDataTableComponent
  ],
  templateUrl: './provisions-management.html',
  styleUrls: ['./provisions-management.scss']
})
export class ProvisionsManagementComponent implements OnInit {
  
  // State signals
  provisions = signal<Provision[]>([]);
  loading = signal<boolean>(false);
  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(25);
  currentUser = signal<any>(null);
  
  // Filter and sort state
  currentFilters = signal<any>({});
  currentSort = signal<{ column: string; direction: 'asc' | 'desc' }[]>([]);
  
  // Computed properties
  tableConfig = computed<TableConfig>(() => ({
    columns: this.getColumnConfig(),
    data: this.provisions(),
    
    // Pagination
    pageSize: this.pageSize(),
    pageSizeOptions: [10, 25, 50, 100],
    showFirstLastButtons: true,
    
    // Features
    globalSearch: true,
    columnFilters: true,
    selectable: true,
    multiSelect: true,
    selectAllEnabled: true,
    
    // Actions
    rowActions: this.getRowActions(),
    bulkActions: this.getBulkActions(),
    
    // Appearance
    density: 'standard',
    striped: true,
    hoverable: true,
    
    // Export
    exportEnabled: true,
    exportFormats: ['csv', 'excel'],
    exportFileName: 'provisions-export',
    
    // Loading state
    loading: this.loading(),
    loadingText: 'Loading provisions...',
    emptyStateText: 'No provisions found',
    emptyStateIcon: 'inbox',
    
    // Server-side
    serverSide: true,
    totalRecords: this.totalRecords(),
    
    // Column management
    columnToggle: true,
    columnResize: true,
    
    // Events
    onRowClick: (row: Provision) => this.onRowClick(row),
    onRowDoubleClick: (row: Provision) => this.onRowDoubleClick(row),
    onSelectionChange: (selected: Provision[]) => this.onSelectionChange(selected),
    onSort: (sort: { column: string; direction: 'asc' | 'desc' }[]) => this.onSortChange(sort),
    onFilter: (filters: any) => this.onFilterChange(filters),
    onPageChange: (page: number, pageSize: number) => this.onPageChange(page, pageSize)
  }));

  constructor(
    private provisionsService: ProvisionsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentUser.set(this.authService.getCurrentUser());
    this.loadProvisions();
  }

  private getColumnConfig(): ColumnConfig[] {
    return [
      {
        key: 'requestNumber',
        label: 'Request #',
        type: 'text',
        sortable: true,
        filterable: true,
        searchable: true,
        width: '140px',
        sticky: true
      },
      {
        key: 'customerName',
        label: 'Customer Name',
        type: 'text',
        sortable: true,
        filterable: true,
        searchable: true,
        width: '200px'
      },
      {
        key: 'customerAddress',
        label: 'Address',
        type: 'text',
        sortable: true,
        filterable: true,
        searchable: true,
        width: '250px'
      },
      {
        key: 'contactNumber',
        label: 'Contact',
        type: 'phone',
        sortable: true,
        filterable: true,
        width: '140px'
      },
      {
        key: 'provisionType',
        label: 'Type',
        type: 'text',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { value: 'NEW_CONNECTION', label: 'New Connection' },
          { value: 'RECONNECTION', label: 'Reconnection' },
          { value: 'METER_CHANGE', label: 'Meter Change' },
          { value: 'SERVICE_UPGRADE', label: 'Service Upgrade' },
          { value: 'DISCONNECTION', label: 'Disconnection' }
        ],
        width: '150px'
      },
      {
        key: 'status',
        label: 'Status',
        type: 'status',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { value: 'PENDING_ASSIGNMENT', label: 'Pending Assignment' },
          { value: 'AUDIT_ASSIGNED', label: 'Audit Assigned' },
          { value: 'AUDIT_IN_PROGRESS', label: 'In Progress' },
          { value: 'AUDIT_COMPLETED', label: 'Completed' },
          { value: 'PASSED', label: 'Passed' },
          { value: 'FAILED', label: 'Failed' },
          { value: 'BACKJOB', label: 'Backjob' }
        ],
        width: '140px'
      },
      {
        key: 'estimatedCost',
        label: 'Est. Cost',
        type: 'currency',
        sortable: true,
        filterable: true,
        filterType: 'number',
        width: '120px',
        align: 'right'
      },
      {
        key: 'assignedAuditor.firstName',
        label: 'Assigned Auditor',
        type: 'text',
        sortable: true,
        filterable: true,
        width: '160px',
      },
      {
        key: 'requestedCompletionDate',
        label: 'Target Date',
        type: 'date',
        sortable: true,
        filterable: true,
        filterType: 'date',
        width: '120px'
      },
      {
        key: 'qualityScore',
        label: 'Quality Score',
        type: 'number',
        sortable: true,
        filterable: true,
        filterType: 'number',
        width: '100px',
        align: 'center',
        cellClass: (value: number) => {
          if (!value) return '';
          if (value >= 90) return 'score-excellent';
          if (value >= 80) return 'score-good';
          if (value >= 70) return 'score-fair';
          return 'score-poor';
        }
      },
      {
        key: 'createdAt',
        label: 'Created',
        type: 'date',
        sortable: true,
        filterable: true,
        filterType: 'date',
        width: '120px'
      },
      {
        key: 'actions',
        label: 'Actions',
        type: 'actions',
        sortable: false,
        filterable: false,
        width: '120px',
        sticky: true
      }
    ];
  }

  private getRowActions(): TableAction[] {
    const user = this.currentUser();
    if (!user) return [];

    const actions: TableAction[] = [
      {
        key: 'view',
        label: 'View Details',
        icon: 'visibility',
        color: 'primary',
        action: (row: Provision) => this.viewProvision(row)
      }
    ];

    // Add edit action for managers and super admins
    if (user.role === 'MANAGER' || user.role === 'SUPER_ADMIN') {
      actions.push({
        key: 'edit',
        label: 'Edit',
        icon: 'edit',
        color: 'accent',
        action: (row: Provision) => this.editProvision(row)
      });
    }

    // Add assignment action for managers
    if (user.role === 'MANAGER' || user.role === 'SUPER_ADMIN') {
      actions.push({
        key: 'assign',
        label: 'Assign Auditor',
        icon: 'person_add',
        color: 'primary',
        visible: (row: Provision) => row.status === 'PENDING_ASSIGNMENT',
        action: (row: Provision) => this.assignAuditor(row)
      });
    }

    // Add delete action for super admins only
    if (user.role === 'SUPER_ADMIN') {
      actions.push({
        key: 'delete',
        label: 'Delete',
        icon: 'delete',
        color: 'warn',
        action: (row: Provision) => this.deleteProvision(row)
      });
    }

    return actions;
  }

  private getBulkActions(): BulkAction[] {
    const user = this.currentUser();
    if (!user) return [];

    const actions: BulkAction[] = [];

    // Bulk assignment for managers
    if (user.role === 'MANAGER' || user.role === 'SUPER_ADMIN') {
      actions.push({
        key: 'bulk-assign',
        label: 'Assign Auditor',
        icon: 'person_add_alt',
        color: 'primary',
        visible: (selected: Provision[]) => 
          selected.some(p => p.status === 'PENDING_ASSIGNMENT'),
        action: (selected: Provision[]) => this.bulkAssignAuditor(selected)
      });

      actions.push({
        key: 'bulk-status',
        label: 'Update Status',
        icon: 'update',
        color: 'accent',
        action: (selected: Provision[]) => this.bulkUpdateStatus(selected)
      });
    }

    // Bulk export
    actions.push({
      key: 'bulk-export',
      label: 'Export Selected',
      icon: 'download',
      color: 'primary',
      action: (selected: Provision[]) => this.exportSelected(selected)
    });

    // Bulk delete for super admins
    if (user.role === 'SUPER_ADMIN') {
      actions.push({
        key: 'bulk-delete',
        label: 'Delete Selected',
        icon: 'delete',
        color: 'warn',
        confirmation: {
          title: 'Delete Provisions',
          message: 'Are you sure you want to delete the selected provisions? This action cannot be undone.',
          confirmText: 'Delete',
          cancelText: 'Cancel'
        },
        action: (selected: Provision[]) => this.bulkDeleteProvisions(selected)
      });
    }

    return actions;
  }

  private loadProvisions() {
    this.loading.set(true);
    
    const page = this.currentPage() + 1; // API uses 1-based pagination
    const limit = this.pageSize();
    const filters = this.currentFilters();
    const sort = this.currentSort()[0]; // Take first sort

    this.provisionsService.getProvisions(
      page,
      limit,
      filters.status,
      filters.globalSearch,
      sort?.column,
      sort?.direction as 'asc' | 'desc'
    ).subscribe({
      next: (response) => {
        this.provisions.set(response.provisions);
        this.totalRecords.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading provisions:', error);
        this.snackBar.open('Error loading provisions', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  // Event handlers
  onRowClick(row: Provision) {
    console.log('Row clicked:', row);
  }

  onRowDoubleClick(row: Provision) {
    this.viewProvision(row);
  }

  onSelectionChange(selected: Provision[]) {
    console.log('Selection changed:', selected);
  }

  onSortChange(sort: { column: string; direction: 'asc' | 'desc' }[]): void {
    console.log('Sort changed:', sort);
    this.currentSort.set(sort);
    this.currentPage.set(0);
    this.loadProvisions();
  }

  onFilterChange(filters: any) {
    this.currentFilters.set(filters);
    this.currentPage.set(0);
    this.loadProvisions();
  }

  onPageChange(page: number, pageSize: number) {
    this.currentPage.set(page);
    this.pageSize.set(pageSize);
    this.loadProvisions();
  }

  // Action implementations
  viewProvision(provision: Provision) {
    console.log('View provision:', provision);
    // TODO: Open provision details dialog/page
  }

  editProvision(provision: Provision) {
    console.log('Edit provision:', provision);
    // TODO: Open edit provision dialog
  }

  assignAuditor(provision: Provision) {
    console.log('Assign auditor to provision:', provision);
    // TODO: Open auditor assignment dialog
  }

  deleteProvision(provision: Provision) {
    console.log('Delete provision:', provision);
    // TODO: Implement delete confirmation and action
  }

  bulkAssignAuditor(selected: Provision[]) {
    console.log('Bulk assign auditor:', selected);
    // TODO: Open bulk assignment dialog
  }

  bulkUpdateStatus(selected: Provision[]) {
    console.log('Bulk update status:', selected);
    // TODO: Open bulk status update dialog
  }

  bulkDeleteProvisions(selected: Provision[]) {
    console.log('Bulk delete provisions:', selected);
    // TODO: Implement bulk delete
  }

  exportSelected(selected: Provision[]) {
    console.log('Export selected provisions:', selected);
    // TODO: Implement export for selected items
  }

  // Toolbar actions
  createNewProvision() {
    console.log('Create new provision');
    // TODO: Open create provision dialog
  }

  uploadProvisions() {
    console.log('Upload provisions');
    // TODO: Open upload dialog
  }

  exportAllProvisions() {
    console.log('Export all provisions');
    // TODO: Implement export all
  }
}