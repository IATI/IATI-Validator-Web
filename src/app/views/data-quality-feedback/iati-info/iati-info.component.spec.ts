import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IatiInfoComponent } from './iati-info.component';

describe('IatiInfoComponent', () => {
  let component: IatiInfoComponent;
  let fixture: ComponentFixture<IatiInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IatiInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IatiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
