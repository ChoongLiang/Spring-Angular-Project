import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Login } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

	private showMessage: boolean;
  private object : String = null;
  private url: string = "http://localhost:8080/api/auth/signin";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  login(login: Login): Observable<Login> {
    return this.http.post<Login>(this.url, login, this.httpOptions);
  }

  getRegisterStatus() {
    return this.showMessage;
  }

  registerStatus(status: boolean) {
    this.showMessage = status;
  }

}
