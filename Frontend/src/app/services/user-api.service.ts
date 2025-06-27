import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../types/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private apiUrl = 'http://localhost:8080/api/dashboard-users';

  constructor(private http: HttpClient) { }

  // Test API connection
  testConnection(): Observable<string> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/test`).pipe(
      map(response => response.message)
    );
  }

  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => users.map(user => this.mapToUser(user))),
      catchError(this.handleError)
    );
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(user => this.mapToUser(user)),
      catchError(this.handleError)
    );
  }

  // Create new user
  createUser(user: Omit<User, 'id'>): Observable<User> {
    const userData = this.mapToApiUser(user);
    return this.http.post<any>(this.apiUrl, userData).pipe(
      map(user => this.mapToUser(user)),
      catchError(this.handleError)
    );
  }

  // Update user
  updateUser(id: number, user: Omit<User, 'id'>): Observable<User> {
    const userData = this.mapToApiUser(user);
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData).pipe(
      map(user => this.mapToUser(user)),
      catchError(this.handleError)
    );
  }

  // Delete user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Search users
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`).pipe(
      map(users => users.map(user => this.mapToUser(user))),
      catchError(this.handleError)
    );
  }

  // Get users by role
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/role/${role}`).pipe(
      map(users => users.map(user => this.mapToUser(user))),
      catchError(this.handleError)
    );
  }

  // Get users by status
  getUsersByStatus(status: string): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status/${status}`).pipe(
      map(users => users.map(user => this.mapToUser(user))),
      catchError(this.handleError)
    );
  }

  // Get user statistics
  getUserStatistics(): Observable<{ total: number; active: number; inactive: number; pending: number }> {
    return this.http.get<any>(`${this.apiUrl}/statistics`).pipe(
      catchError(this.handleError)
    );
  }

  // Update last login
  updateLastLogin(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/last-login`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Get inactive users
  getInactiveUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inactive`).pipe(
      map(users => users.map(user => this.mapToUser(user))),
      catchError(this.handleError)
    );
  }

  // Get recently created users
  getRecentlyCreatedUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent`).pipe(
      map(users => users.map(user => this.mapToUser(user))),
      catchError(this.handleError)
    );
  }

  // Get user role distribution
  getUserRoleDistribution(): Observable<{ [role: string]: number }> {
    return this.http.get<{ [role: string]: number }>(`${this.apiUrl}/role-distribution`).pipe(
      catchError(this.handleError)
    );
  }

  // Get recent logins
  getRecentLogins(limit: number = 5): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent-logins`).pipe(
      map(users => users.map(user => this.mapToUser(user))),
      catchError(this.handleError)
    );
  }

  // Get recent registrations
  getRecentRegistrations(limit: number = 5): Observable<User[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent-registrations`).pipe(
      map(users => users.map(user => this.mapToUser(user))),
      catchError(this.handleError)
    );
  }

  // Map API user to frontend user
  private mapToUser(apiUser: any): User {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: this.mapRoleFromApi(apiUser.role),
      status: this.mapStatusFromApi(apiUser.status),
      createdAt: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date(),
      lastLogin: apiUser.lastLogin ? new Date(apiUser.lastLogin) : null
    };
  }

  // Map frontend user to API user
  private mapToApiUser(user: Omit<User, 'id'>): any {
    return {
      name: user.name,
      email: user.email,
      role: this.mapRoleToApi(user.role),
      status: this.mapStatusToApi(user.status)
    };
  }

  // Map role from API to frontend
  private mapRoleFromApi(apiRole: string): 'Admin' | 'User' | 'Viewer' {
    switch (apiRole?.toUpperCase()) {
      case 'ADMIN': return 'Admin';
      case 'USER': return 'User';
      case 'VIEWER': return 'Viewer';
      default: return 'User';
    }
  }

  // Map role from frontend to API
  private mapRoleToApi(role: 'Admin' | 'User' | 'Viewer'): string {
    switch (role) {
      case 'Admin': return 'ADMIN';
      case 'User': return 'USER';
      case 'Viewer': return 'VIEWER';
      default: return 'USER';
    }
  }

  // Map status from API to frontend
  private mapStatusFromApi(apiStatus: string): 'Active' | 'Inactive' | 'Pending' {
    switch (apiStatus?.toUpperCase()) {
      case 'ACTIVE': return 'Active';
      case 'INACTIVE': return 'Inactive';
      case 'PENDING': return 'Pending';
      default: return 'Active';
    }
  }

  // Map status from frontend to API
  private mapStatusToApi(status: 'Active' | 'Inactive' | 'Pending'): string {
    switch (status) {
      case 'Active': return 'ACTIVE';
      case 'Inactive': return 'INACTIVE';
      case 'Pending': return 'PENDING';
      default: return 'ACTIVE';
    }
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'API Connection Failed: Server error: 0';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden. You do not have permission to access this resource.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 409) {
        errorMessage = error.error?.error || 'Conflict. Resource already exists.';
      } else if (error.status >= 500) {
        errorMessage = `Server error: ${error.status}`;
      } else {
        errorMessage = error.error?.error || `HTTP error: ${error.status}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 