import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormulaService } from 'src/app/services/formula.service';
import { Feature } from 'src/app/models/Feature';
import { Resource } from 'src/app/models/Resource';
import { Component, OnInit } from '@angular/core';
import { ValidateFormula } from './formula.validator';
import { RouteReuseStrategy } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  fieldForm: FormGroup;
  features: Feature[];
  displayedRows: string[] = [];
  constructor(private formulaService: FormulaService,
    private router: Router) { }
  // checked = new Map();
  checkedFeatures: string[] = [];
  projectName: string;

  ngOnInit() {
    this.features = this.formulaService.getFeatures();
    console.log('hehe');
    console.log(this.features);
    // this.formulaService.saveProjectName(this.projectName);
    const surveyFields = new FormArray([]);
    this.fieldForm = new FormGroup({ fields: surveyFields });
    let feature: Feature;
    if (this.features !== undefined) {
      for (let index = 0; index < this.features.length; index++) {
        surveyFields.push(
          new FormGroup({
            name: new FormControl(this.features[index].name, Validators.required),
            type: new FormControl(this.features[index].type, Validators.required),
            content: new FormControl(this.features[index].content,
            [Validators.required,
            ValidateFormula(this.fieldForm,
              surveyFields.length)])
          })
        )
      }
    }
    this.router.navigateByUrl('/formula')
    


  }

  onAdd() {
    const fieldsArray = this.fieldForm.get('fields') as FormArray;
    fieldsArray.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        type: new FormControl('number', Validators.required),
        content: new FormControl(null,
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
      (this.fieldForm.get('fields') as FormArray).controls[index].get('content').updateValueAndValidity();

    }
  }
  onSubmit() {
    const tempFeatures = this.fieldForm.value.fields as Feature[];
    let tempFeature: Feature;
    for (tempFeature of tempFeatures) {
      this.features.push(tempFeature);
    }
    this.formulaService.updateFeatures(this.features);
  }
  getControls() {
    return (this.fieldForm.get('fields') as FormArray).controls;
  }

}
