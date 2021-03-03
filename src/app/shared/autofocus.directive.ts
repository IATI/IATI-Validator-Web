import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {

  constructor(elementRef: ElementRef) {
    elementRef.nativeElement.focus();
  }

}
