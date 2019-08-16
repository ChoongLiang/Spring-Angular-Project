import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { SignupService } from '../../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  private user: User;
  private status: boolean = true;
  constructor(private signupService: SignupService, private router: Router) { }

  ngOnInit() {}

  onSubmit(signupForm) {
    this.user = new User(signupForm.value.email, signupForm.value.password, signupForm.value.firstName,
                    signupForm.value.lastName, ["ADMIN"]);

    this.signupService.newAccount(this.user).subscribe(
      message => {
        console.log(message['response']);
        if (message['response'] === 'User registered successfully!') {
          this.status = true;
          this.signupService.registerStatus(this.status);
          this.router.navigate(['/login']);
        } else {
          this.status = false;
          this.signupService.registerStatus(this.status);
        }
      },
      err => console.log(err.error.message)
    );
  }

  onClose() {
    this.status = true;
  }

}
