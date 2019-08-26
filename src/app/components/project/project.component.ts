// import { Component, OnInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { Project } from 'src/app/models/Project';
// import { ReplaySubject, Subject } from 'rxjs';
// import { SideBarService } from 'src/app/services/side-bar.service';
// import { FormulaService } from 'src/app/services/formula.service';
// import { ProjectService } from 'src/app/services/data/project.service';
// import { ResourceService } from 'src/app/services/data/resource.service';

// @Component({
//   selector: 'app-project',
//   templateUrl: './project.component.html',
//   styleUrls: ['./project.component.css']
// })
// export class ProjectComponent implements OnInit {
//   public projectCtrl: FormControl = new FormControl();
//   public projectFilterCtrl: FormControl = new FormControl();
//   private projectNames: Project[] = [];
//   private projects: object;
//   private projectId: number;
//   private projectMap = new Map();
// // 
//   /** list of Projects filtered by search keyword */
//   public filteredProjects: ReplaySubject<Project[]> = new ReplaySubject<Project[]>(1);

//   /** Subject that emits when the component has been destroyed. */
//   protected _onDestroy = new Subject<void>();

//   displayedColumns: string[] = ['resourceName', 'resourceCode'];
//   dataSource = [];
//   resources = [];


//   constructor(private sideBarService: SideBarService, private formulaService: FormulaService,
//     private projectService: ProjectService, private resourceService: ResourceService) { }

//   ngOnInit() {
//     this.getProjects();

//     this.sideBarService.status = true;

//     this.projectCtrl.valueChanges.subscribe(() => {
//       this.formulaService.clearCheckedFeatures();
//       console.log('inside value changes');
//       this.displayedColumns = ['resourceName', 'resourceCode'];
//       this.resources = [];
//       this.projectId = this.projectMap.get(this.projectCtrl.value);
//       this.getProjectName();
//       this.getResource();
//     },
//       error => console.log(error),
//       () => {
//         console.log('COMPLETED');
//       })
//   }

//   getProjects() {
//     this.formulaService.getProjects().subscribe(
//       res => {
//         this.projects = res;
//         for (let i = 0; i < this.projects['length']; i++) {
//           this.projectNames.push(this.projects[i]);
//           this.projectMap.set(this.projects[i]['name'], res[i]['id']);
//         }
//       },
//       err => console.log(err),
//       () => {
//         console.log('completed getting projects');
//         console.log(this.projectNames);
//         console.log(this.projectMap);
//         // this.projectId = this.projectMap.get(this.formulaService.getProjectName());
//         // this.getProjectName();
//         // this.resources = this.formulaService.getResources();
//         // console.log(this.resources);
//         // this.displayedColumns = this.displayedColumns.concat(this.formulaService.getCheckedFeatures());
//         // console.log(this.displayedColumns);
//         // this.dataSource = this.resources;
//         // this.formulaService.clearProjectName();
//       }
//     )
//   }

//   getProjectName() {
//     this.projectService.setParam("displayall");
//     this.projectService.getProject().subscribe(
//       project => {
//         this.projectService.setProjectName(project.name);
//       },
//       error => console.log(error),
//       () => console.log("Project loaded.")
//     )
//   }

//   getResource() {
//     this.resourceService.setParam("displayResource");
//     this.resourceService.getResources().subscribe(
//       resources => {
//         for (let resource of resources) {
//           if (resource.project.id === this.projectId) {
//             this.resources.push(resource);
//           }
//         }
//         this.formulaService.saveResources(this.resources);
//       },
//       error => console.log(error),
//       () => {
//         console.log("Resources loaded.");
//         this.dataSource = this.resources;
//       }
//     )
//   }

// }
import { Component, OnInit, ViewChild } from '@angular/core';

import { SideBarService } from 'src/app/services/side-bar.service';
import { ProjectService } from 'src/app/services/data/project.service';
import { ResourceService } from 'src/app/services/data/resource.service';
import { FeatureService } from 'src/app/services/data/feature.service';
import { FeatureValueService } from 'src/app/services/data/feature-value.service';

import { SelectionModel } from '@angular/cdk/collections';

