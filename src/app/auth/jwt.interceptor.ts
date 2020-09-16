import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { empty, Observable, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { catchError, mergeMap } from "rxjs/operators";
import { User } from './models';
import { Router } from '@angular/router';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private AUTH_HEADER = "Authorization";
    constructor(public authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
        if(!request.url.includes(environment.apiUrl)){
            return next.handle(request);
        }
        if (request.url.includes("openid-configuration") 
             || request.url.includes(this.authenticationService.openIdConfig.token_endpoint) 
             || request.url.includes(this.authenticationService.openIdConfig.revocation_endpoint)){
            return next.handle(request);
        }

        if (!request.headers.has("Content-Type")) {
            request = request.clone({
                headers: request.headers.set("Content-Type", "application/json")
            });
        }

        return this.authenticationService.getUser().pipe(
            mergeMap((user:User)=>{
                request = this.addAuthenticationToken(request,user);
                return next.handle(request);
            })
           
        )
    }
    addAuthenticationToken(request: HttpRequest<any>, user: User): HttpRequest<any> {
        if(user && user.access_token){
            return request.clone({
                headers: request.headers.set(this.AUTH_HEADER, "Bearer " + user.access_token)
            });
        }
        else{
            return request;
        }
    }

    // addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    //     this.authenticationService.getCurUser().subscribe(
    //         (user:User) =>{
    //             if(!user) return request;
    //             return request.clone({
    //                 headers: request.headers.set(this.AUTH_HEADER, "Bearer " + user.access_token)
    //               });
    //         },
    //         (err)=>{
    //             return request;
    //         }
    //     );
    //     console.log('not set token');
    //     return request;
    // }
    
    // addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    //     let user = this.authenticationService.getUser();
    //     if(!user){
    //         return request;
    //     }
    //     // if(!request.url.match(/www.mydomain.com\//)) {
    //     //     return request;

    //     return request.clone({
    //         headers: request.headers.set(this.AUTH_HEADER, "Bearer " + user.access_token)
    //       });
    // }


    // intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>{
    //     if(!request.url.includes(environment.apiUrl)){
    //         return next.handle(request);
    //     }
    //     if (!request.headers.has("Content-Type")) {
    //         request = request.clone({
    //             headers: request.headers.set("Content-Type", "application/json")
    //         });
    //     }
    //     request = this.addAuthenticationToken(request);

    //     return next.handle(request).pipe(
    //         catchError((error: HttpErrorResponse) =>{

    //             if (error && error.status === 401){
    //                 if(this.authenticationService.refreshTokenInProgress){
    //                     return this.authenticationService.userSubject.pipe(
    //                         filter(result => result !== null),
    //                         take(1),
    //                         switchMap(() => next.handle(this.addAuthenticationToken(request)))
    //                     );
    //                 }
    //                 else{
    //                     return this.authenticationService.refreshAccessToken().pipe(
    //                         switchMap( () =>{                                
    //                             return next.handle(this.addAuthenticationToken(request));
    //                         })
    //                     );
    //                 }
    //             }
    //             else{
    //                 return throwError(error);
    //             }
    //         })
    //     );
    // }
}