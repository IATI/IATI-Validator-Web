import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTypeMessageComponent } from './filter-type-message.component';

describe('FilterTypeMessageComponent', () => {
  let component: FilterTypeMessageComponent;
  let fixture: ComponentFixture<FilterTypeMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTypeMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTypeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
