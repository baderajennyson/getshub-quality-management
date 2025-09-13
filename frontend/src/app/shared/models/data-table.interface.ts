// src/app/shared/models/data-table.interface.ts

export interface ColumnConfig {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  visible?: boolean; // NEW: Added visible property
  width?: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'actions' | 'boolean' | 'currency' | 'score'; // NEW: Added currency and score types
  formatter?: (value: any) => string;
  tooltip?: string;
  align?: 'left' | 'center' | 'right';
  sticky?: boolean;
  resizable?: boolean;
}

export interface TableConfig {
  columns: ColumnConfig[];
  showSelection?: boolean;
  showActions?: boolean;
  showPagination?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  showColumnControls?: boolean;
  enableColumnManagement?: boolean; // NEW: Added column management flag
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  density?: 'compact' | 'standard' | 'comfortable';
  stickyHeader?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  emptyStateText?: string;
  emptyStateIcon?: string;
  loadingText?: string;
  enableExport?: boolean;
  enableImport?: boolean;
  enableBulkActions?: boolean;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn' | 'basic';
  disabled?: (row: any) => boolean;
  visible?: (row: any) => boolean;
  action: (row: any) => void;
  tooltip?: string;
}

export interface ColumnVisibility {
  [columnKey: string]: boolean;
}

export interface TableSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TableFilter {
  column: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
}

export interface TableState {
  sort?: TableSort;
  filters?: TableFilter[];
  columnVisibility?: ColumnVisibility;
  pageSize?: number;
  currentPage?: number;
}

// NEW: Enterprise column management interfaces
export interface ColumnPreset {
  key: string;
  label: string;
  columns: string[];
  description?: string;
  icon?: string;
}

export interface ColumnCategory {
  name: string;
  description: string;
  icon: string;
  columns: ColumnDefinition[];
  collapsed?: boolean;
}

export interface ColumnDefinition {
  key: string;
  label: string;
  description: string;
  type?: string;
  required?: boolean;
}

// Export types for backward compatibility
export type DataTableColumn = ColumnConfig;
export type DataTableConfig = TableConfig;
export type DataTableAction = TableAction;