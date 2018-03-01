import { TestBed, inject } from '@angular/core/testing';

import { OrganisationsService } from './organisations.service';

describe('OrganisationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganisationsService]
    });
  });

  it('should be created', inject([OrganisationsService], (service: OrganisationsService) => {
    expect(service).toBeTruthy();
  }));
});
