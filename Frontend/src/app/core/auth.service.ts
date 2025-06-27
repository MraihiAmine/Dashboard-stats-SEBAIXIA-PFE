import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<any>(this.getUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    console.log('Login request payload:', { email, password: '***' });
    console.log('Login request URL:', `${environment.apiUrl}/api/auth/login`);
    
    return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, loginData)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          if (!response || !response.token) {
            console.error('Invalid login response:', response);
            throw new Error('Invalid login response from server');
          }
          this.setToken(response.token);
          // Create a minimal user object from the email
          const user = { email };
          this.setUser(user);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Login error details:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message
          });
          
          let errorMessage = 'An error occurred during login';
          
          if (error.status === 0) {
            errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
          } else if (error.status === 401) {
            errorMessage = 'Invalid email or password';
          } else if (error.status === 403) {
            errorMessage = 'Access denied';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          console.error('Final error message:', errorMessage);
          return throwError(() => ({ message: errorMessage }));
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    console.log('Sending registration request to:', `${environment.apiUrl}/api/auth/register`);
    const registerRequest = {
      username: username,
      email: email,
      password: password
    };
    
    console.log('Registration request payload:', {
      ...registerRequest,
      password: '***' // Hide password in logs
    });
    
    return this.http.post<any>(`${environment.apiUrl}/api/auth/register`, registerRequest)
      .pipe(
        tap(response => {
          console.log('Registration response:', response);
          if (response && response.token) {
            this.setToken(response.token);
            const user = { email, username };
            this.setUser(user);
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(user);
          } else {
            console.error('Invalid registration response:', response);
            throw new Error('Invalid registration response from server');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Registration error details:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            message: error.message,
            url: error.url
          });
          
          let errorMessage = 'An error occurred during registration';
          
          if (error.status === 0) {
            errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
          } else if (error.error && error.error.error) {
            errorMessage = error.error.error;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.status === 409) {
            errorMessage = 'Email or username already exists';
          } else if (error.status === 400) {
            if (error.error && typeof error.error === 'object') {
              const validationErrors = Object.values(error.error)
                .filter(value => typeof value === 'string')
                .join(', ');
              errorMessage = validationErrors || 'Invalid registration data';
            } else {
              errorMessage = 'Invalid registration data';
            }
          }
          
          console.error('Final error message:', errorMessage);
          return throwError(() => ({ message: errorMessage }));
        })
      );
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private getUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  handleGoogleAuth(googleUser: any): Observable<any> {
    console.log('Handling Google authentication');
    const { email, name } = googleUser;
    
    return this.http.post<any>(`${environment.apiUrl}/api/auth/google`, {
      email,
      username: name || email.split('@')[0]
    }).pipe(
      tap(response => {
        console.log('Google auth response:', response);
        if (response && response.token) {
          this.setToken(response.token);
          const user = { email, username: name || email.split('@')[0] };
          this.setUser(user);
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
        } else {
          console.error('Invalid Google auth response:', response);
          throw new Error('Invalid Google authentication response');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Google auth error:', error);
        let errorMessage = 'An error occurred during Google authentication';
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }
}

