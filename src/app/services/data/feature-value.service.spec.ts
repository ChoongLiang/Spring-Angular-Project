import { TestBed } from '@angular/core/testing';

import { FeatureValueService } from './feature-value.service';

describe('FeatureValueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeatureValueService = TestBed.get(FeatureValueService);
    expect(service).toBeTruthy();
  });
});
