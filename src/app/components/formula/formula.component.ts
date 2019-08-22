import { Component, OnInit, OnDestroy, AfterContentInit, Input, ViewChild, AfterContentChecked, OnChanges, AfterViewChecked } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormulaService } from 'src/app/services/formula.service';
import { FormControl } from '@angular/forms';

import { take, takeUntil } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';
import { Project } from 'src/app/models/Project';
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
export class FormulaComponent implements OnInit, OnDestroy, AfterViewChecked {
  private projects: object;
  public projectCtrl: FormControl = new FormControl();
  public projectFilterCtrl: FormControl = new FormControl();
  private projectNames: Project[] = [];

  /** list of Projects filtered by search keyword */
  public filteredProjects: ReplaySubject<Project[]> = new ReplaySubject<Project[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  /** Label of the search placeholder */
  // @Input() placeholderLabel = 'Project';

  private resources: Object[];
  private features: Object[];
  private featureValues: Object[];
  private projectMap = new Map();
  private projectID: number;

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
    this.getProjects();
    // this.resources = [];
    // this.features = [];
    // this.featureValues = [];

    this.sidebarService.status = true;

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

    this.projectCtrl.valueChanges.subscribe(() => {
      this.resources = [];
      this.features = [];
      this.featureValues = [];
      this.displayedColumns = ['resourceName', 'resourceCode'];
      console.log(this.projectCtrl.value);
      this.projectID = this.projectMap.get(this.projectCtrl.value);
      this.getProject();
      this.getResource();
      this.getFeature();
      this.getFeatureValue();

    },
      error => console.log(error),
      () => {
        console.log('COMPLETED');
        this.resources = [];
        this.features = [];
        this.featureValues = [];
      })
  }

  ngAfterViewChecked() {
  }

  getProjects() {
    this.formulaService.getProjects().subscribe(
      res => {
        console.log(res);
        this.projects = res;
        console.log(this.projects[0]['name']);
        for (let i = 0; i < this.projects['length']; i++) {
          this.projectNames.push(this.projects[i]);
          this.projectMap.set(this.projects[i]['name'], res[i]['id']);
        }
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('completed getting projects');
        console.log(this.projectNames);
        console.log(this.projectMap);
      }
    )
  }

  displayedColumns: string[] = ['resourceName', 'resourceCode'];
  dataSource = [];

  getProject() {
    this.projectService.setParam("find" + "" + this.projectID);
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
        for (let i in res) {
          if (res[i]["project"]["id"] === this.projectID) {
            console.log(res[i]);
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
    for (let resource of this.resources) {
      let resourceId = resource["id"];
      resource["features"] = this.findFeatureValue(resourceId);
    }
    console.log(this.resources);
    this.dataSource = this.resources;
    // this.resources = [];
  }

  findFeatureValue(resourceId: number) {
    let associatedFeatures: any[] = [];

    for (let featureValue of this.featureValues) {
      let resourceParentId = featureValue["resource"]["id"];
      let featureParent = featureValue["feature"];

      if (resourceParentId == resourceId) {
        let trimmedFeatureValue = ({ "id": featureValue["id"], "value": featureValue["value"] });
        featureParent["featureValue"] = trimmedFeatureValue;
        associatedFeatures.push(featureParent);
      }
    }

    return associatedFeatures;
  }

  getFeature() {
    // this.features = [];
    this.featureService.setParam("displayFeature");
    this.featureService.getFeatures().subscribe(
      res => {
        for (let i in res) {
          if (res[i]["project"]["id"] === this.projectID) {
            console.log(res[i]);
            this.features.push(res[i]);
          }
        }
      },
      error => console.log(error),
      () => {
        console.log("Feaures loaded.");
        console.log(this.features);
        this.displayAddedFeatures();
      }
    )
  }

  displayAddedFeatures() {
    for (let feature of this.features) {
      this.displayedColumns.push(feature["name"]);
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
    // this.featureValues = [];
    this.featureValueService.setParam("displayFeatureValue");
    this.featureValueService.getFeatureValues().subscribe(
      res => {
        for (let i in res) {
          if (res[i]["project"]["id"] === this.projectID) {
            console.log(res[i]);
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