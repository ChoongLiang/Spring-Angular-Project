import { Component, OnInit, OnDestroy, AfterContentInit, Input, ViewChild, AfterContentChecked } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormulaService } from 'src/app/services/formula.service';
import { FormControl } from '@angular/forms';

import { take, takeUntil } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { MatSelect } from '@angular/material';



@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit, OnDestroy, AfterContentChecked {
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

  constructor(private http: HttpClient, private formulaService: FormulaService) { }

  ngOnInit() {
    // Load projects from back-end
    this.getProjects();

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

  getProjects() {
    this.formulaService.getProjects().subscribe(
      res => {
        console.log(res);
        this.projects = res;
        console.log(this.projects[0]['name']);
        for (let i = 0; i < this.projects['length']; i++) {
          this.projectNames.push(this.projects[i]);
        }
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('completed getting projects');
        console.log(this.projectNames);
      }
    )
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

}
