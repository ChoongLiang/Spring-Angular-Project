import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormulaService } from 'src/app/services/formula.service';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})
export class FormulaComponent implements OnInit {
  private projects: Object;
  private projectNames: string[] = [];

  constructor(private http: HttpClient, private formulaService: FormulaService) { }

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
  }

}
