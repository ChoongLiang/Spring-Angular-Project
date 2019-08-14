import { Component, OnInit } from '@angular/core';
import { SideBarService } from '../../services/side-bar.service';
import { SideBarComponent } from '../side-bar/side-bar.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private sideBarSerivce: SideBarService) { 
  }

  ngOnInit() {
  }

  clickButton() {
    this.sideBarSerivce.trigger();
  }

}
