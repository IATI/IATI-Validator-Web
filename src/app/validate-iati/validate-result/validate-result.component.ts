import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validate-result',
  templateUrl: './validate-result.component.html',
  styleUrls: ['./validate-result.component.scss']
})
export class ValidateResultComponent implements OnInit {
  workspaceId = '';

  constructor(private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activateRoute
    .params
    .subscribe(params => {
      this.workspaceId = params['id'];
    });
  }



}
