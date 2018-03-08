import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MainComponent } from './main/main.component';
import { FilterSeverityComponent } from './filter-severity/filter-severity.component';
import { FilterCategoryComponent } from './filter-category/filter-category.component';
import { FilterTypeComponent } from './filter-type/filter-type.component';
import { FeedbackGroupComponent } from './feedback-group/feedback-group.component';
import { FeedbackItemComponent } from './feedback-item/feedback-item.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { CheckboxComponent } from './shared/checkbox/checkbox.component';

const routes: Routes = [
  { path: ':name', component: MainComponent },
  { path: '', redirectTo: '/404dqf' , pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    MainComponent,
    FilterSeverityComponent,
    FilterCategoryComponent,
    FilterTypeComponent,
    FeedbackGroupComponent,
    FeedbackItemComponent,
    FeedbackComponent,
    CheckboxComponent]
})
export class DataQualityFeedbackModule { }
