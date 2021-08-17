import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    private activateRoute: ActivatedRoute, private loader: LoaderService, private router: Router) {
    this.activateRoute
      .params
      .subscribe(params => {
        if ('name' in params) {
          this.name = params['name'];
        } else {
          this.router.navigate(['/404dqf']);
        }
      },
      error => this.error = error);
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
        },
        error => this.error = error,
        () => {
          if (this.organisationData === undefined) {
            this.organisationData = {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              org_id: '',
              name: '',
              description: 'No organisation found with name "' + name + '"',
              title: 'Organisation Not Found',
              state: '',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              image_url: '',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              country_code: '',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              iati_id: '',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              package_count: null,
              workspaces: [],
              documents: null,
            };
          }
          this.loader.hide();
        }
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
