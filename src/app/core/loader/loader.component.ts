import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderState } from './loader';
import { LoaderService } from './loader.service';


@Component({
  selector: 'app-loader',
  templateUrl: 'loader.component.html',
  styleUrls: ['loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  show = false;

  private subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
