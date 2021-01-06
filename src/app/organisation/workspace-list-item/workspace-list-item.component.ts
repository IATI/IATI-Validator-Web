import { Workspace } from './../shared/workspace';
import { OrganisationService } from './../../organisation/shared/organisation.service';
import { Component, OnInit, Input } from '@angular/core';


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
    this.organisationService.getNextInQueue().subscribe(iatiDataSet => {
      if (iatiDataSet == null) {
        return;
      }
      if ('received' in iatiDataSet) {
        this.queueNextDate = iatiDataSet.received;
      } else if ('downloaded' in iatiDataSet) {
        this.queueNextDate = iatiDataSet.downloaded;
      }
    });

    this.organisationService.getQueueLength().subscribe(length => {
      this.queueLength = length;
    });
  }
}
