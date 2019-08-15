import { Component, OnInit } from '@angular/core';
import { Login } from '../../models/Login';

import { SideBarService } from 'src/app/services/side-bar.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: Login;
  showMessage: boolean;

  constructor(private sidebarService: SideBarService, private loginService: LoginService) { }

  ngOnInit() {
    this.sidebarService.status = false;
    this.showMessage = false;
  }

  onSubmit(loginForm) {
    // if(!loginForm.value.remember) {
    //   loginForm.value.remember = false;
    // }
    this.login = new Login(loginForm.value.email, loginForm.value.password);
    this.loginService.login(this.login).subscribe(
      res => console.log(res["tokenType"]),
      (error) => this.showMessage = this.errorHandler(error)
    )
  }

  errorHandler(error: string): boolean {
    console.log(error);
    return true
  }

  onClose() {
    this.showMessage = false;
  }

}
