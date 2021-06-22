import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from './layout/layout.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './views/data-quality-feedback/about/about.component';
import { GtagModule } from 'angular-gtag';
import { OrganisationService } from './organisation/shared/organisation.service';
import {GoogleAnalyticsService} from './google-analytics.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent,
  ],
  imports: [
    GtagModule.forRoot({ trackingId: 'UA-110230511-9', trackPageviews: true }),
    BrowserModule,
    NgbModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    LayoutModule,
    AppRoutingModule,
  ],
  providers: [
    OrganisationService,
    GoogleAnalyticsService,
  ],
  exports: [
    CoreModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
