import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllnessFormComponent } from './illness-form.component';

describe('IllnessFormComponent', () => {
  let component: IllnessFormComponent;
  let fixture: ComponentFixture<IllnessFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IllnessFormComponent]
    });
    fixture = TestBed.createComponent(IllnessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
