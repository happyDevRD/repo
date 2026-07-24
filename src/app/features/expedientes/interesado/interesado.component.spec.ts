import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresadoComponent } from './interesado.component';

describe('InteresadoComponent', () => {
  let component: InteresadoComponent;
  let fixture: ComponentFixture<InteresadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteresadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteresadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
