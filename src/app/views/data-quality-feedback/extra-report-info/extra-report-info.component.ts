import { Component, OnInit, Input } from '@angular/core';

import { Document } from 'src/app/shared/document';
import { LogService } from '../../../core/logging/log.service';

@Component({
  selector: 'app-extra-report-info',
  templateUrl: './extra-report-info.component.html',
  styleUrls: ['./extra-report-info.component.scss'],
})
export class ExtraReportInfoComponent implements OnInit {
  @Input() document: Document = {} as any;

  constructor(private logger: LogService) {}

  ngOnInit() {}
}
