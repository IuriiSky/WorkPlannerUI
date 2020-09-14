import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private authService: AuthenticationService,private router : Router) {
  

  }
  canActivate(){
    return true;
    // if(this.authService.isAdmin())
    // {
    //   this.router.navigate(['/']);
    // }
    // return !this.authService.isAdmin();
  }
  
}
