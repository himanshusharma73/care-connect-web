import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckupFormComponent } from './checkup-form.component';

describe('CheckupFormComponent', () => {
  let component: CheckupFormComponent;
  let fixture: ComponentFixture<CheckupFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckupFormComponent]
    });
    fixture = TestBed.createComponent(CheckupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
