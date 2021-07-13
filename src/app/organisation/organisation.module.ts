import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';
import { OrganisationComponent } from './organisation/organisation.component';
import { OrganisationService } from './shared/organisation.service';
import { OrganisationsService } from '../organisations/shared/organisations.service';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentListItemComponent } from './document-list-item/document-list-item.component';

const routes: Routes = [
  { path: '', component: OrganisationComponent },
  { path: ':name', component: OrganisationComponent },
  { path: '', redirectTo: '/404dqf', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    OrganisationService,
    OrganisationsService
  ],
  declarations: [
    OrganisationComponent,
    DocumentListComponent,
    DocumentListItemComponent
  ]
})
export class OrganisationModule { }
