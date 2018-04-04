import { TestBed, inject } from '@angular/core/testing';

import { ValidatedIatiService } from './validated-iati.service';

describe('ValidatedIatiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidatedIatiService]
    });
  });

  it('should be created', inject([ValidatedIatiService], (service: ValidatedIatiService) => {
    expect(service).toBeTruthy();
  }));
});
