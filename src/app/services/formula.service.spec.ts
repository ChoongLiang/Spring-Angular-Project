import { TestBed } from '@angular/core/testing';

import { FormulaService } from './formula.service';

describe('FormulaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormulaService = TestBed.get(FormulaService);
    expect(service).toBeTruthy();
  });
});
