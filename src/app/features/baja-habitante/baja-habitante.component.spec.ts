import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaHabitanteComponent } from './baja-habitante.component';

describe('BajaHabitanteComponent', () => {
  let component: BajaHabitanteComponent;
  let fixture: ComponentFixture<BajaHabitanteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BajaHabitanteComponent]
    });
    fixture = TestBed.createComponent(BajaHabitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
