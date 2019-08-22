import { Component, OnInit } from '@angular/core';

import { SideBarService } from 'src/app/services/side-bar.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';
import { FeatureService } from 'src/app/services/data/feature.service';
import { FeatureValueService } from 'src/app/services/data/feature-value.service';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})

export class ResourceComponent implements OnInit {

  private resources: Object[];

  constructor(
    private sidebarService: SideBarService, 
    private projectService: ProjectService,
    private resourceService: ResourceService
    ) { }

  ngOnInit() {
    this.resources = [];

    this.sidebarService.status = true;
    this.getProject();
    this.getResource();
  }

  displayedColumns: string[] = ['resourceName', 'resourceCode'];
  dataSource = [];

  getProject() {
    this.projectService.setParam("find1");
    this.projectService.getProjects().subscribe(
      res => {
        this.projectService.setProjectName(res["name"]);
      },
      error => console.log(error),
      () => console.log("Project loaded.")
    )
  }

  getResource() {
    this.resourceService.setParam("displayResource");
    this.resourceService.getResources().subscribe(
      res => {
        for(let i in res) {
          if(res[i]["project"]["id"] === 1) {
            // console.log(res[i]);
            this.resources.push(res[i]);
          }
        }
      },
      error => console.log(error),
      () => {
        console.log("Resources loaded.");
        this.dataSource = this.resources;
      }
    )
  }

}
