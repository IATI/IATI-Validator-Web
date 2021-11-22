import { Component, OnInit, Input } from '@angular/core';

import { LogService } from './../../../core/logging/log.service';

@Component({
  selector: 'app-main-report-info',
  templateUrl: './main-report-info.component.html',
  styleUrls: ['./main-report-info.component.scss']
})
export class MainReportInfoComponent implements OnInit {
  @Input() documentInfo = {} as any;
  @Input() organisationInfo = {} as any;
  @Input() fileNameString = '' as any;

  constructor(private logger: LogService) { }

  ngOnInit() {
  }

  fileName(): string {
    if ('url' in this.documentInfo) {
      return this.documentInfo.url.split('/').pop();
    } else {
      return 'No filename available';
    }
  }
}
