import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GtagModule } from 'angular-gtag';
// import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    GtagModule,
  ],
  exports: [
    HeaderComponent,
    NavbarComponent,
    // FooterComponent
  ],
  // declarations: [HeaderComponent, NavbarComponent, FooterComponent],
  declarations: [HeaderComponent, NavbarComponent]
})
export class LayoutModule { }
