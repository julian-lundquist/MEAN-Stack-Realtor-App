import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../shared/classes/user';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {response} from 'express';
// @ts-ignore
import Timer = NodeJS.Timer;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private isAuthenticated: boolean = false;
  private tokenTimer: Timer;

  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(firstName: string, lastName: string, phoneNum: string, email: string, password: string): Observable<any> {
    const user: User = {
      firstName: firstName,
      lastName: lastName,
      phoneNum: phoneNum,
      email: email,
      password: password
    }
    return this.http.post('http://localhost:3000/api/user/create', user);
  }

  login(email: string, password: string) {
    this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', {email: email, password: password}).subscribe(response => {
      console.log(response);
      this.token = response.token;
      if (this.token) {
        const expiresInDurationSeconds = response.expiresIn;
        console.log(expiresInDurationSeconds);
        this.setAuthTimer(expiresInDurationSeconds);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + (expiresInDurationSeconds * 1000));
        this.saveAuthData(this.token, expirationDate);
        console.log(JSON.parse(localStorage.getItem('jwt')));
        this.router.navigate(['/']);
      }
    });
  }

  authAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    console.log(authInfo, expiresIn);
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(expiresInDurationSeconds: number) {
    console.log(expiresInDurationSeconds + ' seconds were set');
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDurationSeconds * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('jwt', JSON.stringify({token: token, expirationDate: expirationDate}));
  }

  private clearAuthData() {
    localStorage.removeItem('jwt');
  }

  private getAuthData() {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    if (jwt) {
      jwt.expirationDate = new Date(jwt.expirationDate);
      return jwt;
    } else {
      return;
    }
  }
}
