import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoginFormComponent } from './app-login-form.component';

describe('AppLoginFormComponent', () => {
  let component: AppLoginFormComponent;
  let fixture: ComponentFixture<AppLoginFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppLoginFormComponent]
    });
    fixture = TestBed.createComponent(AppLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