import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ResourceComponent } from '../resource/resource.component';

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
//   selected: false;
// }
// export interface Element {
//   sdeptname:any;  
// }

// const ELEMENT_DATA: Element[] = [];
// const ELEMENT_DATA : PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', selected: false},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', selected: false},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', selected: false},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', selected: false},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B', selected: false},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', selected: false},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', selected: false},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', selected: false},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', selected: false},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', selected: false},
// ];

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: Element[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];


@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
  })

export class ProjectComponent implements OnInit {

  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //dataSource = ELEMENT_DATA;

  projects: any[]

  // Dummy Values For Right Drop Down List ... 
  rightListDropDownValues = [
    { projectId: 1, projectName: 'project 1' },
    { projectId: 2, projectName: 'testing 2' },
    { projectId: 3, projectName: 'project 3' }
  ];
  rightListDropDownValuesUnChanged = [
    { projectId: 1, projectName: 'project 1' },
    { projectId: 2, projectName: 'testing 2' },
    { projectId: 3, projectName: 'project 3' }
  ];
  // Picking Up The First Array Value (By Default)....
  currProjectName = this.rightListDropDownValues[0].projectName;
  
  private resources: Object[];
  private features: Object[];
  private featureValues: Object[];
  private resourceFeatureValueKeys: Object[];

  position: any;
  selectedAll: any;
/***********************************************/
sdeptname:any;  
checkedData = [];
/***********************************************/
  constructor(
    private sidebarService: SideBarService, 
    private projectService: ProjectService,
    private resourceService: ResourceService,
    private featureService: FeatureService,
    private featureValueService: FeatureValueService
    ) {  }

    
    dataFromResource: string;
     
     //retrieving data from resource component
    @ViewChild(ResourceComponent, {static:false}) n;

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

    // this.projects = this.projectService.activeProject;

    //retrieving data from resource component
   this.dataFromResource = this.n.dataSource.name[1];
 /*************************************************** */ 
    // const data = [
    //   {
    //     "sdeptname": "Administration"
    //   },
    //    {
    //     "sdeptname": "Administration1"
    //   },
    //   {
    //     "sdeptname": "Administration2"
    //   },
    //   {
    //     "sdeptname": "Administration3"
    //   },
    //   {
    //     "sdeptname": "Administration4"
    //   },
    //   {
    //     "sdeptname": "Administration6"
    //   },
    //   {
    //     "sdeptname": "Administration7"
    //   },
    //   {
    //     "sdeptname": "Administration8"
    //   }
    // ];

        // this.sdeptname = data;
        // this.dataSource.data = (data as Element[]);
        // this.checkedDataSource.data = this.data;  
  }
  
  displayedColumns = [ 'select','deptName'];
  data = Object.assign(ELEMENT_DATA);

  displayedColumns2 = ['select', 'position', 'name', 'weight', 'symbol'];
  displayedColumns3 = ['select', 'name', 'weight'];
  
  dataSource = new MatTableDataSource<Element>(this.data);
  selection = new SelectionModel<Element>(true, []);

  checkedDataSource = new MatTableDataSource<Element>(this.checkedData);
  checkedSelection = new SelectionModel<Element>(true, []);

  uncheckedData = this.data;

  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild('checkedpaginator', {static: false}) checkedpaginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.checkedDataSource.paginator = this.checkedpaginator;
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
       console.log(this.dataSource.data)
      this.selection.selected.forEach((k,item) => {

        //this.dataSource.data.splice(this.dataSource.data.indexOf(k),1); 
        this.checkedDataSource.data.push(k);
        
      });
       console.log(this.dataSource.data)
      this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
      this.checkedDataSource = new MatTableDataSource<Element>(this.checkedDataSource.data);
      this.selection.clear();
      //this.selection.deselect();
    }


