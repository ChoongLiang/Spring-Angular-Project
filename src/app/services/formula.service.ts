import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Feature } from '../models/Feature';

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
  features: Feature[];
  checkedFeatures: string[] = [];
  projectName: string;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProjects(): Observable<Object> {
    return this.http.post(this.url, { 'submit': 'displayProjects' }, this.httpOptions);
  }

  getFeatures(): Feature[] {
    return this.features;
  }

  saveFeatures(features: Feature[]) {
    this.features = features;
  }

  saveCheckedFeatures(checkedFeatures) {
    this.checkedFeatures = checkedFeatures;
    console.log(this.checkedFeatures);
  }

  getCheckedFeatures() {
    return this.checkedFeatures;
  }

  saveProjectName(name: string) {
    this.projectName = name;
  }

  getProjectName() {
    return this.projectName;
  }

  clearProjectName() {
    this.projectName = '';
  }

  clearCheckedFeatures() {
    this.checkedFeatures = [];
  }
}
