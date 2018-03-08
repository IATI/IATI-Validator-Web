import { TestBed, inject } from '@angular/core/testing';

import { DataQualityFeedbackService } from './data-quality-feedback.service';

describe('DataQualityFeedbackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataQualityFeedbackService]
    });
  });

  it('should be created', inject([DataQualityFeedbackService], (service: DataQualityFeedbackService) => {
    expect(service).toBeTruthy();
  }));
});
