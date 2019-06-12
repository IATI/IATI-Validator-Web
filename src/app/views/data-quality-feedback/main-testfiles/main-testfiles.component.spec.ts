import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTestfilesComponent } from './main-testfiles.component';

describe('MainTestfilesComponent', () => {
  let component: MainTestfilesComponent;
  let fixture: ComponentFixture<MainTestfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTestfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTestfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
