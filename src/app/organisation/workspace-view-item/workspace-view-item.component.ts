import { LogService } from './../../core/logging/log.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganisationService } from '../shared/organisation.service';

@Component({
  selector: 'app-workspace-view-item',
  templateUrl: './workspace-view-item.component.html',
  styleUrls: ['./workspace-view-item.component.scss']
})
export class WorkspaceViewItemComponent implements OnInit, OnChanges {
  @Input() workspaceId = '';
  @Input() versionSlug = '';

  files = [];
  publisher = null;

  viewData = [] ;
  previousViewType = '';
  error: any;

  constructor(private router: Router,
              private organisationService: OrganisationService,
              private logger: LogService,
              private activatedRoute: ActivatedRoute) {
                this.publisher = activatedRoute.snapshot.url[0].path;
               }

  ngOnInit() {
    // Loading version data in ngOnChanges, which also fires when the page loads
    // Excecuting it here would be double
    // this.loadVersionData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logger.debug('ngOnChanges', changes);
    this.getFileData();
  }

  getFileData() {
      this.organisationService.getFileDataForPublisher(this.publisher)
      .subscribe(
        data => {
          this.files = data;
        } ,
        error => this.error = error
      );
  }

  rowClick(viewType: string, item: string) {
    // Routerlink naar de view pagina
    this.router.navigate(['view', viewType, item] );
  }

  md5Selected(md5: String) {
    this.logger.debug('Selected md5: ', md5);
  }

}
