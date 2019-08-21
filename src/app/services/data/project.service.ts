import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private url: string = "http://localhost:8080/ProjectHandler";
  private projectName:string;
  private param = "";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authService.getJwt() })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProjects(): Observable<any> {
    return this.http.post<any>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
  }

  setProjectName(name: string): void {
    this.projectName = name;
  } 

  getProjectName(): string {
    return this.projectName;
  }

  setParam(param: string): void {
    this.param = param;
  }
}