import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/login');
      return false;
    } else {
      return true;
    }
  }

  canActivateChild(): boolean {
    return true;
  }
  canLoad(): boolean {
    return this.authService.isUserLoggedIn();
  }

}
