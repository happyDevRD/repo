import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionFormComponent } from './liquidacion-form.component';

describe('LiquidacionFormComponent', () => {
  let component: LiquidacionFormComponent;
  let fixture: ComponentFixture<LiquidacionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiquidacionFormComponent]
    });
    fixture = TestBed.createComponent(LiquidacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
