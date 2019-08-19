import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../models/Login';

import { SideBarService } from 'src/app/services/side-bar.service';
import { LoginService } from 'src/app/services/login.service';
import { AuthService } from '../../auth/auth.service';
import { SignupService } from 'src/app/services/signup.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: Login;
  
  

  constructor(
    private sidebarService: SideBarService, 
    private loginService: LoginService, 
    private router: Router, 
    private authService: AuthService,
    private signupService: SignupService,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    this.sidebarService.status = false;
    this.loginService.registerStatus(false) ;
  }

  onSubmit(loginForm) {
    // if(!loginForm.value.remember) {
    //   loginForm.value.remember = false;
    // }
    this.login = new Login(loginForm.value.email, loginForm.value.password);
    this.loginService.login(this.login).subscribe(
      res => this.authService.storeJwt(res),
      (error) => {
        console.log('error');
        this.messageService.setObject("login");
        this.loginService.registerStatus(true);
        console.log(error);
      },
      () => this.router.navigateByUrl('/')
    )
  }



}
