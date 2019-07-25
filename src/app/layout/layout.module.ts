import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
  ],
  exports: [
    HeaderComponent,
    NavbarComponent,
    FooterComponent
  ],
  declarations: [HeaderComponent, NavbarComponent, FooterComponent],
})
export class LayoutModule { }
