import { Component, OnInit, OnDestroy, AfterContentInit, Input, ViewChild, AfterContentChecked } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormulaService } from 'src/app/services/formula.service';
import { FormControl } from '@angular/forms';

import { take, takeUntil } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';
import { MatSelect } from '@angular/material';

import { Project } from '../../models/Project';
import { Resource } from '../../models/Resource';
import { Feature } from '../../models/Feature';
import { FeatureValue } from '../../models/FeatureValue';

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
export class FormulaComponent implements OnInit, OnDestroy, AfterContentChecked {
  public projectCtrl: FormControl = new FormControl();
  public projectFilterCtrl: FormControl = new FormControl();
  private projectNames: Project[] = [];
  private projects: Project[];

  /** list of Projects filtered by search keyword */
  public filteredProjects: ReplaySubject<Project[]> = new ReplaySubject<Project[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /** Label of the search placeholder */
  // @Input() placeholderLabel = 'Project';

  private resources: Resource[];
  private features: Feature[];
  private featureValues: FeatureValue[];

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
    // Load projects from back-end
    // this.getProjects();

    this.resources = [];
    this.features = [];
    this.featureValues = [];

    this.sidebarService.status = true;
    this.getProjectName();
    this.getResource();
    this.getFeature();
    this.getFeatureValue();

    // set initial selection
    this.projectCtrl.setValue('');

    console.log(this.filteredProjects.next(this.projectNames.slice()));
    // load the initial project list
    this.filteredProjects.next(this.projectNames.slice());

    // listen for search field value changes
    this.projectFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        console.log('subsibing');
        this.filterProjects();
      });
  }

  ngAfterContentChecked() {
  }

  // getProjects() {
  //   this.formulaService.getProjects().subscribe(
  //     projects => {
  //       // console.log(res);
  //       // this.projects = res;
  //       // console.log(this.projects[0]['name']);
  //       this.projects = projects;
  //     },
  //     err => {
  //       console.log(err);
  //     },
  //     () => {
  //       console.log('completed getting projects');
  //       console.log(this.projectNames);
  //     }
  //   )
  // }

  displayedColumns: string[] = ['resourceName', 'resourceCode'];
  dataSource = [];


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

  getResource() {
    this.resourceService.setParam("displayResource");
    this.resourceService.getResources().subscribe(
      resources => {
        for(let resource of resources) {
          if(resource.project.id === 1) {
            this.resources.push(resource);
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
      resource.features = this.findFeatureValue(resource.id);
    }
    console.log(this.resources);
    this.dataSource = this.resources;
  }

  findFeatureValue(resourceId: number) {
    let associatedFeatures: Feature[] = [];
    for(let featureValue of this.featureValues) {
      if(featureValue.resource.id == resourceId) {
        featureValue.feature.featureValue = featureValue;
        associatedFeatures.push(featureValue.feature);
      }
    }
    return associatedFeatures;
  }

  getFeature() {
    this.featureService.setParam("displayFeature");
    this.featureService.getFeatures().subscribe(
      features => {
        for(let feature of features) {
          if(feature.project.id === 1) {
            this.features.push(feature);
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
      this.displayedColumns.push(feature.name);
    }
    console.log(this.displayedColumns);
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

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

  getFeatureValue() {
    this.featureValueService.setParam("displayFeatureValue");
    this.featureValueService.getFeatureValues().subscribe(
      featureValues => {
        for(let featureValue of featureValues) {
          if(featureValue.project.id === 1) {
            this.featureValues.push(featureValue);
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
