import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  fieldForm: FormGroup;
  constructor() { }

  ngOnInit() {
    const surveyFields = new FormArray([]);
    this.fieldForm = new FormGroup({fields: surveyFields});
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
