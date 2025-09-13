import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProvisionsService } from '../../../core/services/provisions.service';
import { CreateProvisionDto } from '../../models/provision';

export interface CsvImportDialogData {
  template?: 'minimal' | 'full';
}

@Component({
  selector: 'app-csv-import-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './csv-import-dialog.html',
  styleUrls: ['./csv-import-dialog.scss']
})
export class CsvImportDialogComponent {
  uploading = false;
  parsing = false;
  parsedRows: any[] = [];
  headers: string[] = [];
  mapping: { [key: string]: string } = {};
  previewColumns: string[] = [];
  errors: string[] = [];

  // Backend fields to map to (52)
  readonly backendFields: string[] = [
    'requestNumber','isManualRequestNumber','firstName','lastName','addressLine1','province','city','barangay','landmark','contactPhone','accountNumber','resource','date','prDispatch','status','activityType','verificationType','activityLane','activityGrouping','activityClassification','activityStatus','positionInRoute','marketSegment','zone','exchange','nodeLocation','cabinetLocation','modemOwnership','priority','homeServiceDevice','packageType','neType','complaintType','dateCreated','dateExtracted','startedDateTime','completionDateTime','start','end','sawa','tandemOutsideStatus','assignedAuditorId','uploadedById','auditNotes','auditPhotos','qualityScore','remarks','managerNotes','extendedData','createdAt','updatedAt'
  ];

  constructor(
    private dialogRef: MatDialogRef<CsvImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CsvImportDialogData,
    private provisionsService: ProvisionsService
  ) {}

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.parsing = true;
    this.errors = [];

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        this.parseCsv(text);
      } catch (e: any) {
        this.errors.push(e?.message || 'Failed to parse CSV');
      } finally {
        this.parsing = false;
      }
    };
    reader.readAsText(file);
  }

  private parseCsv(csvText: string) {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return;

    // Basic CSV splitting with quotes handling
    const splitCsvLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current);
      return result.map(v => v.trim());
    };

    this.headers = splitCsvLine(lines[0]);
    this.previewColumns = this.headers.slice(0, Math.min(6, this.headers.length));

    // Default mapping: try 1:1 header -> backend field, else smart guesses
    this.mapping = {};
    for (const h of this.headers) {
      const key = h.trim();
      if (this.backendFields.includes(key)) {
        this.mapping[key] = key;
      } else {
        // Smart guess mapping
        const lower = key.toLowerCase();
        const guess = this.backendFields.find(f => f.toLowerCase() === lower
          || lower.replace(/\s+/g,'') === f.toLowerCase()
          || lower.replace(/[^a-z0-9]/g,'') === f.toLowerCase().replace(/[^a-z0-9]/g,''));
        if (guess) this.mapping[key] = guess;
      }
    }

    // Parse rows
    const rows: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = splitCsvLine(lines[i]);
      if (values.length === 1 && values[0] === '') continue;
      const row: any = {};
      this.headers.forEach((h, idx) => {
        row[h] = values[idx];
      });
      rows.push(row);
    }

    this.parsedRows = rows;
  }

  setMapping(header: string, backendField: string) {
    this.mapping[header] = backendField;
  }

  import() {
    if (!this.parsedRows.length) return;

    // Build CreateProvisionDto rows using mapping
    const toDto = (src: any): CreateProvisionDto => {
      const dto: any = {};
      Object.keys(this.mapping).forEach(header => {
        const backendField = this.mapping[header];
        const raw = src[header];
        if (raw === undefined || raw === null || raw === '') return;
        // Basic type conversions for known fields
        if (['date','dateCreated','dateExtracted','startedDateTime','completionDateTime'].includes(backendField)) {
          dto[backendField] = new Date(raw).toISOString();
        } else if (['positionInRoute','qualityScore','accountNumber'].includes(backendField)) {
          const n = parseInt(raw, 10);
          if (!isNaN(n)) dto[backendField] = n;
        } else if (backendField === 'extendedData') {
          try { dto[backendField] = JSON.parse(raw); } catch { dto[backendField] = { value: raw }; }
        } else if (backendField === 'isManualRequestNumber') {
          dto[backendField] = ['true','1','yes','y'].includes(String(raw).toLowerCase());
        } else {
          dto[backendField] = raw;
        }
      });
      return dto as CreateProvisionDto;
    };

    const mappedRows = this.parsedRows.map(toDto);
    this.uploading = true;
    this.errors = [];

    this.provisionsService.importProvisions(mappedRows).subscribe({
      next: (result) => {
        this.uploading = false;
        this.dialogRef.close({ imported: true, result });
      },
      error: (err) => {
        this.uploading = false;
        this.errors.push(err?.message || 'Import failed');
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  downloadTemplate(type: 'minimal' | 'full') {
    const minimal = ['firstName','lastName','addressLine1','province','city','barangay','resource','date'];
    const headers = type === 'minimal' ? minimal : this.backendFields;
    const csv = headers.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'minimal' ? 'provisions_minimal_template.csv' : 'provisions_full_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
