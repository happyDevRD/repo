import { TestBed } from '@angular/core/testing';

import { TemaDocumentoService } from './tema-documento.service';

describe('TemaDocumentoService', () => {
  let service: TemaDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemaDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
