import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibosPendientesComponent } from './recibos-pendientes.component';

describe('RecibosPendientesComponent', () => {
  let component: RecibosPendientesComponent;
  let fixture: ComponentFixture<RecibosPendientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecibosPendientesComponent]
    });
    fixture = TestBed.createComponent(RecibosPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
