import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSeverityItemComponent } from './filter-severity-item.component';

describe('FilterSeverityItemComponent', () => {
  let component: FilterSeverityItemComponent;
  let fixture: ComponentFixture<FilterSeverityItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSeverityItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSeverityItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
