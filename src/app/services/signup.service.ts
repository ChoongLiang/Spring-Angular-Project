import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";
import { User } from "../models/User";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class SignupService {
  private url: string = environment.apiUrl + "/api/auth/signup";
  private registerSuccess: boolean;

  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient) {}

  newAccount(user: User): Observable<User> {
    return this.http.post<User>(this.url, user, this.httpOptions);
  }

  getRegisterStatus() {
    return this.registerSuccess;
  }

  registerStatus(status: boolean) {
    this.registerSuccess = status;
  }
}
