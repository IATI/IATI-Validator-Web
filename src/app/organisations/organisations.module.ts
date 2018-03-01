import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { OrganisationsComponent } from './organisations/organisations.component';
import { OrganisationsListComponent } from './organisations-list/organisations-list.component';
import { OrganisationsListItemComponent } from './organisations-list-item/organisations-list-item.component';
import { OrganisationsSearchComponent } from './organisations-search/organisations-search.component';

import { OrganisationsService } from './shared/organisations.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
  ],
  declarations: [
    OrganisationsComponent,
    OrganisationsListComponent,
    OrganisationsListItemComponent,
    OrganisationsSearchComponent],
  providers: [OrganisationsService]
})
export class OrganisationsModule { }
