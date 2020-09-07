import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {

  constructor(private _loading: LoadingService) { }
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
        this.isLoading = loading;
      });
  }

}
