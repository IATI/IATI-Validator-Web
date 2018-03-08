import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback-group',
  templateUrl: './feedback-group.component.html',
  styleUrls: ['./feedback-group.component.scss']
})
export class FeedbackGroupComponent implements OnInit {
  public isCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

  collapse() {
    this.isCollapsed = ! this.isCollapsed;
  }

}
