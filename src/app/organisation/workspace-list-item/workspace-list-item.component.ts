import { Workspace } from './../shared/workspace';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-workspace-list-item',
  templateUrl: './workspace-list-item.component.html',
  styleUrls: ['./workspace-list-item.component.scss']
})
export class WorkspaceListItemComponent implements OnInit {
  @Input() workspace: Workspace;

  constructor() { }

  ngOnInit() {
  }

}
