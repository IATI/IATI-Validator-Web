import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogService } from './logging/log.service';
import { LogPublishersService } from './logging/log-publishers.service';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
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
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
 }
