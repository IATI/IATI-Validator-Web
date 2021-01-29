import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { AboutComponent } from './views/data-quality-feedback/about/about.component';

// import { OrganisationsComponent } from './organisations/organisations/organisations.component';
// import { OrganisationComponent } from './organisation/organisation/organisation.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  // Lazy loading feature moduels
  { path: 'organisations', loadChildren: () => import('./organisations/organisations.module').then(m => m.OrganisationsModule) },
  // {path: 'organisation', loadChildren: 'app/organisation/organisation.module#OrganisationModule'},
  // {path: 'view/dqf', loadChildren: 'app/views/data-quality-feedback/data-quality-feedback.module#DataQualityFeedbackModule'},
  // {path: 'validate', loadChildren: 'app/validate-iati/validate-iati.module#ValidateIatiModule'},
  // {path: 'about', component: AboutComponent},
  // Catch all route
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
