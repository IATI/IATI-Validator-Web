import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSourceComponent } from './filter-source.component';

describe('FilterSourceComponent', () => {
  let component: FilterSourceComponent;
  let fixture: ComponentFixture<FilterSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
