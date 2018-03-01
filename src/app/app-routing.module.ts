import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { HomeComponent  } from './home/home.component';
import { OrganisationsComponent } from './organisations/organisations/organisations.component';
import { OrganisationComponent } from './organisation/organisation/organisation.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  // TODO: make lazy loading
  {path: 'organisations', component: OrganisationsComponent, pathMatch: 'full'},

  {path: 'organisation', loadChildren: 'app/organisation/organisation.module#OrganisationModule'},
  {path: 'view', loadChildren: 'app/views/views.module#ViewsModule'},
  {path: 'validate', loadChildren: 'app/validate-iati/validate-iati.module#ValidateIatiModule'},

  // Lazy loading Dashboard
    // {path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule'},
    // {path: 'contacts', loadChildren: '../contacts/contacts.module#ContactsModule'},


    // Catch all route
    // TODO: 404 pagina
    {path: '**', component: HomeComponent}

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
