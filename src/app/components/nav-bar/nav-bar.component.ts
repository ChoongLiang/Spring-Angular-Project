import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../auth/auth.service";
import { ProjectService } from "../../services/data/project.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.css"]
})
export class NavBarComponent implements OnInit, AfterContentChecked {
  private name: string;
  private dropdownActive: boolean;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.dropdownActive = false;
  }

  ngOnInit() {}

  ngAfterContentChecked() {
    this.name = localStorage.getItem("name");
  }

  logOut() {
    this.authService.logOut();
    this.authService.cleanUpStorage();
    this.router.navigate(["/login"]);
    this.dropdownActive = false;
  }

  profile() {
    this.router.navigate(["/profile"]);
    this.dropdownActive = false;
  }

  triggerDropdown(): void {
    this.dropdownActive = !this.dropdownActive;
  }
}
