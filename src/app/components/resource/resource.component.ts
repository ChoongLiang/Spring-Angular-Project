import { Component, OnInit, Inject } from '@angular/core';

import { FeatureDialogComponent } from './feature-dialog/feature-dialog.component';

import { SideBarService } from 'src/app/services/side-bar.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';
import { FeatureService } from 'src/app/services/data/feature.service';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Project } from '../../models/Project';
import { Resource } from '../../models/Resource';
import { Feature } from 'src/app/models/Feature';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})

export class ResourceComponent implements OnInit {

  private resources: Resource[] = [];
  private project: Project;
  private newResourceName: string[] = [];
  private newResourceCode: string[] = [];

  private newFeature: Feature = {
    name : "",
    content : "",
    type: "",
    submit: "newFeature"
  }

  private dataSource;
  private displayedColumns: string[] = ['resourceName', 'resourceCode'];

  constructor(
    private sidebarService: SideBarService,
    private projectService: ProjectService,
    private resourceService: ResourceService,
    private featureService: FeatureService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    this.project = {id: 1, name: "Project1"};
    this.projectService.setProjectName(this.project.name);
    this.projectService.setCurrentProject(this.project);
    this.sidebarService.status = true;
    this.getResource();
    this.getFeature();

    this.dataSource = new MatTableDataSource(this.resources);
  }

  /**
   * Resource section
   */

  getResource() {
    this.resourceService.setParam("displayResource");
    this.resourceService.getResources().subscribe(
      resources => {
        for (let resource of resources) {
          if (resource.project.id === 1) {
            this.resources.push(resource);
          }
        }
      },
      error => console.log(error),
      () => {
        console.log("Resources loaded.");
        this.updateDataSource();
      }
    )
  }

  addNewRow(): void {
    let newResource: Resource = {code: "", name: "", projectId: this.project.id.toString(), editable: true};
    this.resources.push(newResource);
    this.updateDataSource();
  }

  updateDataSource(): void {
    this.dataSource = new MatTableDataSource(this.resources);
  }

  saveResource(index: number): void {
    if(!this.newResourceCode[index] || !this.newResourceName[index]) {
      this.openSnackBar("Field cannot be empty", "Close")
      return
    }
    this.closeRow(index);
    let newResource: Resource = {
      code: this.newResourceCode[index].trim(),
      name: this.newResourceName[index].trim(),
      projectId: this.project.id.toString(),
      submit: "newResource"
    }
    this.resources.push(newResource);
    this.updateDataSource();
    this.spliceResource(index);

    this.resourceService.addResource(newResource).subscribe(
      (res) => console.log(res),
      error => console.log(error),
      () => console.log("completed")
    );
  }

  discardResource(index: number): void {
    this.closeRow(index);
    this.spliceResource(index);
  }

  closeRow(index: number): void {
    if(index > -1) {
      this.resources.splice(index, 1);
      this.updateDataSource();
      return
    }
    // Should never reach here...
    this.openSnackBar("Error: Trying to delete index at -1...", "Close");
  }

  spliceResource(index: number): void {
    this.newResourceCode.splice(index, 1);
    this.newResourceName.splice(index, 1);
  }

  /**
   * Snack bar
   */

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    }); 
  }

  /**
   * Feature section
   */

  getFeature(): void {
    this.featureService.setParam("displayFeature");
    this.featureService.getFeatures().subscribe(
      features => {
        for(let feature of features) {
          if(feature.project.id === 1) {
            this.displayedColumns.push(feature.name);
          }
        }
      },
      error => console.log(error)
    )
  }

  addNewFeature(): void {
    const dialogRef = this.dialog.open(FeatureDialogComponent, {
      width: "300px",
      data: this.newFeature
    });

    dialogRef.afterClosed().subscribe(feature => {
      if(typeof feature === "undefined") {
        return
      }
      this.newFeature = feature.value;
      this.newFeature.projectId = this.project.id.toString();
      this.newFeature.submit = "newFeature";

      this.featureService.addFeature(this.newFeature).subscribe(
        res => console.log(res),
        error => console.log(error),
        () => {
          console.log("New feature saved");
          this.displayedColumns.push(this.newFeature.name);
        }
      )
    });
  }

  /**
   * Search section
   */

  applyFilter(keyword: string): void {
    this.dataSource.filter = keyword.trim().toLowerCase();
  }

}
