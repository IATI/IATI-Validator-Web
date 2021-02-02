import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerCircleComponent } from './spinner-circle/spinner-circle.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AutofocusDirective } from './autofocus.directive';


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
    ReactiveFormsModule
  ],
  declarations: [
    SpinnerComponent,
    SpinnerCircleComponent,
    AutofocusDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    SpinnerCircleComponent,
    AutofocusDirective
  ]
})
export class SharedModule { }
