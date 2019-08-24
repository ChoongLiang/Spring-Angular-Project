import { Component, OnInit } from '@angular/core';
import { SideBarService } from 'src/app/services/side-bar.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  private sidebarActive: boolean;

  constructor(private sideBarService: SideBarService) {
    this.sidebarActive = false;
  }

  ngOnInit() {
  }

  sideBar(): void {
    this.sideBarService.trigger();
    this.sidebarActive = !this.sidebarActive;
  }
}
