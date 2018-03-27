import { Component, OnInit, Input } from '@angular/core';

import { OrganisationService } from './../shared/organisation.service';
import { LogService } from '../../core/logging/log.service';
import { IatiDataset } from '../shared/iati-dataset';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace-view-item-file',
  templateUrl: './workspace-view-item-file.component.html',
  styleUrls: ['./workspace-view-item-file.component.scss']
})
export class WorkspaceViewItemFileComponent implements OnInit {
  @Input() md5: string;
  iatiDatasetData: IatiDataset;

  constructor(private organisationService: OrganisationService,
              private logger: LogService,
              private router: Router) { }

  ngOnInit() {
    this.loadFileData();
  }

  loadFileData() {
    this.organisationService.getIatiDataset(this.md5)
      .subscribe(
        data => this.iatiDatasetData = data[0],
        error => this.logger.error('Faild to load iati data', error),
        () => {
          // Completed

        }
      );
  }

  rowClick(viewType: string, item: string) {
    // Routerlink naar de view pagina
    // this.router.navigate(['view', viewType, item] );
    this.organisationService.getIatiFile(this.md5)
      .subscribe(
        data => this.logger.debug('iati file content', data),
        error => this.logger.error('Error fetching iati file', error)
      );
    // this.logger.debug('row clicked', this.iatiDatasetData);

  }

}
