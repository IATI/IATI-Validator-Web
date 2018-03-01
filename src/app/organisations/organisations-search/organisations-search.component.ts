import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';

import { OrganisationsService } from './../shared/organisations.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-organisations-search',
  templateUrl: './organisations-search.component.html',
  styleUrls: ['./organisations-search.component.scss']
})
export class OrganisationsSearchComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  term = new FormControl();

  @Output() search = new EventEmitter<string>();

  constructor(private organisationService: OrganisationsService, private renderer: Renderer) { }

  ngOnInit() {
    // Set focus on search field
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');

    // Subscribe to changes in the search field and emit a search after 400 ms.
    this.term.valueChanges
              .debounceTime(400)
              .distinctUntilChanged()
              .subscribe(searchValue => this.searchOrganisations());
              // .subscribe(t => this.search.emit(t));
  }

  searchOrganisations() {
    this.search.emit(this.term.value);
  }

}
