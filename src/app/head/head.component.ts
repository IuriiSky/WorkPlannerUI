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

  nameDepartament1 = 'Teknisk afd.';
  nameDepartament2 = 'Service afd.';

  public humburgerMenu: boolean = false;

  public requestDepartamentValue: string = '';

  // Plug
  public isUserLoggedIn: boolean = true;
  toggle(){
    this.isUserLoggedIn = !this.isUserLoggedIn;
  }
  doLogout(){
    this.authService.logout();
  }

  openCloseHamburgerMenu() {
    this.humburgerMenu = !this.humburgerMenu;
  }
  

public selectDepartament1: boolean = true;
public selectDepartament2: boolean = false;

chooseDepartament(){
    this.selectDepartament1 = !this.selectDepartament1;   
    this.selectDepartament2 = !this.selectDepartament2;
    this.setDepartamentValue();    
}

setDepartamentValue() {
  if (this.selectDepartament1 === true) {
    this.requestDepartamentValue = '1';
  } else { 
    this.requestDepartamentValue = '2'
  }
  
  return this.requestDepartamentValue;
}

  ngOnInit() {
    this.listenToLoading();
    this.listenToUserChanged();
  }


  listenToUserChanged() {
    this.authService.userSubject
      .pipe(delay(0))
      .subscribe((user)=>{
        if(user === null && !this.authService.refreshTokenInProgress){
          this.isUserLoggedIn = false;
          this.router.navigate(['/login']);
        }
        else{
          this.isUserLoggedIn = true;
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
