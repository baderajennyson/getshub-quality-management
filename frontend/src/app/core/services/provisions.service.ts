// frontend/src/app/core/services/provisions.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Provision {
  id: string;
  requestNumber: string;
  customerName: string;
  customerAddress: string;
  contactNumber: string;
  email?: string;
  provisionType: 'NEW_CONNECTION' | 'RECONNECTION' | 'METER_CHANGE' | 'SERVICE_UPGRADE' | 'DISCONNECTION';
  status: 'PENDING_ASSIGNMENT' | 'AUDIT_ASSIGNED' | 'AUDIT_IN_PROGRESS' | 'AUDIT_COMPLETED' | 'PASSED' | 'FAILED' | 'BACKJOB';
  estimatedCost?: number;
  description?: string;
  technicalRequirements?: string;
  requestedCompletionDate?: string;
  actualCompletionDate?: string;
  assignedAuditorId?: string;
  assignedAuditor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  uploadedById: string;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  auditNotes?: string;
  auditPhotos?: string;
  qualityScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProvisionDto {
  customerName: string;
  customerAddress: string;
  contactNumber: string;
  email?: string;
  provisionType: Provision['provisionType'];
  estimatedCost?: number;
  description?: string;
  technicalRequirements?: string;
  requestedCompletionDate?: string;
}

export interface UpdateProvisionDto {
  customerName?: string;
  customerAddress?: string;
  contactNumber?: string;
  email?: string;
  provisionType?: Provision['provisionType'];
  status?: Provision['status'];
  estimatedCost?: number;
  description?: string;
  technicalRequirements?: string;
  requestedCompletionDate?: string;
  actualCompletionDate?: string;
  assignedAuditorId?: string;
  auditNotes?: string;
  auditPhotos?: string;
  qualityScore?: number;
}

export interface ProvisionsResponse {
  provisions: Provision[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProvisionsStatistics {
  total: number;
  pendingAssignment: number;
  auditAssigned: number;
  passed: number;
  failed: number;
  backjobs: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProvisionsService {
  private apiUrl = `${environment.apiUrl}/provisions`;

  constructor(private http: HttpClient) {}

  // Get all provisions with pagination and filtering
  getProvisions(
    page: number = 1,
    limit: number = 10,
    status?: Provision['status'],
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<ProvisionsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }

    if (search) {
      params = params.set('search', search);
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }

    return this.http.get<ProvisionsResponse>(this.apiUrl, { params });
  }

  // Get single provision by ID
  getProvision(id: string): Observable<Provision> {
    return this.http.get<Provision>(`${this.apiUrl}/${id}`);
  }

  // Create new provision
  createProvision(provision: CreateProvisionDto): Observable<Provision> {
    return this.http.post<Provision>(this.apiUrl, provision);
  }

  // Update provision
  updateProvision(id: string, provision: UpdateProvisionDto): Observable<Provision> {
    return this.http.patch<Provision>(`${this.apiUrl}/${id}`, provision);
  }

  // Delete provision
  deleteProvision(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Bulk update provisions
  bulkUpdateProvisions(ids: string[], updates: UpdateProvisionDto): Observable<Provision[]> {
    return this.http.patch<Provision[]>(`${this.apiUrl}/bulk`, {
      ids,
      updates
    });
  }

  // Bulk delete provisions
  bulkDeleteProvisions(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bulk`, {
      body: { ids }
    });
  }

  // Assign auditor to provisions
  assignAuditor(provisionIds: string[], auditorId: string): Observable<Provision[]> {
    return this.http.patch<Provision[]>(`${this.apiUrl}/assign-auditor`, {
      provisionIds,
      auditorId
    });
  }

  // Get provisions statistics
  getStatistics(): Observable<ProvisionsStatistics> {
    return this.http.get<ProvisionsStatistics>(`${this.apiUrl}/statistics`);
  }

  // Upload provisions from Excel/CSV
  uploadProvisions(file: File): Observable<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{
      success: number;
      failed: number;
      errors: string[];
    }>(`${this.apiUrl}/upload`, formData);
  }

  // Export provisions to Excel
  exportProvisions(
    filters?: any,
    format: 'csv' | 'excel' = 'excel'
  ): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key].toString());
        }
      });
    }

    params = params.set('format', format);

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  // Get available QA auditors for assignment
  getAvailableAuditors(): Observable<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    assignedCount: number;
  }[]> {
    return this.http.get<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      assignedCount: number;
    }[]>(`${this.apiUrl}/available-auditors`);
  }
}