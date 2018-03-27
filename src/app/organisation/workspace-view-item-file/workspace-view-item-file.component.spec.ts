import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceViewItemFileComponent } from './workspace-view-item-file.component';

describe('WorkspaceViewItemFileComponent', () => {
  let component: WorkspaceViewItemFileComponent;
  let fixture: ComponentFixture<WorkspaceViewItemFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceViewItemFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceViewItemFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
