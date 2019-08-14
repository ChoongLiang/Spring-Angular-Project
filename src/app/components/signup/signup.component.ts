import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User;
  constructor(private signupService: SignupService) { }

  ngOnInit() {
    this.user = new User();
  }

  onSubmit(signupForm) {
    console.log("signing up... " + signupForm);
    this.user.email = signupForm.value.email;
    this.user.password = signupForm.value.password;
    this.user.first_name = signupForm.value.firstName;
    this.user.last_name = signupForm.value.lastName;
    this.user.role = ["user"];

    this.signupService.newAccount(this.user)
        .subscribe(message => {
          console.log(message);
        })
  }

}
