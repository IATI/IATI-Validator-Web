import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerCircleComponent } from './spinner-circle/spinner-circle.component';

/*
  Do declare components, directives, and pipes in a shared module when those items will be
  re-used and referenced by the components declared in other feature modules.
  Avoid providing services in shared modules. Services are usually singletons that are
  provided once for the entire application or in a particular feature module.
  https://angular.io/guide/styleguide#shared-feature-module
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    SpinnerComponent,
    SpinnerCircleComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    SpinnerComponent,
    SpinnerCircleComponent
  ]
})
export class SharedModule { }
