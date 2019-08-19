import { Component, OnInit } from '@angular/core';
import { SignupService } from 'src/app/services/signup.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  
  message : String;

  constructor(private signupService: SignupService,
              private loginService: LoginService,
              private messageService: MessageService) { }

  ngOnInit() {
    console.log(this.loginService.getRegisterStatus());
  }

  showStatus(){
    return this.signupService.getRegisterStatus() || this.loginService.getRegisterStatus() ;
  }

  getclass(){
    if(this.messageService.getObject() == "signup"){
      this.message = "User registered successfully!";
      return 'alert alert-success fade show';
    }
    if(this.messageService.getObject() == "login"){
      this.message = "Invalid email or password!";
      return 'alert alert-danger fade show';
    }
  }

  
  

  
  
  

  

}
