import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspace-view-item',
  templateUrl: './workspace-view-item.component.html',
  styleUrls: ['./workspace-view-item.component.scss']
})
export class WorkspaceViewItemComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  rowClick(item: string) {
    console.log(item);
    this.router.navigate(['/view/dqf/', item] );
    // Routerlink naar de view pagina
  }

}
