// src/app/shared/models/data-table.interface.ts

export interface ColumnConfig {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'status' | 'actions' | 'boolean';
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
    sticky?: boolean;
    formatter?: (value: any) => string;
    cellTemplate?: string;
  }
  
  export interface TableConfig {
    columns: ColumnConfig[];
    pageSize?: number;
    pageSizeOptions?: number[];
    showPagination?: boolean;
    showSearch?: boolean;
    showFilters?: boolean;
    showSelection?: boolean;
    showActions?: boolean;
    striped?: boolean;
    bordered?: boolean;
    hoverable?: boolean;
    density?: 'compact' | 'standard' | 'comfortable';
    emptyStateText?: string;
    emptyStateIcon?: string;
    loadingText?: string;
  }
  
  export interface TableAction {
    label: string;
    icon?: string;
    color?: 'primary' | 'accent' | 'warn';
    disabled?: (row: any) => boolean;
    visible?: (row: any) => boolean;
    action: (row: any) => void;
  }