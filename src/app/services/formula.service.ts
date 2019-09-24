import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Feature } from "../models/Feature";
import { Resource } from "../models/Resource";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FormulaService {
  url: string = environment.apiUrl + "/ProjectHandler";
  jwt: string = this.authService.getJwt();
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     Authorization: `${this.jwt}`,
  //     "Content-Type": "application/json"
  //   })
  // };

  iFCheck: boolean[] = [true, true];
  features: Feature[];
  resources: Resource[];
  checkedFeatures: string[] = [];
  projectName: string;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProjects(): Observable<Object> {
    return this.http.post(
      this.url,
      { submit: "displayProjects" }
      // this.httpOptions
    );
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
    this.projectName = "";
  }

  clearCheckedFeatures() {
    this.checkedFeatures = [];
  }

  saveResources(resources: Resource[]) {
    this.resources = resources;
  }

  getResources() {
    return this.resources;
  }

  updateFeatures(modifiedFeatures: Feature[]) {
    this.features = modifiedFeatures;
  }
}
