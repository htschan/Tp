import { TestBed, inject } from '@angular/core/testing';

import { PunchService } from './punch.service';

describe('PunchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PunchService]
    });
  });

  it('should be created', inject([PunchService], (service: PunchService) => {
    expect(service).toBeTruthy();
  }));
});
