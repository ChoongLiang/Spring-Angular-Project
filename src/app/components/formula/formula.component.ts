import { Component, OnInit } from '@angular/core';
import { FormulaService } from 'src/app/services/formula.service';
import { FormControl } from '@angular/forms';

import { Project } from '../../models/Project';
import { SideBarService } from 'src/app/services/side-bar.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';
import { FeatureService } from 'src/app/services/data/feature.service';
import { FeatureValueService } from 'src/app/services/data/feature-value.service';

import { MatTableDataSource } from '@angular/material';

import { Resource } from 'src/app/models/Resource';
import { Feature } from 'src/app/models/Feature';
import { FeatureValue } from 'src/app/models/FeatureValue';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {
  public projectCtrl: FormControl = new FormControl();
  public projectFilterCtrl: FormControl = new FormControl();

  private projects: Project[] = [];
  private project: Project;
  private currentProjectId: number;

  private resources: Resource[];
  private features: Feature[];
  private featureValues: FeatureValue[];

  private displayedColumns: string[] = ['resourceName', 'resourceCode'];
  private dataSource;

  private editedFeatureValueList: FeatureValue[] = [];
  private editedResourceList: Resource[] = [];

  constructor(
    private formulaService: FormulaService,
    private sidebarService: SideBarService,
    private projectService: ProjectService,
    private resourceService: ResourceService,
    private featureService: FeatureService,
    private featureValueService: FeatureValueService
  ) { }

  ngOnInit() {
    this.displayedColumns = ['resourceName', 'resourceCode'];
    this.resources = [];
    this.features = [];
    this.featureValues = [];

    this.sidebarService.status = true;

    this.getProjects();
    this.updateDataSource();
  }

  /**
   * Project section
   */

  getProjects() {
    this.projectService.setParam("displayall");
    this.projectService.getProjects().subscribe(
      projects => {
        this.projects = projects;
      },
      error => console.log(error),
      () => {
        this.setCurrentProject();
        this.currentProjectId = this.project.id;
        this.getFeature();
        this.getFeatureValue();
      }
    )
  }

  setCurrentProject(): void {
    this.project = this.projects[0];
    this.projectService.setCurrentProject(this.project);
    this.projectService.setProjectName(this.project.name);
  }

  /**
   * Whenever a project is selected
   */

  selectedProject(selectedProjectId: any) {
    if (this.project.id === selectedProjectId.value) {
      return
    }
    this.project = this.getProject(selectedProjectId.value);
    this.projectService.setProjectName(this.project.name);
    console.log("selected project: " + this.project.id);
    this.resetData();
    this.getFeatureValue();
    this.getFeature();
  }

  getProject(projectId: number): Project {
    for(let project of this.projects) {
      if(project.id === projectId) {
        return project
      }
    }
  }

  /**
   * Reset the table(data)
   */

  resetData():void {
    this.resources = [];
    this.features = [];
    this.featureValues = [];
    this.displayedColumns.length = 2;
    this.updateDataSource();
  }

  /**
   * Feature values
   */

  getFeatureValue() {
    this.featureValueService.setParam("displayFeatureValue");
    this.featureValueService.getFeatureValues().subscribe(
      featureValues => {
        console.log("fetching feature value of project id: " + this.project.id);
        this.featureValues = featureValues.filter(
          featureValue => featureValue.project.id === this.project.id
        )
      },
      error => console.log(error),
      () => {
        console.log("Feature values loaded.");
        this.getResource();
      }
    )
  }

  /**
   * Features
   */

  getFeature() {
    this.featureService.setParam("displayFeature");
    this.featureService.getFeatures().subscribe(
      features => {
        this.features = features.filter(
          feature => feature.project.id === this.project.id
        )
      },
      error => console.log(error),
      () => {
        console.log("Feaures loaded.");
        this.displayAddedFeatures();
        this.formulaService.saveFeatures(this.features);
      }
    )
  }

  displayAddedFeatures() {
    for (let feature of this.features) {
      this.displayedColumns.push(feature.name);
    }
  }

  updateFeatures(modifiedFeatures: Feature[]) {
    this.features = modifiedFeatures;
  }

  /**
   * Resources
   */

  getResource() {
    this.resourceService.setParam("displayResource");
    this.resourceService.getResources().subscribe(
      resources => {
        this.resources = resources.filter(
          resource => resource.project.id === this.project.id
        )
        this.formulaService.saveResources(this.resources);
      },
      error => console.log(error),
      () => {
        console.log("Resources loaded.");
        this.prepareResource();
        this.updateDataSource();
      }
    )
  }

  prepareResource() {
    for (let resource of this.resources) {
      resource.features = this.findFeatureValue(resource.id);
    }
  }

  findFeatureValue(resourceId: number) {
    let associatedFeatures: Feature[] = [];
    for (let featureValue of this.featureValues) {
      if (featureValue.resource.id == resourceId) {
        featureValue.feature.featureValue = featureValue;
        associatedFeatures.push(featureValue.feature);
      }
    }
    return associatedFeatures;
  }

  updateDataSource(): void {
    this.dataSource = new MatTableDataSource(this.resources);
  }

  /**
   * HTML table cell input box helper
   * @param resourceFeatures - Associated features in resource
   * @param feature - Column(Feature)
   */

  inputboxValue(resourceFeatures: Feature[], feature: Feature): string {
    for(let resourceFeature of resourceFeatures) {
      if(resourceFeature.name === feature.name) {
        return resourceFeature.featureValue.value
      }
    }
    return ""
  }

  /**
   * Edit table cell
   * @param value - cell value
   * @param resource - row(Resource)
   * @param column - (Feature)
   */

  onEdit(value: string, resource: Resource, column: any): void {
    if(column === "name" || column === "code") {
      switch(column){
        case "name":
          resource.name = value;
          break
        case "code":
          resource.code = value;
          break
        default:
          alert("error")
      }
      this.isResouceEdited(resource);
      this.saveResouceChanges(resource);
    } else {
      let newFeatureValue: FeatureValue;
      let associatedFeature = resource.features.filter(
        feature => feature.name === column.name
      )
      if(associatedFeature.length > 0) {
        // Use index 0 here because there can only be one cell associated with this row/col
        newFeatureValue = associatedFeature[0].featureValue;

        newFeatureValue.value = value;
        newFeatureValue.submit = `edit${newFeatureValue.id}`;
      } else {
        newFeatureValue = {
          value: value,
          resource: resource,
          feature: column,
          project: this.project,
          submit: "newFeatureValue"
        }
      }
      this.isCellEdited(resource.id, column.id);
      this.saveFeatureValueChanges(newFeatureValue);
    }
    this.updateDataSource();
  }

  isResouceEdited(editedResource: Resource): void {
    for (let [index, resource] of this.editedResourceList.entries()) {
      if (editedResource.id === resource.id) {
        this.editedResourceList.splice(index, 1);
        break
      }
    }
  }

  saveResouceChanges(resource: Resource): void {
    resource.submit = `edit${resource.id}`;
    resource.projectId = this.project.id.toString();
    this.editedResourceList.push(resource);
  }

  isCellEdited(resourceId: number, featureId: number): void {
    for(let [index, edited] of this.editedFeatureValueList.entries()) {
      if(edited.resource.id === resourceId && edited.feature.id === featureId) {
        this.editedFeatureValueList.splice(index, 1);
        break
      }
    }
  }

  saveFeatureValueChanges(featureValue: FeatureValue): void {
    featureValue.projectId = this.project.id.toString();
    featureValue.resourceId = featureValue.resource.id.toString();
    featureValue.featureId = featureValue.feature.id.toString();

    this.editedFeatureValueList.push(featureValue);
  }

  submit(): void {
    for (let editedResource of this.editedResourceList) {
      delete editedResource.features;
      delete editedResource.project;
      this.resourceService.editResource(editedResource).subscribe(
        res => console.log(res),
        error => console.log(error),
        () => console.log("Resources updated successfully!")
      )
    }
    for (let editedFeatureValue of this.editedFeatureValueList) {
      delete editedFeatureValue.feature;
      delete editedFeatureValue.resource;
      delete editedFeatureValue.project;
      this.featureValueService.editFeatureValue(editedFeatureValue).subscribe(
        res => console.log(res),
        error => console.log(error),
        () => console.log("Feature Values updated successfully!")
      )
    }
  }

  // getProjects() {
  //   this.formulaService.getProjects().subscribe(
  //     res => {
  //       this.projects = res;
  //       for (let i = 0; i < this.projects['length']; i++) {
  //         this.projectNames.push(this.projects[i]);
  //         this.projectMap.set(this.projects[i]['name'], res[i]['id']);
  //       }
  //     },
  //     err => console.log(err),
  //     () => {
  //       console.log('completed getting projects');
  //       console.log(this.projectNames);
  //       console.log(this.projectMap);
  //       this.projectId = this.projectMap.get(this.formulaService.getProjectName());
  //       this.getProjectName();
  //       this.resources = this.formulaService.getResources();
  //       console.log(this.resources);
  //       this.displayedColumns = this.displayedColumns.concat(this.formulaService.getCheckedFeatures());
  //       console.log(this.displayedColumns);
  //       this.dataSource = this.resources;
  //       // this.getFeature();
  //       // this.getFeatureValue();
  //       this.formulaService.clearProjectName();
  //     }
  //   )
  // }

  /*
    TODO: search bar in drop-down
  */
  // protected filterProjects() {
  //   console.log('inside filterProjects');
  //   if (!this.projectNames) {
  //     return;
  //   }
  //   // get the search keyword
  //   let search = this.projectFilterCtrl.value;
  //   console.log(search);
  //   if (!search) {
  //     console.log(this.projectNames.slice());
  //     this.filteredProjects.next(this.projectNames.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   // filter the projects
  //   console.log(this.projectNames);
  //   console.log(this.projectNames)
  //   this.filteredProjects.next(
  //     this.projectNames.filter(project => {
  //       console.log(project.name);
  //       console.log(project.name.toLowerCase().indexOf(search));
  //       project.name.toLowerCase().indexOf(search) > -1
  //     })
  //   );
  // }

}
