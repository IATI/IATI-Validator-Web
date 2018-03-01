import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationsListItemComponent } from './organisations-list-item.component';

describe('OrganisationsListItemComponent', () => {
  let component: OrganisationsListItemComponent;
  let fixture: ComponentFixture<OrganisationsListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganisationsListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
