import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ValidateComponent } from './validate/validate.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ValidateResultComponent } from './validate-result/validate-result.component';

const routes: Routes = [
  { path: '', component: ValidateComponent },
  { path: ':id', component: ValidateResultComponent },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
  ],
  declarations: [ValidateComponent, UploadFileComponent, ValidateResultComponent]
})
export class ValidateIatiModule { }
