import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SslComponent } from './ssl.component';

describe('SslComponent', () => {
  let component: SslComponent;
  let fixture: ComponentFixture<SslComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SslComponent]
    });
    fixture = TestBed.createComponent(SslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
