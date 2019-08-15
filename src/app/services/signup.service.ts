import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private url: string = 'http://localhost:8080/api/auth/signup';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  registerSuccess: boolean;

  constructor(private http: HttpClient) {}

  newAccount(user: User): Observable<User> {
    return this.http.post<User>(this.url, user, this.httpOptions);
  }

  getRegisterStatus() {
    console.log(
      'Get Register Success getRegisterStatus()' + this.registerSuccess
    );
    return this.registerSuccess;
  }

  registerStatus(status: boolean) {
    this.registerSuccess = status;
    console.log('Register Success registerStatus()' + this.registerSuccess);
  }
}
