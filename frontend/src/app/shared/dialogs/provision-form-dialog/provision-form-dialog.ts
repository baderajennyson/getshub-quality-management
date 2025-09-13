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

import { Provision, ProvisionStatus, ActivityType, MarketSegment, NEType, PRDispatch, CreateProvisionDto, UpdateProvisionDto } from '../../models/provision';
import { PhLocationService, ProvinceOption, CityOption, BarangayOption } from '../../services/ph-location.service';

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
  isCreateMode: boolean;
  activityTypes = Object.values(ActivityType);
  marketSegments = Object.values(MarketSegment);
  neTypes = Object.values(NEType);
  prDispatches = Object.values(PRDispatch);

  provinces: ProvinceOption[] = [];
  cities: CityOption[] = [];
  barangays: BarangayOption[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProvisionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProvisionDialogData,
    private phLocationService: PhLocationService
  ) {
    this.isViewMode = data.mode === 'view';
    this.isEditMode = data.mode === 'edit';
    this.isCreateMode = data.mode === 'create';
    
    // Debug logging
    console.log('🔧 Dialog initialized with:', {
      mode: data.mode,
      hasProvision: !!data.provision,
      provisionId: data.provision?.id
    });

    this.form = this.createForm();
  }

  ngOnInit() {
    // Load PH provinces on init
    this.phLocationService.getProvinces().subscribe(list => this.provinces = list);

    // Cascading changes
    this.form.get('province')?.valueChanges.subscribe((provinceCode: string) => {
      this.form.get('city')?.reset('');
      this.form.get('barangay')?.reset('');
      this.cities = [];
      this.barangays = [];
      if (provinceCode) {
        this.phLocationService.getCitiesByProvince(provinceCode).subscribe(list => this.cities = list);
      }
    });

    this.form.get('city')?.valueChanges.subscribe((cityCode: string) => {
      this.form.get('barangay')?.reset('');
      this.barangays = [];
      if (cityCode) {
        this.phLocationService.getBarangaysByCity(cityCode).subscribe(list => this.barangays = list);
      }
    });

    if (this.data.provision && (this.isEditMode || this.isViewMode)) {
      console.log('📋 Populating form with provision data:', this.data.provision);
      this.populateForm(this.data.provision);
    }

    if (this.isViewMode) {
      this.form.disable();
      console.log('🔒 Form disabled for view mode');
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Identification
      requestNumber: [''],
      isManualRequestNumber: [false],

      // Customer Info (required)
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      addressLine1: ['', [Validators.required, Validators.minLength(5)]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      barangay: ['', [Validators.required]],
      landmark: [''],
      contactPhone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
      accountNumber: [''],

      // Dispatch & Activity
      resource: ['', [Validators.required]],
      date: [null, [Validators.required]],
      prDispatch: [''],
      status: [ProvisionStatus.PENDING_ASSIGNMENT],
      activityType: [''],
      verificationType: [''],
      activityLane: [''],
      activityGrouping: [''],
      activityClassification: [''],
      activityStatus: [''],
      positionInRoute: [''],

      // Service Info
      marketSegment: [''],
      zone: [''],
      exchange: [''],
      nodeLocation: [''],
      cabinetLocation: [''],
      modemOwnership: [''],
      priority: [''],
      homeServiceDevice: [''],
      packageType: [''],
      neType: [''],
      complaintType: [''],

      // Timing
      dateCreated: [null],
      dateExtracted: [null],
      startedDateTime: [null],
      completionDateTime: [null],
      start: [''],
      end: [''],
      sawa: [''],
      tandemOutsideStatus: [''],

      // Remarks & Quality
      assignedAuditorId: [''],
      auditNotes: [''],
      auditPhotos: [''],
      qualityScore: [''],
      remarks: [''],
      managerNotes: [''],

      // Extended
      extendedData: ['']
    });
  }

  private populateForm(provision: Provision) {
    try {
      // Map incoming provision to aligned backend fields
      const formData: any = {
        requestNumber: provision.requestNumber || '',
        isManualRequestNumber: provision.isManualRequestNumber || false,
        firstName: provision.firstName || (provision.customerName ? provision.customerName.split(' ')[0] : ''),
        lastName: provision.lastName || (provision.customerName ? provision.customerName.split(' ').slice(1).join(' ') : ''),
        addressLine1: provision.addressLine1 || provision.customerAddress || '',
        province: provision.province || '',
        city: provision.city || '',
        barangay: provision.barangay || '',
        landmark: provision.landmark || '',
        contactPhone: provision.contactPhone || provision.contactNumber || '',
        accountNumber: provision.accountNumber || '',
        resource: provision.resource || '',
        date: provision.date ? new Date(provision.date as any) : null,
        prDispatch: provision.prDispatch || '',
        status: provision.status || ProvisionStatus.PENDING_ASSIGNMENT,
        activityType: provision.activityType || '',
        verificationType: provision.verificationType || '',
        activityLane: provision.activityLane || '',
        activityGrouping: provision.activityGrouping || '',
        activityClassification: provision.activityClassification || '',
        activityStatus: provision.activityStatus || '',
        positionInRoute: provision.positionInRoute || '',
        marketSegment: provision.marketSegment || '',
        zone: provision.zone || '',
        exchange: provision.exchange || '',
        nodeLocation: provision.nodeLocation || '',
        cabinetLocation: provision.cabinetLocation || '',
        modemOwnership: provision.modemOwnership || '',
        priority: provision.priority || '',
        homeServiceDevice: provision.homeServiceDevice || '',
        packageType: provision.packageType || '',
        neType: provision.neType || '',
        complaintType: provision.complaintType || '',
        dateCreated: provision.dateCreated ? new Date(provision.dateCreated as any) : null,
        dateExtracted: provision.dateExtracted ? new Date(provision.dateExtracted as any) : null,
        startedDateTime: provision.startedDateTime ? new Date(provision.startedDateTime as any) : null,
        completionDateTime: provision.completionDateTime ? new Date(provision.completionDateTime as any) : null,
        start: provision.start || '',
        end: provision.end || '',
        sawa: provision.sawa || '',
        tandemOutsideStatus: provision.tandemOutsideStatus || '',
        assignedAuditorId: provision.assignedAuditorId || '',
        auditNotes: provision.auditNotes || '',
        auditPhotos: provision.auditPhotos || '',
        qualityScore: provision.qualityScore || '',
        remarks: provision.remarks || '',
        managerNotes: provision.managerNotes || '',
        extendedData: provision.extendedData ? JSON.stringify(provision.extendedData) : ''
      };

      console.log('📝 Populating form with data:', formData);
      this.form.patchValue(formData);

      // Load dependent location lists if editing
      // When editing, attempt to resolve PSGC codes from saved names
      if (formData.province) {
        const provinceMatch = this.provinces.find(p => p.name === formData.province);
        const provinceCode = provinceMatch ? provinceMatch.code : formData.province;
        this.form.patchValue({ province: provinceCode });
        this.phLocationService.getCitiesByProvince(provinceCode).subscribe(list => {
          this.cities = list;
          if (formData.city) {
            const cityMatch = list.find(c => c.name === formData.city);
            const cityCode = cityMatch ? cityMatch.code : formData.city;
            this.form.patchValue({ city: cityCode });
            this.phLocationService.getBarangaysByCity(cityCode).subscribe(bList => {
              this.barangays = bList;
              if (formData.barangay) {
                const bMatch = bList.find(b => b.name === formData.barangay);
                const bCode = bMatch ? bMatch.code : formData.barangay;
                this.form.patchValue({ barangay: bCode });
              }
            });
          }
        });
      }

      // Log current form values after population
      console.log('✅ Form populated. Current values:', this.form.value);
      
    } catch (error) {
      console.error('❌ Error populating form:', error);
      console.error('❌ Provision data that caused error:', provision);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      console.log('🚀 Submitting form:', formValue);
      
      // Clean the data before sending
      const cleanedData = this.cleanFormData(formValue);
      
      if (this.isEditMode) {
        const updateData: UpdateProvisionDto = cleanedData;
        console.log('📤 Sending update data:', updateData);
        this.dialogRef.close({ action: 'update', data: updateData });
      } else if (this.isCreateMode) {
        const createData: CreateProvisionDto = cleanedData;
        console.log('📤 Sending create data:', createData);
        this.dialogRef.close({ action: 'create', data: createData });
      }
    } else {
      console.warn('⚠️ Form is invalid:', this.form.errors);
      this.logFormErrors();
    }
  }

  private cleanFormData(formValue: any): any {
    // Remove null/empty values and format data properly
    const cleaned: any = {};
    
    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined && value !== '') {
        if ((key === 'date' || key === 'dateCreated' || key === 'dateExtracted' || key === 'startedDateTime' || key === 'completionDateTime') && value instanceof Date) {
          cleaned[key] = value.toISOString();
        } else if ((key === 'positionInRoute' || key === 'qualityScore' || key === 'accountNumber') && typeof value === 'string') {
          const parsed = parseInt(value, 10);
          if (!isNaN(parsed)) cleaned[key] = parsed;
        } else if (key === 'extendedData' && typeof value === 'string') {
          try { cleaned[key] = JSON.parse(value); } catch { cleaned[key] = {}; }
        } else if (key === 'province') {
          // Convert province code to name
          const p = this.provinces.find(pr => pr.code === value);
          cleaned[key] = p ? p.name : value;
        } else if (key === 'city') {
          const c = this.cities.find(ci => ci.code === value);
          cleaned[key] = c ? c.name : value;
        } else if (key === 'barangay') {
          const b = this.barangays.find(br => br.code === value);
          cleaned[key] = b ? b.name : value;
        } else {
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  }

  private logFormErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && control.errors) {
        console.warn(`⚠️ Field '${key}' has errors:`, control.errors);
      }
    });
  }

  onCancel() {
    console.log('❌ Dialog cancelled');
    this.dialogRef.close();
  }

  getTitle(): string {
    switch (this.data.mode) {
      case 'create':
        return 'Create Provision';
      case 'edit':
        return 'Edit Provision';
      case 'view':
        return 'View Provision Details';
      default:
        return 'Provision';
    }
  }

  // Utility methods for debugging (remove these in production)
  debugFormData() {
    console.log('🔍 Debug - Form Data:', {
      formValue: this.form.value,
      formValid: this.form.valid,
      formErrors: this.form.errors,
      provisionData: this.data.provision
    });
  }

  debugProvisionData() {
    if (this.data.provision) {
      console.log('🔍 Debug - Provision Keys:', Object.keys(this.data.provision));
      console.log('🔍 Debug - Provision Data:', this.data.provision);
    }
  }
}