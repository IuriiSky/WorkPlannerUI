import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private authService: AuthenticationService,private router : Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //if(this.authService.isAdmin() || this.authService.isSuperAdmin())
    if(this.authService.isAdmin())
    {
       return true;
    }
    this.router.navigate(['/login'],{
      queryParams: {
        return: state.url
      }
     });

     return false;
  }
}
