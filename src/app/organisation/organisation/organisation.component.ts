import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { OrganisationService } from './../shared/organisation.service';
import { Organisation } from '../../shared/organisation';
import { LoaderService } from './../../core/loader/loader.service';
import { LoaderState } from './../../core/loader/loader';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit, OnDestroy {
  isLoading = false;
  organisationData: Organisation;
  error: any;
  name = '';

  private loaderSubscription: Subscription | undefined;

  constructor(private organisationService: OrganisationService,
    private activateRoute: ActivatedRoute, private loader: LoaderService) {
    this.activateRoute
      .params
      .subscribe(params => {
        this.name = params['name'];
      });
  }

  async ngOnInit() {
    this.loaderSubscription = this.loader.loaderState
    .subscribe((state: LoaderState) => {
      this.isLoading = state.show;
    });
    this.loadOrganisation(this.name);
  }

  loadOrganisation(name: string) {
    this.loader.show();

    this.organisationService.getOrganisationAndDocuments(name)
      .subscribe(
        data => {
          this.organisationData = data;
          this.loader.hide();
        },
        error => this.error = error
      );
  }

  hasValidLogo(): boolean {
    if (this.organisationData !== undefined) {
      if ('image_url' in this.organisationData) {
        return (this.organisationData.image_url !== '');
      }
    }

    return false;
  }

  ngOnDestroy() {
  }

}
