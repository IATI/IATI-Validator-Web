import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationsListComponent } from './organisations-list.component';

describe('OrganisationsListComponent', () => {
  let component: OrganisationsListComponent;
  let fixture: ComponentFixture<OrganisationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
