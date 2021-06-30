import { Component, OnInit, Input } from '@angular/core';
import { Dqfs } from '../shared/feedback';

@Component({
  selector: 'app-iati-info',
  templateUrl: './iati-info.component.html',
  styleUrls: ['./iati-info.component.scss']
})
export class IatiInfoComponent implements OnInit {
  @Input() validationReport = {} as any;
  @Input() documentInfo = {} as any;

  constructor() { }

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
