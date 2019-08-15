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
  }

  onSubmit(signupForm) {
    this.user = new User(signupForm.value.email, signupForm.value.password, signupForm.value.firstName,
                    signupForm.value.lastName, ["User"]);

    this.signupService.newAccount(this.user)
        .subscribe(message => {
          console.log(message);
        })
  }

}
