import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../../shared/classes/user';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  createUser(firstName: string, lastName: string, phoneNum: string, email: string, password: string): Observable<any> {
    const user: User = {
      firstName: firstName,
      lastName: lastName,
      phoneNum: phoneNum,
      email: email,
      password: password
    }
    return this.http.post('http://localhost:3000/api/users/create', user);
  }
}