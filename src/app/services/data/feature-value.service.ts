import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

import { FeatureValue } from '../../models/FeatureValue';

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

  getFeatureValues(): Observable<FeatureValue[]> {
    return this.http.post<FeatureValue[]>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
  }

  getFeatureValue(): Observable<FeatureValue> {
    return this.http.post<FeatureValue>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
  }

  editFeatureValue(featureValue: FeatureValue): Observable<any> {
    return this.http.post<any>(this.url, featureValue, this.httpOptions);
  }
  
  setParam(param: string): void {
    this.param = param;
  }

}
