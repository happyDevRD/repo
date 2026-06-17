import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarEntradaComponent } from './generar-entrada.component';

describe('GenerarEntradaComponent', () => {
  let component: GenerarEntradaComponent;
  let fixture: ComponentFixture<GenerarEntradaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarEntradaComponent]
    });
    fixture = TestBed.createComponent(GenerarEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
