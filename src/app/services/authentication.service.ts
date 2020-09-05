// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { User } from '../shared/interfaces/user';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthenticationService {
//   private currentUserSubject: BehaviorSubject<User>;
//   public currentUser: Observable<User>;

//   constructor(private http: HttpClient) {
//     this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
//     this.currentUser = this.currentUserSubject.asObservable();
//   }

//   public get currentUserValue(): User {
//     return this.currentUserSubject.value;
//   }

//   login(username: string, password: string) {
//     return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
//       .pipe( map(user => {
//         // store user details and jwt token in local storage to keep user logged in between page refreshes
//         localStorage.setItem('currentUser', JSON.stringify(user));
//         this.currentUserSubject.next(user);
//         return user;
//       }));
//   }

//   logout() {
//     // remove user from local storage to log user out
//     localStorage.removeItem('currentUser');
//     this.currentUserSubject.next(null);
//   }

// }

import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService  {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  private clientId : string;
  private clientSecret: string;
  private openIdConfig : IOpenIdConfig;

  constructor(private http: HttpClient) {

    console.log('Auth constructor');
    this.clientId = environment.clientId;
    this.clientSecret = environment.clientSecret;
    

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.initOpenIdConfig();
  }
  
  private initOpenIdConfig(): void {
    
    let url : string = environment.identityServerUrl;
    if (!url.endsWith("/")) { url += "/"; }
    url += '.well-known/openid-configuration';
    
    this.http.get<IOpenIdConfig>(url).subscribe((res:IOpenIdConfig) => {
      this.openIdConfig = res;
    });
}

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
      .pipe( map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

}


interface IOpenIdConfig {
  issuer: string,
  jwks_uri: string,
  authorization_endpoint: string,
  token_endpoint: string,
  userinfo_endpoint: string,
  end_session_endpoint: string,
  check_session_iframe: string,
  revocation_endpoint: string,
  introspection_endpoint: string,
  device_authorization_endpoint: string,
  frontchannel_logout_supported: boolean,
  frontchannel_logout_session_supported: boolean,
  backchannel_logout_supported: boolean,
  backchannel_logout_session_supported: boolean,
  scopes_supported: string[],
  claims_supported: string[],
  grant_types_supported: string[],
  response_types_supported: string[],
  response_modes_supported: string[],
  token_endpoint_auth_methods_supported: string[],
  id_token_signing_alg_values_supported: string[],
  subject_types_supported: string[],
  code_challenge_methods_supported: string[],
  request_parameter_supported: boolean
}

