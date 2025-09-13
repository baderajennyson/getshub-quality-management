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
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ColumnConfig, TableConfig, TableAction, ColumnVisibility } from '../../models/data-table.interface';
interface ColumnPreset {
  key: string;
  label: string;
  columns: string[];
}

interface ColumnCategory {
  name: string;
  description: string;
  icon: string;
  columns: ColumnDefinition[];
}

interface ColumnDefinition {
  key: string;
  label: string;
  description: string;
}
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
    MatMenuModule,
    MatDividerModule,
    MatCardModule,
    MatSlideToggleModule,
    DragDropModule
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
  @Output() rowClick = new EventEmitter<any>(); // Row click event

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [];
  searchValue = '';
  
  columnVisibility: ColumnVisibility = {};
  showColumnMenu = false;
  private searchTimeout: any;

  // SAFE AUTO-GENERATED PRESETS - Initialize as empty arrays
  columnPresets: any[] = [];
  columnCategories: any[] = [];

  // Track which preset is currently active
  activePreset = 'quickview'; // Default to Quick View as requested

  // Temporary storage for column visibility changes (before save)
  tempColumnVisibility: ColumnVisibility = {};
  showAdvancedColumnPanel = false;

  // Category expansion management
  private expandedCategories = new Set<string>(['Available Columns']); // Default expanded
  
  // Column ordering management
  columnOrder: string[] = [];
  showColumnReorderPanel = false;

  // Available columns for the column menu
  get availableColumns() {
    return this.config?.columns || [];
  }

  // Get all available columns from categories (fallback to config columns if categories empty)
  get allAvailableColumns() {
    const categorized = this.columnCategories.flatMap(category => category.columns);
    if (categorized.length > 0) return categorized;
    return (this.config?.columns || []).map(col => ({ key: col.key, label: col.label, description: col.label }));
  }

  // REPLACE the entire generateSafePresets() method with this:

