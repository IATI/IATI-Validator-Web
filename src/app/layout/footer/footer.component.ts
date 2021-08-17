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
  apiVersion!: '?';
  constructor(private versionService: VersionService, private logger: LogService) { }

  ngOnInit() {
    this.webVersion = environment.version;

    this.versionService.getServicesVersion().subscribe(data => {
      console.log(data);
      this.servicesVersion = data;
    },
    error => this.logger.error(error),
     () => {
       if (this.servicesVersion === undefined) {
         this.servicesVersion = 'X.X.X';
       }
     });
    this.apiVersion = window.__env.valApiVersion;
  }
}
