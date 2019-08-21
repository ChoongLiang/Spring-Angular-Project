import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';

import { SideBarService } from '../../services/side-bar.service';
import { AuthService } from '../../auth/auth.service';
import { ProjectService } from '../../services/data/project.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterContentChecked {
  name: string;
  
  constructor(
    private sideBarSerivce: SideBarService,
    private authService: AuthService,
    private projectService: ProjectService
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
