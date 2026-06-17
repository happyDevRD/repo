import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionListComponent } from './liquidacion-list.component';

describe('LiquidacionListComponent', () => {
  let component: LiquidacionListComponent;
  let fixture: ComponentFixture<LiquidacionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiquidacionListComponent]
    });
    fixture = TestBed.createComponent(LiquidacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
