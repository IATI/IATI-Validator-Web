import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { OrganisationsComponent } from './organisations/organisations.component';
import { OrganisationsListComponent } from './organisations-list/organisations-list.component';
import { OrganisationsListItemComponent } from './organisations-list-item/organisations-list-item.component';
import { OrganisationsSearchComponent } from './organisations-search/organisations-search.component';

import { OrganisationsService } from './shared/organisations.service';

const routes: Routes = [
  { path: '', component: OrganisationsComponent },
  { path: '', redirectTo: '/404dqf' , pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    OrganisationsComponent,
    OrganisationsListComponent,
    OrganisationsListItemComponent,
    OrganisationsSearchComponent],
  providers: [OrganisationsService]
})
export class OrganisationsModule { }
