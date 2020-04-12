import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadUrlsComponent } from './upload-urls.component';

describe('UploadUrlsComponent', () => {
  let component: UploadUrlsComponent;
  let fixture: ComponentFixture<UploadUrlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadUrlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
