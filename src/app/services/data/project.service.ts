import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

import { Project } from "../../models/Project";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ProjectService {
  private url: string = environment.apiUrl + "/ProjectHandler";
  private projectName: string;
  private param = "";
  // private id: number;
  // inactiveProject: any[];
  private project: Project;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.post<Project[]>(this.url, `{ "submit": "${this.param}" }`);
  }

  getProject(): Observable<Project> {
    return this.http.post<Project>(this.url, `{ "submit": "${this.param}" }`);
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
    return this.http.post(this.url, {
      submit: "newProject",
      projectName: name
    });
  }

  getCurrentProject(): Project {
    return this.project;
  }

  setCurrentProject(project: Project): void {
    this.project = project;
  }
}
