import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainReportInfoComponent } from './main-report-info.component';

describe('MainReportInfoComponent', () => {
  let component: MainReportInfoComponent;
  let fixture: ComponentFixture<MainReportInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainReportInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainReportInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
