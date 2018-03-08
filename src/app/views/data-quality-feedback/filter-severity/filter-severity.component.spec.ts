import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSeverityComponent } from './filter-severity.component';

describe('FilterSeverityComponent', () => {
  let component: FilterSeverityComponent;
  let fixture: ComponentFixture<FilterSeverityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSeverityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSeverityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
