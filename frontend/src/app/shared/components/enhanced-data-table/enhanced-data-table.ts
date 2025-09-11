import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnConfig, TableConfig, TableAction } from '../../models/data-table.interface';
import { MatTooltipModule } from '@angular/material/tooltip';  // ← ADD THIS LINE

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
    MatTooltipModule  // ← ADD THIS LINE
  ],
  templateUrl: './enhanced-data-table.html',
  styleUrls: ['./enhanced-data-table.scss']
})
export class EnhancedDataTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() totalCount = 0;

  @Output() pageChange = new EventEmitter<{page: number, pageSize: number}>();
  @Output() sortChange = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<{action: string, row: any}>();

  dataSource = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [];
  searchValue = '';

  ngOnInit() {
    this.setupTable();
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
    
    this.displayedColumns.push(...this.config.columns.map(col => col.key));
    
    if (this.config.showActions && this.actions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  onSearch(event: any) {
    this.searchValue = event.target.value;
    this.searchChange.emit(this.searchValue);
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
}