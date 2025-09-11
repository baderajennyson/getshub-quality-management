// src/app/shared/components/enhanced-data-table/enhanced-data-table.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnConfig, TableConfig, TableAction, ColumnVisibility } from '../../models/data-table.interface';

@Component({
  selector: 'app-enhanced-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule
  ],
  templateUrl: './enhanced-data-table.html',
  styleUrls: ['./enhanced-data-table.scss']
})
export class EnhancedDataTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() totalCount = 0;
  @Input() initialColumnVisibility?: ColumnVisibility;
 
  @Output() pageChange = new EventEmitter<{page: number, pageSize: number}>();
  @Output() sortChange = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<{action: string, row: any}>();
  @Output() columnVisibilityChange = new EventEmitter<ColumnVisibility>();
  @Output() rowClick = new EventEmitter<any>(); // NEW: Row click event

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [];
  searchValue = '';
  
  columnVisibility: ColumnVisibility = {};
  showColumnMenu = false;
  private searchTimeout: any;

  // NEW: Column presets configuration
  columnPresets = [
    { 
      key: 'basic', 
      label: 'Basic', 
      columns: ['requestNumber', 'customerName', 'location', 'status', 'createdAt'] 
    },
    { 
      key: 'operational', 
      label: 'Operational', 
      columns: ['requestNumber', 'customerName', 'activityType', 'resource', 'status', 'assignedAuditor', 'createdAt'] 
    },
    { 
      key: 'technical', 
      label: 'Technical', 
      columns: ['requestNumber', 'customerName', 'location', 'activityType', 'resource', 'status', 'assignedAuditor', 'createdAt', 'contactPhone'] 
    }
  ];

  // NEW: Track which preset is currently active
  activePreset = 'operational'; // Default to operational view

  // NEW: Available columns for the column menu
  get availableColumns() {
    return this.config.columns || [];
  }

  ngOnInit() {
    this.setupTable();
    this.initializeColumnVisibility();
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
    this.setupTable();
  }

  private setupTable() {
    this.displayedColumns = [];
    
    if (this.config.showSelection) {
      this.displayedColumns.push('select');
    }
    
    // Only add visible columns
    const visibleColumns = this.getVisibleColumns();
    this.displayedColumns.push(...visibleColumns.map(col => col.key));
    
    if (this.config.showActions && this.actions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  onSearch(event: any) {
    this.searchValue = event.target.value;
    // Debounce search to avoid too many API calls
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchChange.emit(this.searchValue);
    }, 300);
  }

  onSort(event: any) {
    this.sortChange.emit({
      column: event.active,
      direction: event.direction
    });
  }

  onPageChange(event: any) {
    this.pageChange.emit({
      page: event.pageIndex + 1,
      pageSize: event.pageSize
    });
  }

  isAllSelected() {
    return this.selection.selected.length === this.data.length;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.data.forEach(row => this.selection.select(row));
    
    this.selectionChange.emit(this.selection.selected);
  }

  onRowSelect(row: any) {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  onActionClick(action: TableAction, row: any) {
    action.action(row);
    this.actionClick.emit({ action: action.label, row });
  }

  getColumnValue(row: any, column: ColumnConfig): any {
    const value = row[column.key];
    return column.formatter ? column.formatter(value) : value;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PENDING_ASSIGNMENT': 'status-pending',
      'AUDIT_ASSIGNED': 'status-assigned',
      'AUDIT_IN_PROGRESS': 'status-in-progress',
      'AUDIT_COMPLETED': 'status-completed',
      'PASSED': 'status-passed',
      'FAILED': 'status-failed',
      'BACKJOB': 'status-backjob'
    };
    return statusClasses[status] || 'status-default';
  }

  private initializeColumnVisibility() {
    this.columnVisibility = {};
    this.config.columns.forEach(column => {
      this.columnVisibility[column.key] = this.initialColumnVisibility?.[column.key] ?? true;
    });
  }

  getVisibleColumns(): ColumnConfig[] {
    return this.config.columns.filter(column => this.columnVisibility[column.key]);
  }

  toggleColumn(columnKey: string, checked: boolean) {
    this.columnVisibility[columnKey] = checked;
    this.setupTable();
    this.columnVisibilityChange.emit(this.columnVisibility);
  }

  toggleColumnMenu() {
    this.showColumnMenu = !this.showColumnMenu;
  }

  // NEW: Apply a column preset (Basic, Operational, or Technical view)
  applyColumnPreset(presetKey: string) {
    this.activePreset = presetKey;
    const preset = this.columnPresets.find(p => p.key === presetKey);
    
    if (preset) {
      // Reset all columns to hidden first
      Object.keys(this.columnVisibility).forEach(key => {
        this.columnVisibility[key] = false;
      });
      
      // Show only the columns for this preset
      preset.columns.forEach(columnKey => {
        if (this.columnVisibility.hasOwnProperty(columnKey)) {
          this.columnVisibility[columnKey] = true;
        }
      });
      
      // Update the table display
      this.setupTable();
      this.columnVisibilityChange.emit(this.columnVisibility);
    }
  }

  // NEW: Handle row click events
  onRowClick(row: any, event: Event) {
    // Prevent row click if clicking on checkbox or buttons
    const target = event.target as HTMLElement;
    if (target.closest('mat-checkbox') || target.closest('button') || target.closest('mat-icon-button')) {
      return;
    }
    
    this.rowClick.emit(row);
  }

  // ===== TELECOMMUNICATIONS-SPECIFIC HELPER METHODS =====

  getFullAddress(row: any): string {
    if (!row) return '';
    const parts = [
      row.addressLine1,
      row.barangay,
      row.city,
      row.province
    ].filter(part => part && part.trim());
    
    return parts.join(', ');
  }

  getShortActivityType(activityType: string): string {
    if (!activityType) return 'Not Set';
    
    // Remove common prefixes and shorten
    let shortened = activityType
      .replace('Inside - ', '')
      .replace('Outside - ', '')
      .substring(0, 20);
      
    // Add ellipsis if truncated
    if (activityType.length > 20) {
      shortened += '...';
    }
    
    return shortened;
  }

  getStatusLabel(status: string): string {
    if (!status) return 'Unknown';
    
    // Convert status to readable format
    return status
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    } catch (error) {
      return '';
    }
  }

  getCustomerName(row: any): string {
    if (!row) return '';
    const firstName = row.firstName || '';
    const lastName = row.lastName || '';
    return `${firstName} ${lastName}`.trim();
  }

  getLocation(row: any): string {
    if (!row) return '';
    const city = row.city || '';
    const province = row.province || '';
    return `${city}${city && province ? ', ' : ''}${province}`;
  }

  getAssignedAuditor(row: any): string {
    if (!row?.assignedAuditor) return 'Unassigned';
    const auditor = row.assignedAuditor;
    return `${auditor.firstName || ''} ${auditor.lastName || ''}`.trim();
  }

  // Badge helpers
  isManualRequest(row: any): boolean {
    return !!row?.isManualRequestNumber;
  }

  getRequestBadgeText(row: any): string {
    return this.isManualRequest(row) ? 'M' : 'A';
  }

  getRequestBadgeTooltip(row: any): string {
    return this.isManualRequest(row) ? 'Manual Request Number' : 'Auto-Generated Request Number';
  }
}