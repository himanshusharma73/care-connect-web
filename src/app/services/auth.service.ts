import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    
     if (email === 'admin@gmail.com' && password === 'admin') {
      return of({ token: 'fake-jwt-token', user: { email } }).pipe(
        delay(1000),
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isAuthenticatedSubject.next(true);
        })
      );
    }
    
    return throwError(() => new Error('Invalid credentials'));
    
    // Uncomment for actual API implementation
    // return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
    //   .pipe(
    //     tap(response => {
    //       localStorage.setItem('token', response.token);
    //       localStorage.setItem('user', JSON.stringify(response.user));
    //       this.isAuthenticatedSubject.next(true);
    //     })
    //   );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}