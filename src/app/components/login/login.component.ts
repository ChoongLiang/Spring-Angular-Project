import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../models/Login';

import { SideBarService } from 'src/app/services/side-bar.service';
import { LoginService } from 'src/app/services/login.service';
import { AuthService } from '../../auth/auth.service';
import { SignupService } from 'src/app/services/signup.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: Login;
  showMessage: boolean;

  constructor(
    private sidebarService: SideBarService,
    private loginService: LoginService,
    private router: Router,
    private authService: AuthService,
    private signupService: SignupService
  ) { }

  ngOnInit() {
    this.sidebarService.status = false;
    this.showMessage = false;
  }

  onSubmit(loginForm) {
    this.login = new Login(loginForm.value.email, loginForm.value.password);
    this.loginService.login(this.login).subscribe(
      res => {
        this.authService.storeJwt(res);
        this.authService.storeName(res['name']);
        this.authService.storeExpiration(res['expiration']);
      },
      (error) => {
        this.showMessage = true;
        console.log(error);
      },
      () => {
        this.router.navigateByUrl('/');
      }
    )
  }

  onClose() {
    this.showMessage = false;
  }

}
