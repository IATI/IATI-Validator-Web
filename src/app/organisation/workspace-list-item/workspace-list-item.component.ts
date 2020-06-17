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

  constructor(
    private readonly organisationService: OrganisationService,
  ) { }

  ngOnInit() {
    this.organisationService.getNextInQueue().subscribe(iatiTestDataSet => {
      this.queueNextDate = iatiTestDataSet[0].downloaded;
    });
  }

}
