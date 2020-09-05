import { Component, OnInit } from '@angular/core';
import {delay} from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
})
export class BaseComponent implements OnInit {

  constructor(
    private _loading: LoadingService,
    
  ) { }

  isLoading: boolean = false;

  ngOnInit() {
    this.listenToLoading();
  }

  /**
   * Listen to the loadingSub property in the LoadingService class. This drives the
   * display of the loading spinner.
   */
  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        console.log(loading);
        this.isLoading = loading;
      });
  }

}
