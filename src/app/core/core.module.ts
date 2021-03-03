import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GtagModule } from 'angular-gtag';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';
import { LogPublishersService } from './logging/log-publishers.service';
import { LogService } from './logging/log.service';
import { throwIfAlreadyLoaded } from './module-import-guard';


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    GtagModule,
  ],
  exports: [
    LoaderComponent
  ],
  declarations: [
    LoaderComponent
  ],
  providers: [
    LogService,
    LogPublishersService,
    LoaderService],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
