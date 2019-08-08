import { Component, OnInit, Input } from '@angular/core';
import { Dqfs } from '../shared/feedback';

@Component({
  selector: 'app-iati-info',
  templateUrl: './iati-info.component.html',
  styleUrls: ['./iati-info.component.scss']
})
export class IatiInfoComponent implements OnInit {
@Input() data: Dqfs;
  constructor() { }

  ngOnInit() {
  }

}
