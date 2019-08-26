import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

import { Project } from '../../models/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private url: string = "http://localhost:8080/ProjectHandler";
  private projectName: string;
  private param = "";
  // private id: number;
  // inactiveProject: any[];
  private project: Project;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProjects(): Observable<Project[]> {
    return this.http.post<Project[]>(this.url, `{ "submit": "${this.param}" }`, this.getHeader());
  }

  getHeader(): object {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authService.getJwt() })
    };
  }

  getProject(): Observable<Project> {
    return this.http.post<Project>(this.url, `{ "submit": "${this.param}" }`, this.getHeader());
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

  // setToInactive(id: number) {
  //   this.inactiveProject.push(this.activeProject[id]);
  // }

  addProject(name: string) {
    return this.http.post(this.url, { "submit": "newProject", "projectName": name }, this.getHeader());
    getCurrentProject(): Project {
    return this.project;
  }

  setCurrentProject(project: Project): void {
    this.project = project;
  }

}
