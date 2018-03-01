import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataQualityFeedbackComponent } from './data-quality-feedback.component';

describe('DataQualityFeedbackComponent', () => {
  let component: DataQualityFeedbackComponent;
  let fixture: ComponentFixture<DataQualityFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataQualityFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataQualityFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
