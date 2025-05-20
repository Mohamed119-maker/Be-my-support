import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { IUserinfo } from '../../../shared/interfaces/iuserinfo';
import { sign } from 'crypto';

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
  }

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/user/login`, data)
  }


  sendOptForm(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/user/verifyOtp`, data)
  }

  getUserInfo(): void {
    this.userInfo.set(jwtDecode(localStorage.getItem('token')!));
    this.role.set(this.userInfo().role);
    localStorage.setItem('role', this.role());
    console.log(this.role());

  }

  logOut(): void {
    localStorage.removeItem('token')

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);

  }

  resetPass(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/user/reset-pass`, data)
  }

  forgotPass(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/user/forgetPass`, data);
  }

  changePass(data: object): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/user/changePass`, data);
  }
}
