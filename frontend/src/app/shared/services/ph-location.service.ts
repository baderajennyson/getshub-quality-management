import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface ProvinceOption {
  code: string;
  name: string;
}

export interface CityOption {
  code: string;
  name: string;
}

export interface BarangayOption {
  code: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class PhLocationService {
  private readonly baseUrl = 'assets/psgc';

  private provincesCache$?: Observable<ProvinceOption[]>;
  private citiesCache = new Map<string, Observable<CityOption[]>>();
  private barangaysCache = new Map<string, Observable<BarangayOption[]>>();

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<ProvinceOption[]> {
    if (!this.provincesCache$) {
      this.provincesCache$ = this.http
        .get<any[]>(`${this.baseUrl}/provinces-full.json`)
        .pipe(
          map(items => items
            .map(item => ({ code: item.code, name: item.name }))
            .sort((a, b) => a.name.localeCompare(b.name))
          ),
          shareReplay(1)
        );
    }
    return this.provincesCache$;
  }

  getCitiesByProvince(provinceCode: string): Observable<CityOption[]> {
    if (!provinceCode) return of([]);

    if (!this.citiesCache.has(provinceCode)) {
      const stream$ = this.http
        .get<any[]>(`${this.baseUrl}/cities-municipalities-full.json`)
        .pipe(
          map(items => items
            .filter(item => item.provinceCode === provinceCode)
            .map(item => ({ code: item.code, name: item.name }))
            .sort((a, b) => a.name.localeCompare(b.name))
          ),
          shareReplay(1)
        );
      this.citiesCache.set(provinceCode, stream$);
    }

    return this.citiesCache.get(provinceCode)!;
  }

  getBarangaysByCity(cityCode: string): Observable<BarangayOption[]> {
    if (!cityCode) return of([]);

    if (!this.barangaysCache.has(cityCode)) {
      const stream$ = this.http
        .get<any[]>(`${this.baseUrl}/barangays-full.json`)
        .pipe(
          map(items => items
            .filter(item => item.cityCode === cityCode)
            .map(item => ({ code: item.code, name: item.name }))
            .sort((a, b) => a.name.localeCompare(b.name))
          ),
          shareReplay(1)
        );
      this.barangaysCache.set(cityCode, stream$);
    }

    return this.barangaysCache.get(cityCode)!;
  }
}
