import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { OrganisationComponent } from './organisation/organisation.component';
import { OrganisationService } from './shared/organisation.service';
import { WorkspaceListItemComponent } from './workspace-list-item/workspace-list-item.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceViewItemComponent } from './workspace-view-item/workspace-view-item.component';

const routes: Routes = [
  { path: '', component: OrganisationComponent },
  { path: ':name', component: OrganisationComponent },
  { path: ':organisation/ws/:workspace', component: WorkspaceComponent },
  { path: ':organisation/ws/:workspace/:version', component: WorkspaceComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [
    OrganisationService,
  ],
  declarations: [OrganisationComponent, WorkspaceListItemComponent, WorkspaceComponent, WorkspaceViewItemComponent]
})
export class OrganisationModule { }
