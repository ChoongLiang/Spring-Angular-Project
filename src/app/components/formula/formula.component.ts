import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormulaService } from 'src/app/services/formula.service';
import { FormControl } from '@angular/forms';

import { take, takeUntil } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';

import { Project } from '../../models/Project';
import { SideBarService } from 'src/app/services/side-bar.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';
import { FeatureService } from 'src/app/services/data/feature.service';
import { FeatureValueService } from 'src/app/services/data/feature-value.service';
import { Resource } from 'src/app/models/Resource';
import { Feature } from 'src/app/models/Feature';
import { FeatureValue } from 'src/app/models/FeatureValue';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit, OnDestroy {
  public projectCtrl: FormControl = new FormControl();
  public projectFilterCtrl: FormControl = new FormControl();
  private projectNames: Project[] = [];
  private projects: object;

  /** list of Projects filtered by search keyword */
  public filteredProjects: ReplaySubject<Project[]> = new ReplaySubject<Project[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  private projectMap = new Map();
  private projectId: number;
  private resources: Resource[];
  private features: Feature[];
  private featureValues: FeatureValue[];

  displayedColumns: string[] = ['resourceName', 'resourceCode'];
  dataSource = [];

  constructor(
    private formulaService: FormulaService,
    private sidebarService: SideBarService,
    private projectService: ProjectService,
    private resourceService: ResourceService,
    private featureService: FeatureService,
    private featureValueService: FeatureValueService
  ) { }

  ngOnInit() {
    // Load projects from back-end
    this.getProjects();
    this.getProjectName();

    // set initial selection or the saved value when moving from formula to template or vice-versa.
    this.projectCtrl.setValue(this.formulaService.getProjectName());

    this.displayedColumns = ["resourceName", 'resourceCode'];
    this.resources = [];
    this.features = [];
    this.featureValues = [];

    this.sidebarService.status = true;

    console.log(this.filteredProjects.next(this.projectNames.slice()));
    // load the initial project list
    this.filteredProjects.next(this.projectNames.slice());

    /*
      TODO: figure out how to filter the projectNames in the dropdown 
      menu (search bar)
    */
    // listen for search field value changes
    this.projectFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        console.log('subsibing');
        this.filterProjects();
      });

    this.projectCtrl.valueChanges.subscribe(() => {
      this.formulaService.clearCheckedFeatures();
      console.log('inside value changes');
      this.displayedColumns = ['resourceName', 'resourceCode'];
      this.resources = [];
      this.features = [];
      this.featureValues = [];
      this.projectId = this.projectMap.get(this.projectCtrl.value);
      this.getProjectName();
      this.getFeatureValue();
      this.getFeature();
    },
      error => console.log(error),
      () => {
        console.log('COMPLETED');
      })
  }

  getProjects() {
    this.formulaService.getProjects().subscribe(
      res => {
        this.projects = res;
        for (let i = 0; i < this.projects['length']; i++) {
          this.projectNames.push(this.projects[i]);
          this.projectMap.set(this.projects[i]['name'], res[i]['id']);
        }
      },
      err => console.log(err),
      () => {
        console.log('completed getting projects');
        console.log(this.projectNames);
        console.log(this.projectMap);
        this.projectId = this.projectMap.get(this.formulaService.getProjectName());
        this.getProjectName();
        this.resources = this.formulaService.getResources();
        console.log(this.resources);
        this.displayedColumns = this.displayedColumns.concat(this.formulaService.getCheckedFeatures());
        console.log(this.displayedColumns);
        this.dataSource = this.resources;
        // this.getFeature();
        // this.getFeatureValue();
        this.formulaService.clearProjectName();
      }
    )
  }

  getProjectName() {
    this.projectService.setParam("displayall");
    this.projectService.getProject().subscribe(
      project => {
        this.projectService.setProjectName(project.name);
      },
      error => console.log(error),
      () => console.log("Project loaded.")
    )
  }

  getFeatureValue() {
    this.featureValueService.setParam("displayFeatureValue");
    this.featureValueService.getFeatureValues().subscribe(
      featureValues => {
        for (let featureValue of featureValues) {
          if (featureValue.project.id === this.projectId) {
            this.featureValues.push(featureValue);
          }
        }
        console.log(this.featureValues);
      },
      error => console.log(error),
      () => {
        console.log("Feature values loaded.");
        this.getResource();
      }
    )
  }
  getFeature() {
    this.featureService.setParam("displayFeature");
    this.featureService.getFeatures().subscribe(
      features => {
        for (let feature of features) {
          if (feature.project.id === this.projectId) {
            this.features.push(feature);
          }
        }
      },
      error => console.log(error),
      () => {
        console.log("Feaures loaded.");
        console.log(this.features);
        this.formulaService.saveFeatures(this.features);
        this.displayAddedFeatures();
      }
    )
  }

  displayAddedFeatures() {
    for (let feature of this.features) {
      this.displayedColumns.push(feature.name);
    }
    // this.displayedColumns = this.displayedColumns.concat(this.formulaService.getCheckedFeatures());
  }

  getResource() {
    this.resourceService.setParam("displayResource");
    this.resourceService.getResources().subscribe(
      resources => {
        for (let resource of resources) {
          if (resource.project.id === this.projectId) {
            this.resources.push(resource);
          }
        }
        this.formulaService.saveResources(this.resources);
      },
      error => console.log(error),
      () => {
        console.log("Resources loaded.");
        this.prepareResource();
      }
    )
  }

  prepareResource() {
    for (let resource of this.resources) {
      resource.features = this.findFeatureValue(resource.id);
    }
    console.log(this.resources);
    this.dataSource = this.resources;
    // this.dataSource = this.formulaService.getResources();
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

  /*
    TODO: search bar in drop-down
  */
  protected filterProjects() {
    console.log('inside filterProjects');
    if (!this.projectNames) {
      return;
    }
    // get the search keyword
    let search = this.projectFilterCtrl.value;
    console.log(search);
    if (!search) {
      console.log(this.projectNames.slice());
      this.filteredProjects.next(this.projectNames.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the projects
    console.log(this.projectNames);
    console.log(this.projectNames)
    this.filteredProjects.next(
      this.projectNames.filter(project => {
        console.log(project.name);
        console.log(project.name.toLowerCase().indexOf(search));
        project.name.toLowerCase().indexOf(search) > -1
      })
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}