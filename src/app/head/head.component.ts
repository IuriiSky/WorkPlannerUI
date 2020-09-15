import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { delay } from 'rxjs/operators';
import { AuthenticationService } from '../auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {

  constructor(private loading: LoadingService,private authService: AuthenticationService,private router: Router) { }
  isLoading: boolean = false;

  ngOnInit() {
    this.listenToLoading();
    this.listenToUserChanged();
  }


  listenToUserChanged() {
    this.authService.userSubject
      .pipe(delay(0))
      .subscribe((user)=>{
        if(user === null && !this.authService.refreshTokenInProgress){
          this.router.navigate(['/login']);
        }
      });
  }
  /**
   * Listen to the loadingSub property in the LoadingService class. This drives the
   * display of the loading spinner.
   */
  listenToLoading(): void {
    this.loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.isLoading = loading;
      });
  }

}
