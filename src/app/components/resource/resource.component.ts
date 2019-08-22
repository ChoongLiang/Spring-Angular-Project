import { Component, OnInit } from '@angular/core';

import { SideBarService } from 'src/app/services/side-bar.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';
import { FeatureService } from 'src/app/services/data/feature.service';
import { FeatureValueService } from 'src/app/services/data/feature-value.service';

import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { Project } from '../../models/Project';
import { Resource } from '../../models/Resource';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})

export class ResourceComponent implements OnInit {

  private resources: Object[];
  private project: Project;
  private newResourceName: string;
  private newResourceCode: string;
  private dataSource: MatTableDataSource<Object>;
  private displayedColumns: string[] = ['resourceName', 'resourceCode'];

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

  getProject() {
    this.projectService.setParam("find1");
    this.projectService.getProject().subscribe(
      project => {
        this.projectService.setProjectName(project.name);
        this.project = project;
      },
      error => console.log(error),
      () => console.log("Project loaded.")
    )
  }

  getResource() {
    this.resourceService.setParam("displayResource");
    this.resourceService.getResources().subscribe(
      resources => {
        for(let resource of resources) {
          if(resource.project.id === 1) {
            this.resources.push(resource);
          } 
        }
        console.log(this.resources);
      },
      error => console.log(error),
      () => {
        console.log("Resources loaded.");
        this.dataSource = new MatTableDataSource(this.resources);
      }
    )
  }

  addNewRow():void {
    this.newResourceCode = "somcode";
    this.newResourceName = "name";

    let newResource: Resource = {"code": this.newResourceCode, "name": this.newResourceName, project: this.project};
    console.log(newResource);
    this.resources.push(newResource);
    this.dataSource = new MatTableDataSource(this.resources);
  }

}
