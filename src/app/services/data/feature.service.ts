import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

import { Feature } from "../../models/Feature";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FeatureService {
  private url: string = environment.apiUrl + "/FeatureHandler";
  private param = "";

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: this.authService.getJwt()
  //   })
  // };

  constructor(private http: HttpClient) {}

  getFeatures(): Observable<Feature[]> {
    return this.http.post<Feature[]>(this.url, `{ "submit": "${this.param}" }`);
  }

  getFeature(): Observable<Feature> {
    return this.http.post<Feature>(this.url, `{ "submit": "${this.param}" }`);
  }

  addFeature(feature: Feature): Observable<any> {
    return this.http.post<any>(this.url, feature);
  }

  setParam(param: string): void {
    this.param = param;
  }
}
