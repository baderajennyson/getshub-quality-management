// src/app/core/services/provisions.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Provision, 
  CreateProvisionDto, 
  UpdateProvisionDto,
  ProvisionStatus,
  ProvisionType 
} from '../../shared/models/provision';

// Service-specific response interfaces
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

  // Fixed method signature
  getProvisions(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: ProvisionStatus,
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

  // Get provisions statistics
  getStatistics(): Observable<ProvisionsStatistics> {
    return this.http.get<ProvisionsStatistics>(`${this.apiUrl}/statistics`);
  }

  // Export provisions
  exportProvisions(filters?: any, format: 'csv' | 'excel' = 'excel'): Observable<Blob> {
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
}