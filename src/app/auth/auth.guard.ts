import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  private resourceUrl: string = 'http://localhost:8080/ProjectHandler';

  private headers = new HttpHeaders();

  constructor(private authService: AuthService, private http: HttpClient) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    let jwt = this.authService.getJwt();
    if(jwt.length) {
      this.headers = this.headers.set('Content-type', 'application/json').set('Authorization', jwt);
      let httpOptions = { headers : this.headers };
      console.log("Logging in...");
      this.simulatePostReq(httpOptions).subscribe(
        // Todo: if jwt is authenticated, populate the data into front end (username)
        res => {
          console.log(res);
          return true
        },
        // Todo: if jwt not authenticated, redirect to login page with error message
        error => {
          console.log(error);
          return false
        },
        () => console.log("completed")
      )
    } else {
      console.log("Not found");
      return false
    }
  }

  simulatePostReq(httpOptions: object): Observable<object> {
    return this.http.post(this.resourceUrl, { 'submit': 'find1' } , httpOptions);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

}
