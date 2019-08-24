import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureDialogComponent } from './feature-dialog.component';

describe('FeatureDialogComponent', () => {
  let component: FeatureDialogComponent;
  let fixture: ComponentFixture<FeatureDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
