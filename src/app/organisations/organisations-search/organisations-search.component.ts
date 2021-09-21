import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-organisations-search',
  templateUrl: './organisations-search.component.html',
  styleUrls: ['./organisations-search.component.scss']
})
export class OrganisationsSearchComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  @Output() search = new EventEmitter<string>();
  term = new FormControl();

  constructor() { }

  ngOnInit() {
    // Subscribe to changes in the search field and emit a search after 400 ms.
    this.term.valueChanges
      .pipe(debounceTime(300))
      .pipe(distinctUntilChanged())
      .subscribe(searchValue => this.searchOrganisations());
      // .subscribe(t => this.search.emit(t));
  }

  searchOrganisations() {
    this.search.emit(this.term.value.trim());
  }

}
