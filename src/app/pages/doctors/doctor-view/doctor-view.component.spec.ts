import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorViewComponent } from './doctor-view.component';

describe('DoctorViewComponent', () => {
  let component: DoctorViewComponent;
  let fixture: ComponentFixture<DoctorViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorViewComponent]
    });
    fixture = TestBed.createComponent(DoctorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
