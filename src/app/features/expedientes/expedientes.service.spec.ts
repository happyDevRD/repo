import { TestBed } from '@angular/core/testing';

import { ExpedientesService } from './expedientes.service';

describe('ExpedientesService', () => {
  let service: ExpedientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpedientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
