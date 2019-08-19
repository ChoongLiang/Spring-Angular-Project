import { Component, OnInit, AfterContentChecked, OnChanges, AfterViewChecked, AfterContentInit, AfterViewInit } from '@angular/core';
import { SideBarService } from '../../services/side-bar.service';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterContentChecked {
  name: string;
  constructor(
    private sideBarSerivce: SideBarService,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  ngAfterContentChecked() {
    this.name = localStorage.getItem("name");
  }

  clickButton() {
    this.sideBarSerivce.trigger();
  }

  logOut() {
    this.authService.logOut();
    this.authService.cleanUpStorage();
  }

}
