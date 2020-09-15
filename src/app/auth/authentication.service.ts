
import { Injectable, INJECTOR } from '@angular/core';
import { BehaviorSubject, Observable, Observer, of, throwError } from 'rxjs';
import { tap, map,finalize, filter, take, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOpenIdConfig, IToken, User } from './models';
import { LocalStorage } from '../decorators/localstorage.decorator';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  openIdConfig: IOpenIdConfig;

  @LocalStorage()  private user: User;
  userSubject: BehaviorSubject<User>;
  
  refreshTokenInProgress = false;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(this.user);
  }

  getConfig(): Promise<Object> {
    let url: string = environment.identityServerUrl;
    if (!url.endsWith("/")) { url += "/"; }
    url += '.well-known/openid-configuration';

    return this.http.get<IOpenIdConfig>(url).pipe(
      tap(config => {
        this.openIdConfig = config;
      })
    ).toPromise();
  }


   getUser(): Observable<User> {
    if(!this.refreshTokenInProgress){
      if(!this.user) {
        return throwError("User not logget in...")
     }
    }
    
     if(!this.isTokenExpired(this.user))
     {
       return of(this.user);
     }
     else{
       return this.refreshToken().pipe(
        catchError((err) => {
          this.user = null;
          this.userSubject.next(null);
          return of(null);
        })
       );
     }
   }
   
  private isTokenExpired(user:User) : boolean {
     if(user && user.token_expires){
       let expired = new Date() >= new Date(user.token_expires);
       return expired;
    }
    else{
      return true;
    }
  }

  private refreshToken(): Observable<User> {
    if (this.refreshTokenInProgress){
      return this.userSubject.pipe(
        filter(result => result !== null),
        take(1)
      );
    }else {
      this.refreshTokenInProgress = true;
      let refresh = this.user.refresh_token;
      this.user = null;
      this.userSubject.next(null);

      return this.requestTokenWithRefreshToken(refresh).pipe(
        map( token =>{
          this.user = new User(token);
          this.userSubject.next(this.user);
          return this.user;
        }),
        finalize(() => {
          this.refreshTokenInProgress = false;
        }))
    }
  }

  login(username: string, password: string): Observable<User> {
    this.user = null;
    this.userSubject.next(null);

    return this.requestTokenWithUserCredentials(username, password).pipe(
           map(token =>{
            this.user = new User(token);
            this.userSubject.next(this.user);
            return this.user;
           })
    );
  }
  
  private requestTokenWithUserCredentials(username: string, password: string): Observable<IToken> {
    let body =
    {
      username: username,
      password: password,
      grant_type: "password",
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      scope: environment.scope
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<IToken>(this.openIdConfig.token_endpoint, this.encodeToUrl(body), { headers: headers});
  }

  
  private requestTokenWithRefreshToken(refreshToken:string):Observable<IToken> {
    console.log('request refresh');
    let body = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      scope: environment.scope
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<IToken>(this.openIdConfig.token_endpoint, this.encodeToUrl(body), { headers: headers});
  }

  logout() {
    this.user = null;
    this.userSubject.next(null);
  }

  

  // wrapResult(method: Function) {
  //   var returnObservable = Observable.create((observer: Observer<any>) => {
  //     var result = {
  //       markDone: (data?: any) => {
  //         observer.next(data);
  //       },
  //       markError: (data?: any) => {
  //         observer.error(data);
  //       }
  //     }
  //     method(result);
  //   });

  //   return returnObservable;
  // }
  private encodeToUrl(object: any): string {
    var strings = [];
    for (var property in object) {
      strings.push(encodeURIComponent(property) + "=" + encodeURIComponent(object[property]));
    }
    return strings.join("&");
  }
}



