import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AuthService } from "../../auth/auth.service";
import { Observable } from "rxjs";

import { FeatureValue } from "../../models/FeatureValue";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FeatureValueService {
  private url: string = environment.apiUrl + "/FeatureValueHandler";
  private param = "";

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: this.authService.getJwt()
  //   })
  // };

  constructor(private http: HttpClient) {}

  getFeatureValues(): Observable<FeatureValue[]> {
    return this.http.post<FeatureValue[]>(
      this.url,
      `{ "submit": "${this.param}" }`
    );
  }

  getFeatureValue(): Observable<FeatureValue> {
    return this.http.post<FeatureValue>(
      this.url,
      `{ "submit": "${this.param}" }`
    );
  }

  editFeatureValue(featureValue: FeatureValue): Observable<any> {
    return this.http.post<any>(this.url, featureValue);
  }

  setParam(param: string): void {
    this.param = param;
  }
}
