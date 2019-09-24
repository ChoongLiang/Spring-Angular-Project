import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SideBarService {
  status: boolean;
  sidebarClass: string;

  constructor() {
    this.status = false;
    this.sidebarClass = "notActive";
  }

  getActiveClass() {
    this.sidebarClass = this.status ? "active" : "notActive";
    return this.sidebarClass;
  }

  trigger() {
    this.status = !this.status;
  }
}
