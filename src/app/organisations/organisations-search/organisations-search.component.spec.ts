import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationsSearchComponent } from './organisations-search.component';

describe('OrganisationsSearchComponent', () => {
  let component: OrganisationsSearchComponent;
  let fixture: ComponentFixture<OrganisationsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
