import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormulaService } from 'src/app/services/formula.service';
import { Feature } from 'src/app/models/Feature';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  fieldForm: FormGroup;
  features: Feature[];
  displayedRows: string[] = [];
  constructor(private formulaService: FormulaService) { }
  checked = new Map();
  checkedFeatures: string[] = [];
  projectName: string;

  ngOnInit() {
    const surveyFields = new FormArray([]);
    this.fieldForm = new FormGroup({ fields: surveyFields });
    this.features = this.formulaService.getFeatures();
    console.log(this.features);
    this.parseFeatures();
    this.formulaService.saveProjectName(this.projectName);
  }

  parseFeatures() {
    for (let feature of this.features) {
      this.displayedRows.push(feature['name']);
      this.projectName = feature['project']['name'];
    }
  }

  saveHandler() {
    this.checkedFeatures = [];
    for (let i of this.displayedRows) {
      this.checked.set(i, (<HTMLInputElement>document.getElementById(i)).checked);
      if ((<HTMLInputElement>document.getElementById(i)).checked) {
        this.checkedFeatures.push(i);
      }
    }
    this.formulaService.saveCheckedFeatures(this.checkedFeatures);
    console.log(this.checked);
  }



  onAdd() {
    const fieldsArray = this.fieldForm.get('fields') as FormArray;
    fieldsArray.push(
      new FormGroup({
        field: new FormControl(null, Validators.required),
        type: new FormControl('number', Validators.required),
        formula: new FormControl(null, Validators.required)
      })
    );
  }

  onDelete(i: number) {
    (this.fieldForm.get('fields') as FormArray).removeAt(i);
    // console.log((this.fieldForm.get('fields') as FormArray).get('type'));
    console.log((this.fieldForm.get('fields') as FormArray));
  }
  // returnValue(){
  //
  // }

  onSubmit() {

  }

  getControls() {
    return (this.fieldForm.get('fields') as FormArray).controls;
  }

}
