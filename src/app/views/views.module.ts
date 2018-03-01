import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DataQualityFeedbackComponent } from './data-quality-feedback/data-quality-feedback.component';

const routes: Routes = [
  { path: 'dqf/:name', component: DataQualityFeedbackComponent },
  { path: '', redirectTo: '/404view' , pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
  declarations: [DataQualityFeedbackComponent]
})
export class ViewsModule { }
