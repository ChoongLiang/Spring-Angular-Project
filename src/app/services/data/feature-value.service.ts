import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureValueService {

  private url: string = "http://localhost:8080/FeatureValueHandler";
  private param = "";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authService.getJwt() })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  getFeatureValues(): Observable<any> {
    return this.http.post<any>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
  }
  
  setParam(param: string): void {
    this.param = param;
  }

}