import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTypeSeverityComponent } from './filter-type-severity.component';

describe('FilterTypeSeverityComponent', () => {
  let component: FilterTypeSeverityComponent;
  let fixture: ComponentFixture<FilterTypeSeverityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTypeSeverityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTypeSeverityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
