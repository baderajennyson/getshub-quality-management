// src/app/core/services/provisions.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Provision, 
  CreateProvisionDto, 
  UpdateProvisionDto,
  ProvisionStatus,
  ProvisionType,
  ActivityType,
  MarketSegment,
  NEType,
  PRDispatch,
  mapOldToNewProvision,
  mapNewToOldProvision
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
  auditInProgress?: number;
  auditCompleted?: number;
  passed: number;
  failed: number;
  backjobs: number;
  completed?: number;
  cancelled?: number;
  suspended?: number;
}

export interface ProvisionFilters {
  search?: string;
  status?: ProvisionStatus;
  activityType?: ActivityType;
  marketSegment?: MarketSegment;
  neType?: NEType;
  prDispatch?: PRDispatch;
  province?: string;
  city?: string;
  zone?: string;
  assignedAuditorId?: string;
  dateFrom?: string;
  dateTo?: string;
  qualityScoreMin?: number;
  qualityScoreMax?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProvisionsService {
  private apiUrl = `${environment.apiUrl}/provisions`;

  constructor(private http: HttpClient) {}

  // Get provisions with comprehensive filtering
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

    return this.http.get<ProvisionsResponse>(this.apiUrl, { params }).pipe(
      map(response => ({
        ...response,
        // Map backend data to frontend-compatible format
        provisions: response.provisions.map(mapNewToOldProvision)
      }))
    );
  }

  // Get single provision by ID
  getProvision(id: string): Observable<Provision> {
    return this.http.get<Provision>(`${this.apiUrl}/${id}`).pipe(
      map(mapNewToOldProvision)
    );
  }

  // Create new provision
  createProvision(provision: CreateProvisionDto): Observable<Provision> {
    // Map old field names to new ones before sending to backend
    const mappedProvision = mapOldToNewProvision(provision);
    return this.http.post<Provision>(this.apiUrl, mappedProvision).pipe(
      map(mapNewToOldProvision)
    );
  }

  // Update provision
  updateProvision(id: string, provision: UpdateProvisionDto): Observable<Provision> {
    // Map old field names to new ones before sending to backend
    const mappedProvision = mapOldToNewProvision(provision);
    return this.http.patch<Provision>(`${this.apiUrl}/${id}`, mappedProvision).pipe(
      map(mapNewToOldProvision)
    );
  }

  // Delete provision
  deleteProvision(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get provisions statistics
  getStatistics(): Observable<ProvisionsStatistics> {
    return this.http.get<ProvisionsStatistics>(`${this.apiUrl}/statistics`);
  }

  // Export provisions as CSV only (as requested)
  exportProvisions(filters?: any): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key].toString());
        }
      });
    }

    // No format parameter needed - backend only exports CSV now
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  // Import provisions (bulk)
  importProvisions(rows: CreateProvisionDto[]): Observable<{ successful: number; failed: number; errors: string[]; }> {
    const mapped = rows.map(mapOldToNewProvision);
    return this.http.post<{ successful: number; failed: number; errors: string[]; }>(`${this.apiUrl}/import`, mapped);
  }

  // Search provisions
  searchProvisions(searchTerm: string, limit: number = 10): Observable<Provision[]> {
    let params = new HttpParams()
      .set('search', searchTerm)
      .set('limit', limit.toString());

    return this.http.get<Provision[]>(`${this.apiUrl}/search`, { params }).pipe(
      map(provisions => provisions.map(mapNewToOldProvision))
    );
  }
}