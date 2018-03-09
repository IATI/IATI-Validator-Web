import { Component, OnInit } from '@angular/core';

import { LogService } from './../../../core/logging/log.service';
import { DataQualityFeedbackService } from './../shared/data-quality-feedback.service';
import { Severity } from '../shared/severity';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  testSelect = true;

  severities: Severity[] = [];

  constructor(private dataQualityFeedbackService: DataQualityFeedbackService,
              private logService: LogService) { }

  ngOnInit() {
    this.severities = this.dataQualityFeedbackService.getSeverities();
    this.logService.debug('severities loaded', this.severities);
  }

  severitySelectedChanged() {
    this.logService.debug('severitySelectedChanged');
  }

}
