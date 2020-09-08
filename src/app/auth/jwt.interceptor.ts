import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(public authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.url.includes("token") && !request.url.includes("openid-configuration")){
            if(this.authenticationService){
                //if token
                //if tkoen expired so fornye
                //if 
                // add authorization header with jwt token if available
                let currentUser = this.authenticationService.currentUserValue;
                //console.log('user:', currentUser);
                if (currentUser && currentUser.access_token) {
                    request = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${currentUser.access_token}`
                        }
                        });
                }
            } 
        }

        return next.handle(request);
    }
}