import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  private validateJwtUrl: string;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.validateJwtUrl = 'http://localhost:8080/username';
    this.checkJWT();
  }

  checkJWT() {
    let jwt = this.authService.getJwt();

    if(!jwt) {
      this.authService.logOut();
      this.router.navigateByUrl('/login');
      return
    }
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.validateJWT(httpOptions, jwt).subscribe(
      response => {
        if(response["isValid"] === "true") {
          this.authService.logIn();
        }
      },
      // If jwt time out, log out user + clean up local storage (waiting for Muke to fix the server)
      error => console.log(error),
      () => this.router.navigateByUrl('/resource')
    )
  }

  validateJWT(httpOptions: object, jwt: string): Observable<object> {
    return this.http.post(this.validateJwtUrl, { "jwt": jwt }, httpOptions);
  }

}
