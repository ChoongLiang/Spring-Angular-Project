import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Project } from 'src/app/models/Project';
import { ReplaySubject, Subject } from 'rxjs';
import { SideBarService } from 'src/app/services/side-bar.service';
import { FormulaService } from 'src/app/services/formula.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  public projectCtrl: FormControl = new FormControl();
  public projectFilterCtrl: FormControl = new FormControl();
  private projectNames: Project[] = [];
  private projects: object;
  private projectId: number;
  private projectMap = new Map();

  /** list of Projects filtered by search keyword */
  public filteredProjects: ReplaySubject<Project[]> = new ReplaySubject<Project[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  displayedColumns: string[] = ['resourceName', 'resourceCode'];
  dataSource = [];
  resources = [];


  constructor(private sideBarService: SideBarService, private formulaService: FormulaService,
    private projectService: ProjectService, private resourceService: ResourceService) { }

  ngOnInit() {
    this.getProjects();

    this.sideBarService.status = true;

    this.projectCtrl.valueChanges.subscribe(() => {
      this.formulaService.clearCheckedFeatures();
      console.log('inside value changes');
      this.displayedColumns = ['resourceName', 'resourceCode'];
      this.resources = [];
      this.projectId = this.projectMap.get(this.projectCtrl.value);
      this.getProjectName();
      this.getResource();
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
        // this.projectId = this.projectMap.get(this.formulaService.getProjectName());
        // this.getProjectName();
        // this.resources = this.formulaService.getResources();
        // console.log(this.resources);
        // this.displayedColumns = this.displayedColumns.concat(this.formulaService.getCheckedFeatures());
        // console.log(this.displayedColumns);
        // this.dataSource = this.resources;
        // this.formulaService.clearProjectName();
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
        this.dataSource = this.resources;
      }
    )
  }

}
