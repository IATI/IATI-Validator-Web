import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateResultComponent } from './validate-result.component';

describe('ValidateResultComponent', () => {
  let component: ValidateResultComponent;
  let fixture: ComponentFixture<ValidateResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
