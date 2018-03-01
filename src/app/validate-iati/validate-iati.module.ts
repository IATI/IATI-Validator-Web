import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ValidateComponent } from './validate/validate.component';

const routes: Routes = [
  { path: '', component: ValidateComponent },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ValidateComponent]
})
export class ValidateIatiModule { }
