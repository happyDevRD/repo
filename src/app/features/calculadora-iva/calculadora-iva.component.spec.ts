import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraIvaComponent } from './calculadora-iva.component';

describe('CalculadoraIvaComponent', () => {
  let component: CalculadoraIvaComponent;
  let fixture: ComponentFixture<CalculadoraIvaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalculadoraIvaComponent]
    });
    fixture = TestBed.createComponent(CalculadoraIvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
