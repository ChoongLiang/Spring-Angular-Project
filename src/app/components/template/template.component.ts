import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidateFormula} from './formula.validator';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  fieldForm: FormGroup;
  // isFormulaValid: boolean[];
  constructor() { }

  ngOnInit() {
    const surveyFields = new FormArray([]);
    this.fieldForm = new FormGroup({fields: surveyFields});
    // this.isFormulaValid = [];
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
  }

  onSubmit() {

  }

  getControls() {
    return (this.fieldForm.get('fields') as FormArray).controls;
  }
}
