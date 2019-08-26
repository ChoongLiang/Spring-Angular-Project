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
  private project: Project;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authService.getJwt() })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }

  getProjects(): Observable<Project[]> {
    return this.http.post<Project[]>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
  }

  getProject(): Observable<Project> {
    return this.http.post<Project>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
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

  getCurrentProject(): Project {
    return this.project;
  }

  setCurrentProject(project: Project): void {
    this.project = project;
  }

}


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { AuthService } from '../../auth/auth.service';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProjectService {

//   private url: string = "http://localhost:8080/ProjectHandler";
//   private projectName:string;
//   private param = "";
//   private project: Project;

//   //activeProject: any[];
//   inactiveProject: any[];

//   activeProject = [
//     {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', selected: false},
//     {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', selected: false},
//     {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', selected: false},
//     {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', selected: false},
//     {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', selected: false},
//     {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', selected: false},
//     {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', selected: false},
//     {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', selected: false},
//     {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', selected: false},
//     {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', selected: false},
//   ];

//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
//   selected: false;

//   httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authService.getJwt() })
//   };

//   constructor(private http: HttpClient, private authService: AuthService) { }

//   getProjects(): Observable<any> {
//     return this.http.post<any>(this.url, `{ "submit": "${this.param}" }`, this.httpOptions);
//   }

//   setProjectName(name: string): void {
//     this.projectName = name;
//   } 

//   getProjectName(): string {
//     return this.projectName;
//   }

//   setParam(param: string): void {
//     this.param = param;
//   }

//   getCurrentProject(): Project {
//     return this.project;
//   }

//   setCurrentProject(project: Project): void {
//     this.project = project;

//   setToInactive(id: number){
//     this.inactiveProject.push(this.activeProject[id]);
//   }
// }
