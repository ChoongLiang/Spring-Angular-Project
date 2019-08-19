import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (localStorage.length == 0) return true;
    else {
      this.router.navigateByUrl('/resource');
      return false;
    }
    // if (!this.authService.isAuthenticated()) {
    //   this.router.navigateByUrl('/login');
    //   return false;
    // } else {
    //   console.log('true');
    //   return true;
    // }
  }
}
