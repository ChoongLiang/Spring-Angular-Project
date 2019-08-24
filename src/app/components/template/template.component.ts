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
    console.log(this.fieldForm);
    console.log(fieldsArray.length);
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
    updateAllFormula();
    // this.isFormulaValid.splice(i, 1);
  }

  updateAllFormula() {

  }

  onSubmit() {

  }

  getControls() {
    return (this.fieldForm.get('fields') as FormArray).controls;
  }
  // onFormulaChange(i: number, event: Event) {
  //   let isValidFormula = true;
  //   for (const partOfFormula of (this.fieldForm.get('fields') as FormArray).controls[i].get('formula').value.split('*')) {
  //     let matchFound = false;
  //     for (let index = 0; index < (this.fieldForm.get('fields') as FormArray).length; index++) {
  //         if ((this.fieldForm.get('fields') as FormArray).controls[index].get('field').value
  //             === partOfFormula.trim()) {
  //             matchFound = true;
  //             break;
  //         }
  //     }
  //     if (!matchFound) {
  //         isValidFormula = false;
  //         break;
  //     }
  //   }
  //   this.isFormulaValid[i] = isValidFormula;
  // }
  //
  // isTouched(i: number) {
  //   return (this.fieldForm.get('fields') as FormArray).controls[i].get('formula').touched;
  // }
}
