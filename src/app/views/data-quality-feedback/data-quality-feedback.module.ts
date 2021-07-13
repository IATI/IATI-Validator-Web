import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GtagModule } from 'angular-gtag';


import { DataQualityFeedbackService } from './shared/data-quality-feedback.service';
import { OrganisationService } from 'src/app/organisation/shared/organisation.service';
import { MainComponent } from './main/main.component';
import { FilterSeverityComponent } from './filter-severity/filter-severity.component';
import { FilterSourceComponent } from './filter-source/filter-source.component';
import { FilterTypeComponent } from './filter-type/filter-type.component';
import { FeedbackGroupComponent } from './feedback-group/feedback-group.component';
import { FeedbackItemComponent } from './feedback-item/feedback-item.component';
import { CheckboxComponent } from './shared/checkbox/checkbox.component';
import { FilterCategoryComponent } from './filter-category/filter-category.component';
import { FilterTypeMessageComponent } from './filter-type-message/filter-type-message.component';
import { FilterTypeSeverityComponent } from './filter-type-severity/filter-type-severity.component';
import { FilterSeverityItemComponent } from './filter-severity-item/filter-severity-item.component';
import { MainReportInfoComponent } from './main-report-info/main-report-info.component';
import { SharedModule } from './../../shared/shared.module';
import { SingleFeedbackComponent } from './single-feedback/single-feedback.component';
import { IatiInfoComponent } from './iati-info/iati-info.component';
import { ValidateIatiModule } from '../../validate-iati/validate-iati.module';
import { MultiFeedbackComponent } from './multi-feedback/multi-feedback.component';

const routes: Routes = [
  { path: 'files/:id', component: MainComponent },
  { path: '', redirectTo: '/404dqf' , pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbModule,
    SharedModule,
    ValidateIatiModule,
    GtagModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    MainComponent,
    FilterSeverityComponent,
    FilterSourceComponent,
    FilterTypeComponent,
    FeedbackGroupComponent,
    FeedbackItemComponent,
    MultiFeedbackComponent,
    CheckboxComponent,
    FilterCategoryComponent,
    FilterTypeMessageComponent,
    FilterTypeSeverityComponent,
    FilterSeverityItemComponent,
    MainReportInfoComponent,
    SingleFeedbackComponent,
    IatiInfoComponent],
    providers: [DataQualityFeedbackService, OrganisationService]
})
export class DataQualityFeedbackModule { }