private generateSafePresets() {
  if (!this.config?.columns || this.config.columns.length === 0) {
    console.warn('No columns available to generate presets');
    return;
  }
  
    const availableColumns = this.config.columns.map(col => col.key);
    console.log('🔧 Generating enterprise presets from available columns:', availableColumns);
    
    // Simple presets - Quick View and Custom only as requested
    this.columnPresets = [
      { 
        key: 'quickview', 
        label: 'Quick View', 
        description: 'Essential columns: Request Number, Customer Name, Status, Assigned Auditor, Resource, Province, City',
        columns: this.filterValidColumns(['requestNumber', 'customerName', 'status', 'assignedAuditor', 'resource', 'province', 'city']),
        isDefault: true
      }
    ];
    
    // Complete 38-column enterprise organization
    this.columnCategories = [
      {
        name: 'Essential',
        description: 'Core columns for daily operations',
        icon: 'star',
        columns: [
          { key: 'requestNumber', label: 'Request Number', description: 'Unique request identifier' },
          { key: 'customerName', label: 'Customer Name', description: 'Customer full name (first + last)' },
          { key: 'firstName', label: 'First Name', description: 'Customer first name' },
          { key: 'lastName', label: 'Last Name', description: 'Customer last name' },
          { key: 'status', label: 'Status', description: 'Current provision status' },
          { key: 'createdAt', label: 'Created Date', description: 'When provision was created' },
        ]
      },
      {
        name: 'Customer Information',
        description: 'Complete customer information',
        icon: 'person',
        columns: [
          { key: 'addressLine1', label: 'Address Line 1', description: 'Full customer address' },
          { key: 'province', label: 'Province', description: 'Province location' },
          { key: 'city', label: 'City', description: 'City location' },
          { key: 'barangay', label: 'Barangay', description: 'Barangay location' },
          { key: 'landmark', label: 'Landmark', description: 'Nearby landmark reference' },
          { key: 'contactPhone', label: 'Contact Phone', description: 'Alternative contact number' },
          { key: 'accountNumber', label: 'Account Number', description: 'Customer account identifier' }
        ]
      },
      {
        name: 'Dispatch & Activity',
        description: 'Service and technical specifications',
        icon: 'settings',
        columns: [
          { key: 'resource', label: 'Resource', description: 'Assigned resource/technician' },
          { key: 'date', label: 'Date', description: 'Dispatch date' },
          { key: 'prDispatch', label: 'Dispatch', description: 'Dispatch type' },
          { key: 'activityType', label: 'Activity Type', description: 'Type of activity required' },
          { key: 'verificationType', label: 'Verification Type', description: 'Verification type' },
          { key: 'activityLane', label: 'Activity Lane', description: 'Lane' },
          { key: 'activityGrouping', label: 'Activity Grouping', description: 'Grouping' },
          { key: 'activityClassification', label: 'Activity Classification', description: 'Classification' },
          { key: 'activityStatus', label: 'Activity Status', description: 'Status' },
          { key: 'positionInRoute', label: 'Position In Route', description: 'Route position' }
        ]
      },
      {
        name: 'Service Information',
        description: 'Service details and network info',
        icon: 'construction',
        columns: [
          { key: 'marketSegment', label: 'Market Segment', description: 'Market segment' },
          { key: 'zone', label: 'Zone', description: 'Zone' },
          { key: 'exchange', label: 'Exchange', description: 'Exchange' },
          { key: 'nodeLocation', label: 'Node Location', description: 'Node location' },
          { key: 'cabinetLocation', label: 'Cabinet Location', description: 'Cabinet location' },
          { key: 'modemOwnership', label: 'Modem Ownership', description: 'Modem ownership' },
          { key: 'priority', label: 'Priority', description: 'Priority' },
          { key: 'homeServiceDevice', label: 'Home Service Device', description: 'Device' },
          { key: 'packageType', label: 'Package Type', description: 'Package' },
          { key: 'neType', label: 'NE Type', description: 'Network equipment type' },
          { key: 'complaintType', label: 'Complaint Type', description: 'Complaint type' }
        ]
      },
      {
        name: 'Timing',
        description: 'Important dates and schedule',
        icon: 'schedule',
        columns: [
          { key: 'dateCreated', label: 'Date Created', description: 'Date created' },
          { key: 'dateExtracted', label: 'Date Extracted', description: 'Date extracted' },
          { key: 'startedDateTime', label: 'Started DateTime', description: 'Start time' },
          { key: 'completionDateTime', label: 'Completion DateTime', description: 'Completion time' },
          { key: 'start', label: 'Start', description: 'Start window' },
          { key: 'end', label: 'End', description: 'End window' },
          { key: 'sawa', label: 'SAWA', description: 'SAWA' },
          { key: 'tandemOutsideStatus', label: 'Tandem Outside Status', description: 'Tandem outside status' }
        ]
      },
      {
        name: 'Workflow & Assignment',
        description: 'Audit workflow and assignment data',
        icon: 'assignment',
        columns: [
          { key: 'assignedAuditor', label: 'Assigned Auditor', description: 'Auditor assigned to provision' },
          { key: 'assignedAuditorId', label: 'Auditor ID', description: 'Auditor identifier' },
          { key: 'uploadedBy', label: 'Uploaded By', description: 'Who uploaded the provision' },
          { key: 'uploadedById', label: 'Uploader ID', description: 'Uploader identifier' }
        ]
      },
      {
        name: 'Quality & Remarks',
        description: 'Quality metrics and notes',
        icon: 'fact_check',
        columns: [
          { key: 'updatedAt', label: 'Last Updated', description: 'When provision was last modified' },
          { key: 'auditNotes', label: 'Audit Notes', description: 'Auditor notes and comments' },
          { key: 'auditPhotos', label: 'Audit Photos', description: 'Attached audit photos' },
          { key: 'qualityScore', label: 'Quality Score', description: 'Audit quality assessment score' },
          { key: 'remarks', label: 'Remarks', description: 'Remarks' },
          { key: 'managerNotes', label: 'Manager Notes', description: 'Manager notes' },
          { key: 'extendedData', label: 'Extended Data', description: 'Extra provision information' }
        ]
      }
    ];
    
    // Filter categories to only include columns that exist in the table config
    this.columnCategories = this.columnCategories.map((category: any) => ({
      ...category,
      columns: category.columns.filter((col: any) => 
        availableColumns.includes(col.key)
      )
    })).filter((category: any) => category.columns.length > 0); // Remove empty categories
    
    console.log('✅ Generated enterprise presets:', this.columnPresets);
    console.log('✅ Generated enterprise categories:', this.columnCategories);
  }

  // Add this new helper method right after generateSafePresets()
  private filterValidColumns(columns: string[]): string[] {
    if (!this.config?.columns) return [];
    
    const availableColumns = this.config.columns.map(col => col.key);
    return columns.filter(col => availableColumns.includes(col));
  }

  ngOnInit() {
    console.log('🚀 EnhancedDataTable initialized');
    
    // Generate safe presets from actual table configuration
    if (this.config?.columns?.length > 0) {
      this.generateSafePresets();
    }
    
    // Try to load saved preferences first
    const preferencesLoaded = this.loadColumnPreferences();
    
    if (!preferencesLoaded) {
      // Initialize with default operational preset
      this.initializeColumnVisibility();
      // Apply Quick View preset after generating safe presets
      setTimeout(() => {
        this.applyColumnPreset('quickview');
      }, 100);
    } else {
      // Use loaded preferences
      this.setupTable();
    }
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
    
    // Regenerate presets if config is available and presets are empty
    if (this.config?.columns?.length > 0 && this.columnPresets.length === 0) {
      console.log('🔄 Regenerating presets on config change');
      this.generateSafePresets();
    }
    
    // Only setup table if we have column configuration
    if (this.allAvailableColumns.length > 0) {
      this.setupTable();
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

  toggleColumn(columnKey: string, checked: boolean) {
    this.columnVisibility[columnKey] = checked;
    this.setupTable();
    this.columnVisibilityChange.emit(this.columnVisibility);
  }

  toggleColumnMenu() {
    this.showColumnMenu = !this.showColumnMenu;
  }

  /**
   * Debug method to log current column configuration
   */
  debugColumnConfiguration() {
    console.log('=== COLUMN DEBUG INFO ===');
    console.log('Available config columns:', this.config?.columns?.map(col => col.key) || []);
    console.log('Current columnVisibility keys:', Object.keys(this.columnVisibility));
    console.log('Current columnVisibility values:', this.columnVisibility);
    console.log('Visible columns:', this.getVisibleColumns().map(col => col.key));
    console.log('Displayed columns:', this.displayedColumns);
    console.log('Data sample:', this.data?.[0] || {});
    console.log('========================');
  }

  // REPLACE the existing applyColumnPreset method with this enhanced version:

  applyColumnPreset(presetKey: string): void {
    console.log(`🎯 Applying preset: ${presetKey}`);
    
    const preset = this.columnPresets.find(p => p.key === presetKey);
    if (!preset) {
      console.warn(`⚠️ Preset not found: ${presetKey}`);
      return;
    }

    // Get all available column keys from current config
    const availableColumnKeys = this.config.columns?.map(col => col.key) || [];
    console.log('📋 Available column keys:', availableColumnKeys);
    
    // Filter preset columns to only include existing ones
    const validColumns = preset.columns.filter((columnKey: string) => 
      availableColumnKeys.includes(columnKey)
    );

    console.log(`📋 Valid columns for preset ${presetKey}:`, validColumns);

    if (validColumns.length === 0) {
      console.warn(`❌ No valid columns found for preset: ${presetKey}`);
      return;
    }

    // Reset all columns to hidden first
    this.allAvailableColumns.forEach((column: any) => {
      this.columnVisibility[column.key] = false;
    });

    // Enable only valid columns from the preset
    validColumns.forEach((columnKey: string) => {
      this.columnVisibility[columnKey] = true;
      console.log('✅ Enabled column:', columnKey);
    });

    // Update active preset tracking
    this.activePreset = presetKey;

    // Save to localStorage for persistence
    this.saveColumnPreferences();

    // Update the table display
    this.setupTable();
    this.columnVisibilityChange.emit(this.columnVisibility);

    console.log(`🏁 Preset ${presetKey} applied successfully with ${validColumns.length} columns`);
  }

  /**
   * Handle row click events
   */
  onRowClick(row: any, event: Event) {
    // Prevent row click if clicking on checkbox or buttons
    const target = event.target as HTMLElement;
    if (target.closest('mat-checkbox') || target.closest('button') || target.closest('mat-icon-button')) {
      return;
    }
    
    this.rowClick.emit(row);
  }

  /**
   * Get temporary column visibility state for template binding
   */
  getTempColumnVisibility(columnKey: string): boolean {
    // If we have temporary changes, use them; otherwise use current visibility
    if (Object.keys(this.tempColumnVisibility).length > 0 && 
        this.tempColumnVisibility.hasOwnProperty(columnKey)) {
      return this.tempColumnVisibility[columnKey];
    }
    return this.columnVisibility[columnKey] || false;
  }

  // ADVANCED COLUMN PANEL METHODS

  /**
   * Open advanced column management panel
   */
  openAdvancedColumnPanel() {
    this.showAdvancedColumnPanel = true;
    // Create temporary copy for preview
    this.tempColumnVisibility = { ...this.columnVisibility };
  }

  /**
   * Preview column changes without saving
   */
  previewColumnChange(columnKey: string, checked: boolean) {
    this.tempColumnVisibility[columnKey] = checked;
    // Temporarily apply changes for preview
    this.columnVisibility[columnKey] = checked;
    this.setupTable();
  }

  /**
   * Apply column changes and save
   */
  applyColumnChanges() {
    this.columnVisibility = { ...this.tempColumnVisibility };
    this.saveColumnPreferences();
    this.setupTable();
    this.columnVisibilityChange.emit(this.columnVisibility);
    this.closeAdvancedColumnPanel();
    this.activePreset = 'custom'; // Mark as custom when manually changed
  }

  /**
   * Cancel column changes
   */
  cancelColumnChanges() {
    // Restore original visibility
    this.columnVisibility = { ...this.tempColumnVisibility };
    this.setupTable();
    this.closeAdvancedColumnPanel();
  }

  /**
   * Close advanced panel
   */
  closeAdvancedColumnPanel() {
    this.showAdvancedColumnPanel = false;
    this.tempColumnVisibility = {};
  }

  /**
   * Reset to default column configuration
   */
  resetToDefaults() {
    this.applyColumnPreset('quickview');
    this.closeAdvancedColumnPanel();
  }

  // CATEGORY MANAGEMENT METHODS

  isCategoryExpanded(categoryName: string): boolean {
    return this.expandedCategories.has(categoryName);
  }

  toggleCategoryExpansion(categoryName: string) {
    if (this.expandedCategories.has(categoryName)) {
      this.expandedCategories.delete(categoryName);
    } else {
      this.expandedCategories.add(categoryName);
    }
  }

  // Select/Deselect helpers for categories and global
  selectAllInCategory(category: any, checked: boolean) {
    if (!category?.columns) return;
    category.columns.forEach((col: any) => this.previewColumnChange(col.key, checked));
  }

  selectAllColumns(checked: boolean) {
    this.allAvailableColumns.forEach((col: any) => this.previewColumnChange(col.key, checked));
  }

  /**
   * Get visible column count for a category
   */
  getCategoryVisibleCount(category: any): number {
    return category.columns.filter((col: any) =>
      this.tempColumnVisibility[col.key] ?? this.columnVisibility[col.key]
    ).length;
  }
  
  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges(): boolean {
    return Object.keys(this.tempColumnVisibility).length > 0 &&
    Object.keys(this.tempColumnVisibility).some((key: string) =>
        this.tempColumnVisibility[key] !== this.columnVisibility[key]
      );
  }

  // INITIALIZATION AND PERSISTENCE METHODS

  /**
   * Enhanced column visibility initialization
   */
  private initializeColumnVisibility() {
    this.columnVisibility = {};
    
    // Initialize all available columns as hidden by default
    this.allAvailableColumns.forEach((column: any) => {
      this.columnVisibility[column.key] = false;
    });
    
    // If initialColumnVisibility was provided, use it
    if (this.initialColumnVisibility) {
      Object.keys(this.initialColumnVisibility).forEach((key: string) => {
        this.columnVisibility[key] = this.initialColumnVisibility![key];
      });
    }
  }

  /**
   * Enhanced setup table method
   */
  private setupTable() {
    this.displayedColumns = [];
    
    if (this.config?.showSelection) {
      this.displayedColumns.push('select');
    }
    
    // Get visible columns and apply custom ordering
    const visibleColumns = this.getOrderedVisibleColumns();
    this.displayedColumns.push(...visibleColumns.map((col: any) => col.key));
    
    if (this.config?.showActions && this.actions?.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  /**
   * Get visible columns from all available columns
   */
  getVisibleColumns(): any[] {
    return this.allAvailableColumns.filter(column => this.columnVisibility[column.key]);
  }
  
  /**
   * Get visible columns in the specified order
   */
  getOrderedVisibleColumns(): any[] {
    const visibleColumns = this.getVisibleColumns();
    
    if (this.columnOrder.length === 0) {
      return visibleColumns;
    }
    
    // Sort visible columns by the custom order
    const orderedColumns = [];
    
    // First, add columns in the specified order
    for (const columnKey of this.columnOrder) {
      const column = visibleColumns.find(col => col.key === columnKey);
      if (column) {
        orderedColumns.push(column);
      }
    }
    
    // Then add any remaining visible columns that aren't in the order array
    for (const column of visibleColumns) {
      if (!this.columnOrder.includes(column.key)) {
        orderedColumns.push(column);
      }
    }
    
    return orderedColumns;
  }

  exportColumnConfiguration(): string {
    const config = {
      columnVisibility: this.columnVisibility,
      activePreset: this.activePreset,
      visibleColumns: this.getVisibleColumns().map(col => col.key),
      timestamp: Date.now(),
      version: '1.0'
    };
    return JSON.stringify(config, null, 2);
  }

  /**
   * Import column configuration (for future use)
   */
  importColumnConfiguration(configJson: string): boolean {
    try {
      const config = JSON.parse(configJson);
      if (config.columnVisibility && config.version) {
        this.columnVisibility = config.columnVisibility;
        this.activePreset = config.activePreset || 'custom';
        this.saveColumnPreferences();
        this.setupTable();
        this.columnVisibilityChange.emit(this.columnVisibility);
        return true;
      }
    } catch (error) {
      console.error('Failed to import column configuration:', error);
    }
    return false;
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

  // Enhanced status label formatting
  getStatusLabel(status: string): string {
    if (!status) return 'Unknown';
    
    const statusLabels: { [key: string]: string } = {
      'PENDING_ASSIGNMENT': 'Pending Assignment',
      'AUDIT_ASSIGNED': 'Audit Assigned',
      'AUDIT_IN_PROGRESS': 'In Progress',
      'AUDIT_COMPLETED': 'Audit Completed',
      'PASSED': 'Passed',
      'FAILED': 'Failed',
      'BACKJOB': 'Backjob'
    };
    
    return statusLabels[status] || status.replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Provision type formatting
  getProvisionTypeLabel(type: string): string {
    if (!type) return 'Not Set';
    
    const typeLabels: { [key: string]: string } = {
      'NEW_CONNECTION': 'New Connection',
      'RECONNECTION': 'Reconnection',
      'METER_CHANGE': 'Meter Change',
      'SERVICE_UPGRADE': 'Service Upgrade',
      'DISCONNECTION': 'Disconnection'
    };
    return typeLabels[type] || type;
  }

  // Quality score styling classes
  getScoreClass(score: number): string {
    if (!score) return 'score-none';
    if (score >= 90) return 'score-excellent';
    if (score >= 80) return 'score-good';
    if (score >= 70) return 'score-fair';
    return 'score-poor';
  }

  // Column count helpers for UI display
  get visibleColumnCount(): number {
    return this.getVisibleColumns().length;
  }

  get totalColumnCount(): number {
    return this.allAvailableColumns.length;
  }

  // Enhanced column visibility management
  toggleColumnVisibility(columnKey: string, visible: boolean): void {
    this.columnVisibility[columnKey] = visible;
    this.saveColumnPreferences();
    this.setupTable();
    this.columnVisibilityChange.emit(this.columnVisibility);
    
    // Mark as custom preset when manually changed
    this.activePreset = 'custom';
  }

  // Enhanced save preferences with error handling
  saveColumnPreferences(): void {
    try {
      const preferences = {
        columnVisibility: this.columnVisibility,
        activePreset: this.activePreset,
        visibleColumns: this.getVisibleColumns().map(col => col.key),
        timestamp: new Date().toISOString(),
        version: '2.0' // Updated version for enterprise config
      };
      
      localStorage.setItem('getshub-column-preferences', JSON.stringify(preferences));
      console.log('💾 Column preferences saved:', {
        visibleCount: preferences.visibleColumns.length,
        activePreset: preferences.activePreset
      });
    } catch (error) {
      console.error('❌ Failed to save column preferences:', error);
    }
  }

  // Enhanced load preferences with fallback
  loadColumnPreferences(): boolean {
    try {
      const saved = localStorage.getItem('getshub-column-preferences');
      if (!saved) return false;
      
      const preferences = JSON.parse(saved);
      console.log('📂 Loading column preferences:', preferences);
      
      // Validate that we have valid data
      if (!preferences.columnVisibility) {
        console.warn('⚠️ Invalid preferences format, using defaults');
        return false;
      }
      
      // Apply saved visibility, but only for columns that exist
      this.columnVisibility = {};
      this.allAvailableColumns.forEach((column: any) => {
        this.columnVisibility[column.key] = preferences.columnVisibility[column.key] || false;
      });
      
      // Set active preset
      this.activePreset = preferences.activePreset || 'quickview';
      
      // Load column order
      this.columnOrder = preferences.columnOrder || [];
      
      console.log('✅ Column preferences loaded successfully');
      return true;
    } catch (error) {
      console.warn('⚠️ Failed to load column preferences:', error);
      return false;
    }
  }

  // Reset to default columns
  resetColumnsToDefault(): void {
    this.applyColumnPreset('quickview');
    console.log('🔄 Columns reset to default (Quick View preset)');
  }

  // Get current preset label or detect custom
  getCurrentPresetLabel(): string {
    if (!this.config?.columns) return 'Custom';
    
    // Check if current visibility matches any preset exactly
    const currentVisible = this.getVisibleColumns().map(col => col.key).sort();
    
    for (const preset of this.columnPresets) {
      const validPresetColumns = this.filterValidColumns(preset.columns).sort();
      
      if (JSON.stringify(currentVisible) === JSON.stringify(validPresetColumns)) {
        return preset.label;
      }
    }
    
    return 'Custom';
  }

  // Method to handle view and edit actions (used in template)
  onView(row: any): void {
    this.actionClick.emit({ action: 'view', row });
  }

  onEdit(row: any): void {
    this.actionClick.emit({ action: 'edit', row });
  }
  
  // COLUMN REORDERING METHODS
  
  /**
   * Open column reordering panel
   */
  openColumnReorderPanel(): void {
    this.showColumnReorderPanel = true;
    // Initialize column order if not set
    if (this.columnOrder.length === 0) {
      this.columnOrder = this.getVisibleColumns().map(col => col.key);
    }
  }
  
  /**
   * Close column reordering panel
   */
  closeColumnReorderPanel(): void {
    this.showColumnReorderPanel = false;
  }
  
  /**
   * Handle column reordering via drag and drop
   */
  onColumnReorder(event: CdkDragDrop<any[], any[], any>): void {
    // Get the current reorderable columns
    const reorderableColumns = this.getReorderableColumns();
    
    // Initialize columnOrder if empty
    if (this.columnOrder.length === 0) {
      this.columnOrder = reorderableColumns.map(col => col.key);
    }
    
    // Perform the reorder on the columnOrder array
    moveItemInArray(this.columnOrder, event.previousIndex, event.currentIndex);
    
    // Save and update
    this.saveColumnPreferences();
    this.setupTable();
    console.log('📋 Column order updated:', this.columnOrder);
  }
  
  /**
   * Get columns in reorder panel (only visible ones)
   */
  getReorderableColumns(): any[] {
    const visibleColumns = this.getVisibleColumns();
    
    if (this.columnOrder.length === 0) {
      return visibleColumns;
    }
    
    // Return columns in the current order
    const orderedColumns = [];
    
    for (const columnKey of this.columnOrder) {
      const column = visibleColumns.find(col => col.key === columnKey);
      if (column) {
        orderedColumns.push(column);
      }
    }
    
    return orderedColumns;
  }
  
  /**
   * Reset column order to default
   */
  resetColumnOrder(): void {
    this.columnOrder = [];
    this.saveColumnPreferences();
    this.setupTable();
    console.log('🔄 Column order reset to default');
  }

}