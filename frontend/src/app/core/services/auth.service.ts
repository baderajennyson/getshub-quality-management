import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // Add method for role-based navigation
  redirectToDashboard(user: User): void {
    switch (user.role) {
      case 'SUPER_ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'MANAGER':
        this.router.navigate(['/manager/dashboard']);
        break;
      case 'QA_AUDITOR':
        this.router.navigate(['/auditor/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // ✅ Fixed: was removeUser, should be removeItem
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      observer.complete(); // ✅ No need for next() with Observable<void>
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}