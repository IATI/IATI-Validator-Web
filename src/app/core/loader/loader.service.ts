import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { LoaderState } from './loader';

@Injectable()

export class LoaderService {
    loaderSubject = new Subject<LoaderState>();
    loaderState = this.loaderSubject.asObservable();

    show() {
        this.loaderSubject.next({ show: true });
    }

    hide() {
        this.loaderSubject.next({ show: false });
    }
}
