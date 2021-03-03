import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { FileUploadService } from './shared/file-upload.service';
import { MessagesService } from './shared/messages.service';
import { ValidatedIatiService } from './shared/validated-iati.service';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadUrlsComponent } from './upload-urls/upload-urls.component';
import { ValidateResultComponent } from './validate-result/validate-result.component';
import { ValidateComponent } from './validate/validate.component';


const routes: Routes = [
  { path: '', component: ValidateComponent },
  { path: ':id', component: ValidateResultComponent },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    SharedModule
  ],
  declarations: [
    ValidateComponent,
    UploadFileComponent,
    ValidateResultComponent,
    UploadUrlsComponent,
  ],
  providers: [
    FileUploadService,
    MessagesService,
    ValidatedIatiService
  ]
})
export class ValidateIatiModule { }
