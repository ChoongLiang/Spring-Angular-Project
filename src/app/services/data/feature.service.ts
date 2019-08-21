import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  private url: string = "http://localhost:8080/FeatureHandler";
  private param = "";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authService.getJwt() })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  getFeatures(): Observable<any> {
    return this.http.post<any>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
  }
  
  setParam(param: string): void {
    this.param = param;
  }

}
