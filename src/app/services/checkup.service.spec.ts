import { TestBed } from '@angular/core/testing';

import { CheckupService } from './checkup.service';

describe('CheckupService', () => {
  let service: CheckupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
