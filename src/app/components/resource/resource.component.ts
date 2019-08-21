import { Component, OnInit } from '@angular/core';

import { SideBarService } from 'src/app/services/side-bar.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';
import { FeatureService } from 'src/app/services/data/feature.service';
import { FeatureValueService } from 'src/app/services/data/feature-value.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})

export class ResourceComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  private resources: Object[];
  private features: Object[];
  private featureValues: Object[];
  private resourceFeatureValueKeys: Object[];

  constructor(
    private sidebarService: SideBarService, 
    private projectService: ProjectService,
    private resourceService: ResourceService,
    private featureService: FeatureService,
    private featureValueService: FeatureValueService
    ) { }

  ngOnInit() {
    this.resources = [];
    this.features = [];
    this.featureValues = [];
    this.resourceFeatureValueKeys = [];

    this.sidebarService.status = true;
    this.getProject();
    this.getResource();
    // this.getFeature();
    this.getFeatureValue();
  }

  pairResourceFeatureValue() {
    for(let i in this.featureValues) {
      let key = {
        "resource" : this.featureValues[i]["resource"]["id"],
        "featureValue" : this.featureValues[i]["id"]
      };
      this.resourceFeatureValueKeys.push(key);
    }
    for(let j in this.resourceFeatureValueKeys) {
      console.log(this.resourceFeatureValueKeys[j]);
    }
  }

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
          console.log(res[i]);
          if(res[i]["project"]["id"] === 1) {
            this.resources.push(res[i]);
          }
        }
      },
      error => console.log(error),
      () => console.log("Resources loaded.")
    )
  }

  getFeature() {
    this.featureService.setParam("displayFeature");
    this.featureService.getFeatures().subscribe(
      res => {
        for(let i in res) {
          console.log(res[i]);
          if(res[i]["project"]["id"] === 1) {
            this.features.push(res[i]);
          }
        }
      },
      error => console.log(error),
      () => console.log("Feaures loaded.")
    )
  }

  getFeatureValue() {
    this.featureValueService.setParam("displayFeatureValue");
    this.featureValueService.getFeatureValues().subscribe(
      res => {
        for(let i in res) {
          console.log(res[i]);
          if(res[i]["project"]["id"] === 1) {
            this.featureValues.push(res[i]);
          }
        }
      },
      error => console.log(error),
      () => console.log("Feature values loaded.")
    )
  }

}
