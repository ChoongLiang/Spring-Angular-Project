import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Feature } from 'src/app/models/Feature';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-feature-dialog',
  templateUrl: './feature-dialog.component.html',
  styleUrls: ['./feature-dialog.component.css']
})
export class FeatureDialogComponent {

  options: FormGroup;
  types: string[] = ['Text', 'Number', 'Formula'];

  constructor(private dialogRef: MatDialogRef<FeatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Feature, formBuilder: FormBuilder) {
      this.options = formBuilder.group({
        name: new FormControl(),
        type: 'Text',
        content: new FormControl()
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}