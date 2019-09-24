import { Component, OnInit, ViewChild } from "@angular/core";

import { SideBarService } from "src/app/services/side-bar.service";
import { ProjectService } from "src/app/services/data/project.service";
import { ResourceService } from "src/app/services/data/resource.service";
import { SelectionModel } from "@angular/cdk/collections";

import { MatPaginator, MatTableDataSource } from "@angular/material";
import { ResourceComponent } from "../resource/resource.component";
import { Resource } from "src/app/models/Resource";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { Project } from "src/app/models/Project";
import { FormulaService } from "src/app/services/formula.service";

@Component({
  selector: "app-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.css"]
})
export class ProjectComponent implements OnInit {
  public projectCtrl: FormControl = new FormControl();
  public projectFilterCtrl: FormControl = new FormControl();
  private projectNames: Project[] = [];
  private projects: object;
  private projectId: number;
  private projectMap = new Map();

  /** list of Projects filtered by search keyword */
  public filteredProjects: ReplaySubject<Project[]> = new ReplaySubject<
    Project[]
  >(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  dataSource;
  resources = [];
  dataFromResource: string;

  //retrieving data from resource component
  @ViewChild(ResourceComponent, { static: false }) n;

  position: any;
  selectedAll: any;
  /***********************************************/
  sdeptname: any;
  checkedData = [];
  /***********************************************/
  data;

  // displayedColumns2 = ['select', 'position', 'name', 'weight', 'symbol'];
  displayedColumns3 = ["select", "name", "weight"];

  selection = new SelectionModel<Element>(true, []);

  checkedDataSource = new MatTableDataSource<Element>(this.checkedData);
  checkedSelection = new SelectionModel<Element>(true, []);

  uncheckedData = this.data;

  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  @ViewChild("checkedpaginator", { static: false })
  checkedpaginator: MatPaginator;

  constructor(
    private sidebarService: SideBarService,
    private projectService: ProjectService,
    private resourceService: ResourceService,
    private formulaService: FormulaService
  ) {}

  ngOnInit() {
    this.getProjects();

    this.sidebarService.status = true;

    this.projectCtrl.valueChanges.subscribe(
      () => {
        this.formulaService.clearCheckedFeatures();
        this.resources = [];
        this.projectId = this.projectMap.get(this.projectCtrl.value);
        this.projectService.setProjectName(this.projectCtrl.value);
        this.getResource();
      },
      error => console.log(error),
      () => {
        console.log("COMPLETED changing projects");
      }
    );

    //retrieving data from resource component
    this.dataFromResource = this.n.dataSource.name[1];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.checkedDataSource.paginator = this.checkedpaginator;
  }

  getProjects() {
    this.formulaService.getProjects().subscribe(
      res => {
        this.projects = res;
        for (let i = 0; i < this.projects["length"]; i++) {
          this.projectNames.push(this.projects[i]);
          this.projectMap.set(this.projects[i]["name"], res[i]["id"]);
        }
      },
      err => console.log(err),
      () => {
        console.log("completed getting projects");
        console.log(this.projectNames);
        console.log(this.projectMap);
      }
    );
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
        this.data = Object.assign(this.resources);
        this.dataSource = new MatTableDataSource<Resource>(this.data);
      }
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllCheckedSelected() {
    const numSelected = this.checkedSelection.selected.length;
    const numRows = this.checkedDataSource.data.length;
    return numSelected === numRows;
  }

  /* Function to move row from table 1-->2 */
  moveToTableTwo() {
    console.log(this.dataSource.data);
    this.selection.selected.forEach((k, item) => {
      //this.dataSource.data.splice(this.dataSource.data.indexOf(k),1);
      this.checkedDataSource.data.push(k);
    });
    console.log(this.dataSource.data);
    console.log(this.checkedDataSource);
    this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
    this.checkedDataSource = new MatTableDataSource<Element>(
      this.checkedDataSource.data
    );
    this.selection.clear();
  }

  /* Function to move row from table 2-->1 */
  moveToTableOne() {
    this.selection.selected.forEach((k, item) => {
      this.checkedDataSource.data.splice(this.dataSource.data.indexOf(k), 1);
    });
    console.log(this.dataSource.data);
    this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
    this.checkedDataSource = new MatTableDataSource<Element>(
      this.checkedDataSource.data
    );
    this.selection.clear();
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
      let index: number = this.data.findIndex(d => d === item);
      console.log(this.data.findIndex(d => d === item));
      this.dataSource.data.splice(index, 1);

      this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
      this.checkedDataSource = new MatTableDataSource<Element>(
        this.checkedDataSource.data
      );
    });
    this.selection = new SelectionModel<Element>(true, []);
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
    console.log(this.data);
  }

  masterCheckedToggle() {
    this.isAllCheckedSelected()
      ? this.checkedSelection.clear()
      : this.dataSource.data.forEach(row => this.checkedSelection.select(row));
    console.log(this.checkedData);
  }

  /*
    Why is this function used? @Rohith
  */
  // onSetToInactive(id: number) {
  //   this.projectService.setToInactive(id);
  // }

  /**
   * Moving Data From Left Table To Right Table //#endregion
   */
  moveDataToOtherTable = (): void => {
    if (this.selection && this.selection.selected) {
      this.selection.selected.forEach(val => {
        this.checkedDataSource.data.push(val);
      });
      this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
      this.checkedDataSource = new MatTableDataSource<Element>(
        this.checkedDataSource.data
      );
      this.selection.clear();
    }
  };
  /**
   * Select All CheckBox Of Left Table ...
   * @param callFrom
   */
  selectAndUnSelectLeftRows = (callFrom: string): void => {
    if (callFrom === "SA") {
      this.dataSource.data.forEach(row => this.selection.select(row));
    } else if (callFrom === "CS") {
      this.selection.clear();
    }
  };

  /**
   * Delete Right List ...
   */
  trashRightList = () => (this.checkedDataSource.data = []);

  // on clicking Submit button in .html
  submitHandler() {
    console.log(this.checkedData);
    let highest = Math.max(...this.projectMap.values()) + 1;

    this.projectService.addProject("Project" + highest).subscribe(
      res => console.log(res),
      err => console.log(err),
      () => {
        console.log("project added successfully");
        this.addResources(highest);
      }
    );
  }

  // Following the completion in submitHandler()
  addResources(highest: number) {
    let res: Resource[] = [];
    for (let i = 0; i < this.checkedData.length; i++) {
      let a = {
        code: this.checkedData[i]["code"],
        name: this.checkedData[i]["name"],
        projectId: highest.toString(),
        submit: "newResource"
      };
      res.push(a);
      console.log(res[i]);
      this.resourceService
        .addResource(res[i])
        .subscribe(
          res => console.log(res),
          err => console.log(err),
          () => console.log("resource added successfully")
        );
    }
  }
}

/**
 * Search Project Name Right Table...
 * @param searchTx
 */
// filterProjectName(searchTxt: string): void {
//   if (searchTxt) {
//     this.rightListDropDownValues = this.rightListDropDownValues.filter(project => project.projectName.includes(searchTxt));
//   } else {
//     this.rightListDropDownValues = this.rightListDropDownValuesUnChanged;
//   }
// }
// /**
//  * Set Selected Project Name (Right Table Drop Down List)...
//  * @param projectName
//  */
// selectProjectName(projectName: string): void {
//   if (projectName) {
//     this.currProjectName = projectName;
//   }
// }
