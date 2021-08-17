import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './views/data-quality-feedback/about/about.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  // Lazy loading feature moduels
  { path: 'organisations', loadChildren: () => import('./organisations/organisations.module').then(m => m.OrganisationsModule) },
  { path: 'organisation', loadChildren: () => import('./organisation/organisation.module').then(m => m.OrganisationModule) },
  {
    path: 'view/dqf',
    loadChildren: () => import('./views/data-quality-feedback/data-quality-feedback.module')
      .then(m => m.DataQualityFeedbackModule)
  },
  {path: 'validate', loadChildren: () => import('./validate-iati/validate-iati.module').then(m => m.ValidateIatiModule) },
  {path: 'about', component: AboutComponent},
  // Catch all route
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
