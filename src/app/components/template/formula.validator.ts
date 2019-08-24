import {AbstractControl, FormArray, FormGroup, ValidatorFn} from '@angular/forms';

export function ValidateFormula(fieldForm: FormGroup, i: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let isValidFormula = true;
    if (control.value === null) {
      return null;
    }
    for (const partOfFormula of control.value.split('*')) {
      let matchFound = false;
      for (let index = 0; index < (fieldForm.get('fields') as FormArray).length; index++) {
        if ((fieldForm.get('fields') as FormArray).controls[index].get('field').value
          === partOfFormula.trim()) {
          matchFound = true;
          break;
        }
      }
      if (!matchFound) {
        isValidFormula = false;
        break;
      }
    }
    if (!isValidFormula) {
      return {invalidFormula: true};
    }
    return null;
  };
}
