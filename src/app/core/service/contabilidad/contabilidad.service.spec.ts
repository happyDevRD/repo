import { TestBed } from '@angular/core/testing';

import { ContabilidadService } from './contabilidad.service';

describe('ContabilidadService', () => {
  let service: ContabilidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContabilidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
