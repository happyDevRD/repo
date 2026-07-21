import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LiquidacionListComponent } from './liquidacion-list.component';
import { LiquidacionService } from '../../services/liquidacion.service';

describe('LiquidacionListComponent', () => {
  let component: LiquidacionListComponent;
  let fixture: ComponentFixture<LiquidacionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiquidacionListComponent],
      providers: [
        {
          provide: LiquidacionService,
          useValue: { listLiquidaciones: () => of([]) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(LiquidacionListComponent);
    component = fixture.componentInstance;
    component.idExped = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
