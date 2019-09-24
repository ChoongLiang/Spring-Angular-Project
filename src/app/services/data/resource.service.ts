import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

import { Resource } from "../../models/Resource";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ResourceService {
  private url: string = environment.apiUrl + "/ResourceHandler";
  private param = "";

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: this.authService.getJwt()
  //   })
  // };

  constructor(private http: HttpClient) {}

  getResources(): Observable<Resource[]> {
    return this.http.post<Resource[]>(
      this.url,
      `{ "submit": "${this.param}" }`
    );
  }

  getResource(): Observable<Resource> {
    return this.http.post<Resource>(this.url, `{ "submit": "${this.param}" }`);
  }

  addResource(resource: Resource): Observable<any> {
    return this.http.post<any>(this.url, resource);
  }

  editResource(resource: Resource): Observable<any> {
    return this.http.post<any>(this.url, resource);
  }

  setParam(param: string): void {
    this.param = param;
  }

  logParam(): void {
    console.log(this.param);
  }
}
