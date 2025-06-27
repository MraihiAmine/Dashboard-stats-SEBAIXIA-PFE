import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap, catchError, switchMap } from 'rxjs/operators';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/user.interface';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public users$ = this.usersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private userApiService: UserApiService) {
    // Initial load of users
    this.loadUsers();
  }

  // Get all users
  getUsers(): Observable<User[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    
    return this.userApiService.getUsers().pipe(
      tap(users => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to load users');
        return throwError(() => error);
      })
    );
  }

  // Get user by ID
  getUserById(id: number): Observable<User | undefined> {
    return this.userApiService.getUserById(id).pipe(
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to load user');
        return throwError(() => error);
      })
    );
  }

  // Create new user
  createUser(userData: CreateUserRequest): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.userApiService.createUser(userData).pipe(
      tap(newUser => {
        // Add the new user to the current list
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to create user');
        return throwError(() => error);
      })
    );
  }

  // Update user
  updateUser(updateData: UpdateUserRequest): Observable<User> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Find the current user to fill in missing fields
    const currentUser = this.usersSubject.value.find(user => user.id === updateData.id);
    if (!currentUser) {
      const error = new Error('User not found');
      this.loadingSubject.next(false);
      this.errorSubject.next(error.message);
      return throwError(() => error);
    }

    // Merge current user with updateData, ensuring no undefined fields
    const fullUser: Omit<User, 'id'> = {
      name: updateData.name ?? currentUser.name,
      email: updateData.email ?? currentUser.email,
      role: updateData.role ?? currentUser.role,
      status: updateData.status ?? currentUser.status,
      createdAt: currentUser.createdAt,
      lastLogin: currentUser.lastLogin
    };

    return this.userApiService.updateUser(updateData.id, fullUser).pipe(
      tap(updatedUser => {
        // Update the user in the current list
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.map(user => 
          user.id === updateData.id ? updatedUser : user
        );
        this.usersSubject.next(updatedUsers);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to update user');
        return throwError(() => error);
      })
    );
  }

  // Delete user
  deleteUser(id: number): Observable<boolean> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.userApiService.deleteUser(id).pipe(
      switchMap(() => {
        // Remove the user from the current list
        const currentUsers = this.usersSubject.value;
        const filteredUsers = currentUsers.filter(user => user.id !== id);
        this.usersSubject.next(filteredUsers);
        this.loadingSubject.next(false);
        return of(true);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Failed to delete user');
        return throwError(() => error);
      })
    );
  }

  // Search users
  searchUsers(query: string): Observable<User[]> {
    if (!query.trim()) {
      return this.getUsers();
    }

    return this.userApiService.searchUsers(query).pipe(
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to search users');
        return throwError(() => error);
      })
    );
  }

  // Get users by status
  getUsersByStatus(status: User['status']): Observable<User[]> {
    return this.userApiService.getUsersByStatus(status).pipe(
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to filter users by status');
        return throwError(() => error);
      })
    );
  }

  // Get users by role
  getUsersByRole(role: User['role']): Observable<User[]> {
    return this.userApiService.getUsersByRole(role).pipe(
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to filter users by role');
        return throwError(() => error);
      })
    );
  }

  // Get statistics
  getUserStatistics(): Observable<{ total: number; active: number; inactive: number; pending: number }> {
    return this.userApiService.getUserStatistics().pipe(
      catchError(error => {
        this.errorSubject.next(error.message || 'Failed to load user statistics');
        return throwError(() => error);
      })
    );
  }

  // Get user role distribution
  getUserRoleDistribution(): Observable<{ [role: string]: number }> {
    return this.userApiService.getUserRoleDistribution();
  }

  // Load users (private method for initial load)
  private loadUsers(): void {
    this.getUsers().subscribe();
  }

  // Clear error
  clearError(): void {
    this.errorSubject.next(null);
  }

  // Refresh users
  refreshUsers(): void {
    this.loadUsers();
  }

  // Test API connection
  testConnection(): Observable<string> {
    return this.userApiService.testConnection();
  }

  // Get recent logins
  getRecentLogins(limit: number = 5): Observable<User[]> {
    return this.userApiService.getRecentLogins(limit);
  }

  // Get recent registrations
  getRecentRegistrations(limit: number = 5): Observable<User[]> {
    return this.userApiService.getRecentRegistrations(limit);
  }
} 