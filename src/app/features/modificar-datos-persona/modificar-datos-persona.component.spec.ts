import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarDatosPersonaComponent } from './modificar-datos-persona.component';

describe('ModificarDatosPersonaComponent', () => {
  let component: ModificarDatosPersonaComponent;
  let fixture: ComponentFixture<ModificarDatosPersonaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModificarDatosPersonaComponent]
    });
    fixture = TestBed.createComponent(ModificarDatosPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
