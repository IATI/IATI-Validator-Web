import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Output() selectedMd5: EventEmitter<String> = new EventEmitter<String>() ;
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

  jsonUpdated(): boolean {
    if (this.iatiDatasetData['json-updated']) {
      return true;
    } else {
      return false;
    }
  }

  reportType(): string {
    if (this.jsonUpdated()) {
      // Routerlink naar de view pagina
      return 'File Validation report (click to view)';
    } else {
      return '-';
    }
  }

  rowClick(viewType: string, item: string) {

    if (this.jsonUpdated()) {
      // Routerlink naar de view pagina
      this.router.navigate(['view', 'dqf', 'files', this.md5]);
    } else {
      this.selectedMd5.emit(this.md5);
    }


  }

}
