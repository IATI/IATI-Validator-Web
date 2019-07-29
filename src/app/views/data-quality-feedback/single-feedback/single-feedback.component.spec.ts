import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlFeedbackComponent } from './single-feedback.component';

describe('XmlFeedbackComponent', () => {
  let component: XmlFeedbackComponent;
  let fixture: ComponentFixture<XmlFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmlFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
