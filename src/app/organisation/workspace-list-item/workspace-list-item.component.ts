import { Component, Input, OnInit } from '@angular/core';

import { IatiDataset } from '../shared/iati-dataset';
import { OrganisationService } from './../../organisation/shared/organisation.service';
import { Workspace } from '../../shared/workspace';


@Component({
  selector: 'app-workspace-list-item',
  templateUrl: './workspace-list-item.component.html',
  styleUrls: ['./workspace-list-item.component.scss']
})
export class WorkspaceListItemComponent implements OnInit {
  @Input() workspace: Workspace;
  queueNextDate = null;
  queueLength = null;

  constructor(
    private readonly organisationService: OrganisationService,
  ) { }

  ngOnInit() {
    this.organisationService.getNextInQueue().subscribe((iatiDataSet: IatiDataset) => {
      if (!iatiDataSet) {
        return;
      }
      if (typeof iatiDataSet.received !== 'undefined') {
        this.queueNextDate = iatiDataSet.received;
      } else if (typeof iatiDataSet.downloaded !== 'undefined') {
        this.queueNextDate = iatiDataSet.downloaded;
      }
    });

    this.organisationService.getQueueLength().subscribe(length => {
      this.queueLength = length;
    });
  }
}
