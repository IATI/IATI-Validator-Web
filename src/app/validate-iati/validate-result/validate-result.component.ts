import { ActivatedRoute, UrlSegment, Router  } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validate-result',
  templateUrl: './validate-result.component.html',
  styleUrls: ['./validate-result.component.scss']
})
export class ValidateResultComponent implements OnInit {
  workspaceId = '';
  currentUrl = '';

  constructor(private activateRoute: ActivatedRoute,
    private router: Router, ) { }

  ngOnInit() {
    this.activateRoute
    .params
    .subscribe(params => {
      this.workspaceId = params['id'];
    });
  }


  rowClick(viewType: string, item: string) {
    // Routerlink naar de view pagina
    this.router.navigate(['view', viewType, item] );
  }

}
