import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";
import { Login } from "../models/Login";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  private showMessage: boolean;
  private url: string = environment.apiUrl + "/api/auth/signin";

  // httpOptions = {
  //   headers: new HttpHeaders({ "Content-Type": "application/json" })
  // };

  constructor(private http: HttpClient) {}

  login(login: Login): Observable<Login> {
    return this.http.post<Login>(this.url, login);
  }

  getRegisterStatus() {
    return this.showMessage;
  }

  registerStatus(status: boolean) {
    this.showMessage = status;
  }
}
