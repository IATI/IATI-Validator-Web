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
export class WorkspaceViewItemFileComponent {
  @Output() selectedMd5: EventEmitter<String> = new EventEmitter<String>() ;
  @Input()iatiDatasetData: IatiDataset;

  constructor(private organisationService: OrganisationService,
    private logger: LogService,
    private router: Router) { }

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
      this.router.navigate(['view', 'dqf', 'files', this.iatiDatasetData.id]);
    } else {
      this.selectedMd5.emit(this.iatiDatasetData.md5);
    }


  }

}