/* Function to move row from table 2-->1 */

  moveToTableOne() {

    
      //console.log(this.checkedDataSource.data)
      this.selection.selected.forEach((k,item) => {

        this.checkedDataSource.data.splice(this.dataSource.data.indexOf(k),1); 
        //this.dataSource.data.push(k);
      });
      console.log(this.dataSource.data)
      this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
      this.checkedDataSource = new MatTableDataSource<Element>(this.checkedDataSource.data);
      //this.selection.deselect();
      this.selection.clear();
  }

  removeSelectedRows() {
    this.selection.selected.forEach(item => {
     let index: number = this.data.findIndex(d => d === item);
     console.log(this.data.findIndex(d => d === item));
     this.dataSource.data.splice(index,1);

     this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
     this.checkedDataSource = new MatTableDataSource<Element>(this.checkedDataSource.data);
    });
   this.selection = new SelectionModel<Element>(true, []);
 }



  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?  this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    console.log(this.data);
  }

  masterCheckedToggle() {
    this.isAllCheckedSelected()?
      this.checkedSelection.clear() : this.dataSource.data.forEach(row => this.checkedSelection.select(row));
  }

  /*********************************************************** */
  // selectAll() {
  //   for (var i = 0; i < this.dataSource.length; i++) {
  //     this.dataSource[i].selected = this.selectedAll;
  //   }
  // }
  // checkIfAllSelected() {
  //   this.selectedAll = this.dataSource.every(function(item:any) {
  //       return item.selected == true;
  //     })
  // }

  onSetToInactive(id:number){
    // this.projectService.setToInactive(id);
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
  /**
   * Moving Data From Left Table To Right Table //#endregion
   */
  moveDataToOtherTable = (): void => {
      if (this.selection && this.selection.selected) {
      this.selection.selected.forEach((val) => {
        this.checkedDataSource.data.push(val);
      });
      this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
      this.checkedDataSource = new MatTableDataSource<Element>(this.checkedDataSource.data);
      this.selection.clear();
    }
  }
  /**
   * Select All CheckBox Of Left Table ...
   * @param callFrom
   */
  selectAndUnSelectLeftRows = (callFrom: string): void => {
    if (callFrom === 'SA')  {
       this.dataSource.data.forEach(row => this.selection.select(row));
    } else if (callFrom === 'CS') {
      this.selection.clear();
    }
  }

  /**
   * Delete Right List ... 
   */
  trashRightList = () => this.checkedDataSource.data = [];

  /**
   * Search Project Name Right Table... 
   * @param searchTx 
   */
  filterProjectName(searchTxt: string): void {
     if (searchTxt) {
       this.rightListDropDownValues = this.rightListDropDownValues.filter(project => project.projectName.includes(searchTxt));
    } else {
       this.rightListDropDownValues = this.rightListDropDownValuesUnChanged;
    }
  }
  /**
   * Set Selected Project Name (Right Table Drop Down List)...
   * @param projectName 
   */
  selectProjectName(projectName: string): void {
    if (projectName) {
      this.currProjectName = projectName;
    }
  }
}











// import { Component, OnInit, Input } from '@angular/core';
// import { ResourceService } from 'src/app/services/data/resource.service';
// import { FeatureService } from 'src/app/services/data/feature.service';
// import { FeatureValueService } from 'src/app/services/data/feature-value.service';
// import { ProjectService } from 'src/app/services/data/project.service';
// import { SideBarService } from 'src/app/services/side-bar.service';
// import { Observable } from 'rxjs';
// import { PeriodicElement } from '../resource/resource.component';
// import { DataSource } from '@angular/cdk/table';

// @Component({
//   selector: 'app-project',
//   templateUrl: './project.component.html',
//   styleUrls: ['./project.component.css']
// })
// export class ProjectComponent implements OnInit, PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
//   displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
//   @Input() dataSource;

//   private resources: Observable<any>;
//   private features: Observable<any>;
//   private featureValues: Observable<any>;
//   private resourceFeatureValueKeys: Observable<any>;

//   constructor(
//     private sidebarService: SideBarService, 
//     private projectService: ProjectService,
//     private resourceService: ResourceService,
//     private featureService: FeatureService,
//     private featureValueService: FeatureValueService
//     ) { }
//   ngOnInit() {
//     this.resources=this.resourceService.getResources();
//     //console.log(this.resources);
//   }

//   moveToTable(){

//   }
// }
