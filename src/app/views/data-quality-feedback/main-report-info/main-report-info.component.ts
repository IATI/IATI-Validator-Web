import { ReportInfo } from './../shared/report-info';
import { Component, OnInit, Input } from '@angular/core';

import { LogService } from './../../../core/logging/log.service';
import { DataQualityFeedbackService } from './../shared/data-quality-feedback.service';

@Component({
  selector: 'app-main-report-info',
  templateUrl: './main-report-info.component.html',
  styleUrls: ['./main-report-info.component.scss']
})
export class MainReportInfoComponent implements OnInit {
  @Input() id = '';
  reportInfo: ReportInfo  = {organisationName: '', fileName: '', organisationSlug: '' };

  constructor(private dataQualityFeedbackService: DataQualityFeedbackService,
              private logger: LogService) { }

  ngOnInit() {
    this.loadData(this.id);
  }

  loadData(id: string) {
    this.dataQualityFeedbackService.getReportInfo(id).subscribe(
      data => {
        this.reportInfo = data;
      }
    );
  }

}
