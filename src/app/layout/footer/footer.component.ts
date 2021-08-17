import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { VersionService } from '../shared/version.service';
import { LogService } from './../../core/logging/log.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  webVersion = '';
  servicesVersion = '';
  apiVersion= '';
  gitHubURL = 'https://github.com';
  repoMap = {
    web: 'IATI/IATI-Validator-Web',
    services: 'IATI/validator-services',
    api: 'IATI/js-validator-api'
  };
  constructor(private versionService: VersionService, private logger: LogService) { }

  ngOnInit() {
    this.webVersion = environment.version;

    this.versionService.getServicesVersion().subscribe(data => {
      this.servicesVersion = data;
    },
    error => this.logger.error(error),
     () => {
       if (this.servicesVersion === undefined) {
         this.servicesVersion = 'X.X.X';
       }
     });

    this.versionService.getValidatorVersion().subscribe(data => {
      this.apiVersion = data;
    },
    error => this.logger.error(error),
     () => {
       if (this.servicesVersion === undefined) {
         this.servicesVersion = 'X.X.X';
       }
     });
  }

  getReleaseLink(product: string, version: string) {
    if (product in this.repoMap) {
      if (environment.production) {
        return this.gitHubURL + '/' + this.repoMap[product] + '/releases/tag/v' + version;
      }
      return this.gitHubURL + '/' + this.repoMap[product];
    }
    return '';
  }
}
