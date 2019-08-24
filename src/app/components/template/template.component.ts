import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormulaService } from 'src/app/services/formula.service';
import { Feature } from 'src/app/models/Feature';
import { Resource } from 'src/app/models/Resource';
import { Component, OnInit } from '@angular/core';
import { ValidateFormula } from './formula.validator';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  fieldForm: FormGroup;
  features: Feature[];
  resources: Resource[];
  displayedRows: string[] = [];
  constructor(private formulaService: FormulaService) { }
  // checked = new Map();
  checkedFeatures: string[] = [];
  projectName: string;

  ngOnInit() {
    const surveyFields = new FormArray([]);
    this.fieldForm = new FormGroup({ fields: surveyFields });
    this.features = this.formulaService.getFeatures();
    this.resources = this.formulaService.getResources();
    console.log(this.resources);
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
    for (let j = 0; j < this.resources.length; j++) {
      for (let i = 0; i < this.displayedRows.length; i++) {
        // this.checked.set(i, (<HTMLInputElement>document.getElementById(i)).checked);
        let checked = (<HTMLInputElement>document.getElementById(this.displayedRows[i])).checked
        if (checked) {
          this.checkedFeatures.push(this.displayedRows[i]);
        } else if (this.resources[j].features[i] !== undefined && this.resources[j].features[i].name == this.displayedRows[i]) {
          delete this.resources[j].features[i];
        }
      }
    }
    console.log(this.resources);
    let unique = [...new Set(this.checkedFeatures)];
    this.formulaService.saveCheckedFeatures(unique);
    this.formulaService.saveResources(this.resources);

  }

  onAdd() {
    const fieldsArray = this.fieldForm.get('fields') as FormArray;
    fieldsArray.push(
      new FormGroup({
        field: new FormControl(null, Validators.required),
        type: new FormControl('number', Validators.required),
        formula: new FormControl(null,
          [Validators.required,
          ValidateFormula(this.fieldForm,
            fieldsArray.length)])
      })
    );
  }

  onDelete(i: number) {
    (this.fieldForm.get('fields') as FormArray).removeAt(i);
    // this.isFormulaValid.splice(i, 1);
    this.updateAllFormulaValidity();
  }

  updateAllFormulaValidity() {
    for (let index = 0; index < (this.fieldForm.get('fields') as FormArray).length; index++) {
      (this.fieldForm.get('fields') as FormArray).controls[index].get('formula').updateValueAndValidity();
    }

  onSubmit() {

  }

  getControls() {
    return (this.fieldForm.get('fields') as FormArray).controls;
  }
}
