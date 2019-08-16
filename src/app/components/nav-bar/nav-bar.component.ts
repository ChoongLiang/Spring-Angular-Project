import { Component, OnInit } from '@angular/core';
import { SideBarService } from '../../services/side-bar.service';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(
    private sideBarSerivce: SideBarService,
    private authService: AuthService
    ) { 
  }

  ngOnInit() {
  }

  clickButton() {
    this.sideBarSerivce.trigger();
  }

  logOut() {
    this.authService.logout();
  }

}
