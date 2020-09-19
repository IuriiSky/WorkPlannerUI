import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  
  constructor(private authService: AuthenticationService,private router : Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.authService.isAdminUser())
    {
       this.router.navigate(['/login'],{
        queryParams: {
          return: state.url
        }
       });

       return false;
    }
    return true;
  }
}
