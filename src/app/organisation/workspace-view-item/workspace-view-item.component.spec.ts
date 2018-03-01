import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceViewItemComponent } from './workspace-view-item.component';

describe('WorkspaceViewItemComponent', () => {
  let component: WorkspaceViewItemComponent;
  let fixture: ComponentFixture<WorkspaceViewItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceViewItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
