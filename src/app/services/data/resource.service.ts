import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

import { Resource } from '../../models/Resource';


@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  
  private url: string = "http://localhost:8080/ResourceHandler";
  private param = "";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authService.getJwt() })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  getResources(): Observable<Resource[]> {
    return this.http.post<Resource[]>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
  }

  getResource(): Observable<Resource> {
    return this.http.post<Resource>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
  }

  setParam(param: string): void {
    this.param = param;
  }
  
}
