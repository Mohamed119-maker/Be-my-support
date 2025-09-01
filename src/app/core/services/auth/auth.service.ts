import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { IUserinfo } from '../../../shared/interfaces/iuserinfo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  goForgetPass: WritableSignal<boolean> = signal(false);
  isLogin: WritableSignal<boolean> = signal(false);
  userName: WritableSignal<string> = signal('');
  userInfo = signal<IUserinfo>({} as IUserinfo);
  role: WritableSignal<string> = signal('');

  constructor(private httpClient: HttpClient) { }

  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/user/signup`, data)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return of({ error: error.error.message || 'Registration failed' });
        })
      );
  }

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/user/login`, data)

  }

  sendOptForm(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/user/verifyOtp`, data)
      .pipe(
        catchError(error => {
          console.error('OTP verification error:', error);
          return of({ error: error.error.message || 'OTP verification failed' });
        })
      );
  }

  getUserInfo(): void {
    try {
      const token = localStorage.getItem('token');

      // Skip if no token or invalid token
      if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
        this.handleInvalidToken();
        return;
      }

      // Try to decode the token
      const decoded = jwtDecode(token) as IUserinfo;

      if (!decoded || !decoded.role) {
        this.handleInvalidToken();
        return;
      }

      // Update user info and role
      this.userInfo.set(decoded);
      this.role.set(decoded.role);
      localStorage.setItem('role', decoded.role);
      this.isLogin.set(true);

    } catch (error) {
      console.error('Error decoding token:', error);
      this.handleInvalidToken();
    }
  }

  private handleInvalidToken(): void {
    // Clear invalid token and role
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Reset auth state
    this.userInfo.set({} as IUserinfo);
    this.role.set('');
    this.isLogin.set(false);
    this.userName.set('');
  }

  logOut(): void {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Reset auth state
    this.userInfo.set({} as IUserinfo);
    this.role.set('');
    this.isLogin.set(false);
    this.userName.set('');

    // Navigate to login
    this.router.navigate(['/login']);
  }

  resetPass(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/user/reset-pass`, data)
      .pipe(
        catchError(error => {
          console.error('Password reset error:', error);
          return of({ error: error.error.message || 'Password reset failed' });
        })
      );
  }

  forgotPass(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/user/forgetPass`, data)
      .pipe(
        catchError(error => {
          console.error('Forgot password error:', error);
          return of({ error: error.error.message || 'Forgot password request failed' });
        })
      );
  }

  changePass(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/user/changePass`, data)
      .pipe(
        catchError(error => {
          console.error('Change password error:', error);
          return of({ error: error.error.message || 'Password change failed' });
        })
      );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
