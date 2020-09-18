import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { delay } from 'rxjs/operators';
import { AuthenticationService } from '../auth/authentication.service';
import { Router } from '@angular/router';
import { DepartamentService } from '../services/departament.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {

  constructor(
    private loading: LoadingService,
    private authService: AuthenticationService,
    private departmentService : DepartamentService,
    private router: Router) 
  { 
    //this.isUserLoggedIn = authService.isUserLoggedIn();
  }
  isLoading: boolean = false;
  isUserLoggedIn: boolean;

  selectedDepartment: number = 1;
  nameDepartament1 = 'Teknisk afd.';
  nameDepartament2 = 'Service afd.';

  public humburgerMenu: boolean = false;

  doLogout(){
    this.authService.logout();
  }

  openCloseHamburgerMenu() {
    this.humburgerMenu = !this.humburgerMenu;
  }
  selectDepartment(departmentId:number){
    this.selectedDepartment = departmentId;
    this.departmentService.setSelectedDepartment(departmentId);
  }
  isDeparmentSelected(department:number){
    return this.selectedDepartment === department;
  }
  ngOnInit() {
    this.isUserLoggedIn = this.authService.isUserLoggedIn();
    this.selectedDepartment =  this.departmentService.departmentSubject.getValue();
    if(this.selectedDepartment === null || this.selectedDepartment === undefined){
      this.selectDepartment(1);
    }

    this.listenToLoading();
    this.listenToUserChanged();
  }


  listenToUserChanged() {
    this.authService.userSubject
      .pipe(delay(0))
      .subscribe((user)=>{
        let userValid = user !== null && user !== undefined;
        if( !userValid && !this.authService.refreshTokenInProgress){
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
