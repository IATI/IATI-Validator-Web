import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerCircleComponent } from './spinner-circle.component';

describe('SpinnerCircleComponent', () => {
  let component: SpinnerCircleComponent;
  let fixture: ComponentFixture<SpinnerCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
