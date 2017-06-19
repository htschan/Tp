/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TimepuncherService } from './timepuncher.service';

describe('TimepuncherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimepuncherService]
    });
  });

  it('should ...', inject([TimepuncherService], (service: TimepuncherService) => {
    expect(service).toBeTruthy();
  }));
});
