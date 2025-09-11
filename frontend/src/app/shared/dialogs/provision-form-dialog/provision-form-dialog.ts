// src/app/shared/dialogs/provision-form-dialog/provision-form-dialog.ts

import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Provision, ProvisionType, CreateProvisionDto, UpdateProvisionDto } from '../../models/provision';

export interface ProvisionDialogData {
  provision?: Provision;
  mode: 'create' | 'edit' | 'view';
}

@Component({
  selector: 'app-provision-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './provision-form-dialog.html',
  styleUrls: ['./provision-form-dialog.scss']
})
export class ProvisionFormDialogComponent implements OnInit {
  form: FormGroup;
  isViewMode: boolean;
  isEditMode: boolean;
  provisionTypes = Object.values(ProvisionType);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProvisionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProvisionDialogData
  ) {
    this.isViewMode = data.mode === 'view';
    this.isEditMode = data.mode === 'edit';
    
    this.form = this.createForm();
  }

  ngOnInit() {
    if (this.data.provision && (this.isEditMode || this.isViewMode)) {
      this.populateForm(this.data.provision);
    }

    if (this.isViewMode) {
      this.form.disable();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      customerName: ['', [Validators.required]],
      customerAddress: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      email: ['', [Validators.email]],
      provisionType: [ProvisionType.NEW_CONNECTION, [Validators.required]],
      estimatedCost: [''],
      description: [''],
      technicalRequirements: [''],
      requestedCompletionDate: ['']
    });
  }

  private populateForm(provision: Provision) {
    this.form.patchValue({
      customerName: provision.customerName,
      customerAddress: provision.customerAddress,
      contactNumber: provision.contactNumber,
      email: provision.email,
      provisionType: provision.provisionType,
      estimatedCost: provision.estimatedCost,
      description: provision.description,
      technicalRequirements: provision.technicalRequirements,
      requestedCompletionDate: provision.requestedCompletionDate
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      if (this.isEditMode) {
        const updateData: UpdateProvisionDto = formValue;
        this.dialogRef.close({ action: 'update', data: updateData });
      } else {
        const createData: CreateProvisionDto = formValue;
        this.dialogRef.close({ action: 'create', data: createData });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'create':
        return 'Create New Provision';
      case 'edit':
        return 'Edit Provision';
      case 'view':
        return 'View Provision Details';
      default:
        return 'Provision';
    }
  }
  // ADD THIS METHOD HERE - Make sure it's inside the class but before the closing brace
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

}