import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormulaService } from 'src/app/services/formula.service';

import { SideBarService } from 'src/app/services/side-bar.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';
import { FeatureService } from 'src/app/services/data/feature.service';
import { FeatureValueService } from 'src/app/services/data/feature-value.service';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {
  private projects: Object;
  private projectNames: string[] = [];

  private resources: Object[];
  private features: Object[];
  private featureValues: Object[];

  constructor(
    private http: HttpClient, 
    private formulaService: FormulaService,
    private sidebarService: SideBarService, 
    private projectService: ProjectService,
    private resourceService: ResourceService,
    private featureService: FeatureService,
    private featureValueService: FeatureValueService
    ) { }

  ngOnInit() {
    this.formulaService.getProjects().subscribe(
      res => {
        console.log('res:');
        console.log(res);
        this.projects = res;
        console.log(this.projects);
        for (let i = 0; i < this.projects['length']; i++) {
          this.projectNames.push(this.projects[i]['name']);
        }
      },
      err => {
        console.log('error');
        console.log(err);
      },
      () => {
        console.log('completed getting projects');
        console.log(this.projectNames);
      }
    )

    this.resources = [];
    this.features = [];
    this.featureValues = [];

    this.sidebarService.status = true;
    this.getProject();
    this.getResource();
    this.getFeature();
    this.getFeatureValue();
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
        this.prepareResource();
      }
    )
  }

  prepareResource() {
    for(let resource of this.resources) {
      let resourceId = resource["id"];
      resource["features"] = this.findFeatureValue(resourceId);
    }
    console.log(this.resources);
    this.dataSource = this.resources;
  }

  findFeatureValue(resourceId: number) {
    let associatedFeatures: any[] = [];

    for(let featureValue of this.featureValues) {
      let resourceParentId = featureValue["resource"]["id"];
      let featureParent = featureValue["feature"];

      if(resourceParentId == resourceId) {
        let trimmedFeatureValue = ({"id": featureValue["id"], "value": featureValue["value"]});
        featureParent["featureValue"] = trimmedFeatureValue;
        associatedFeatures.push(featureParent);
      }
    }

    return associatedFeatures;
  }

  getFeature() {
    this.featureService.setParam("displayFeature");
    this.featureService.getFeatures().subscribe(
      res => {
        for(let i in res) {
          if(res[i]["project"]["id"] === 1) {
            // console.log(res[i]);
            this.features.push(res[i]);
          }
        }
      },
      error => console.log(error),
      () => {
        console.log("Feaures loaded.");
        this.displayAddedFeatures();
      }
    )
  }

  displayAddedFeatures() {
    for(let feature of this.features){
      this.displayedColumns.push(feature["name"]);
    }
    console.log(this.displayedColumns);
  }

  getFeatureValue() {
    this.featureValueService.setParam("displayFeatureValue");
    this.featureValueService.getFeatureValues().subscribe(
      res => {
        for(let i in res) {
          if(res[i]["project"]["id"] === 1) {
            // console.log(res[i]);
            this.featureValues.push(res[i]);
          }
        }
      },
      error => console.log(error),
      () => {
        console.log("Feature values loaded.");
      }
    )
  }
}
