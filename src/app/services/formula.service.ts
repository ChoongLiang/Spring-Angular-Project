import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  url: string = 'http://localhost:8080/ProjectHandler';
  jwt: string = this.authService.getJwt();
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `${this.jwt}`,
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProjects(): Observable<Object> {
    return this.http.post(this.url, { 'submit': 'displayProjects' }, this.httpOptions);
  }
}
