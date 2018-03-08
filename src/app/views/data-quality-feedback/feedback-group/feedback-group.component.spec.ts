import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackGroupComponent } from './feedback-group.component';

describe('FeedbackGroupComponent', () => {
  let component: FeedbackGroupComponent;
  let fixture: ComponentFixture<FeedbackGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
