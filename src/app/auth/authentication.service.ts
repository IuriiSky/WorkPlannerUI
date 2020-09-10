
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators'
import * as storage from '../_helpers/localstorage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOpenIdConfig, IToken, User } from './models';
import { LocalStorage } from '../decorators/localstorage.decorator';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private openIdConfig: IOpenIdConfig;

  @LocalStorage() user: User;
  userSubject: BehaviorSubject<User>;
  public observableUser: Observable<User>;

  @LocalStorage() token: IToken;
  tokenSubject: BehaviorSubject<IToken>;
  private observableToken: Observable<IToken>;


  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(this.user);
    this.observableUser = this.userSubject.asObservable();

    this.tokenSubject = new BehaviorSubject<IToken>(this.token);
    this.observableToken = this.tokenSubject.asObservable();

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
  login(username: string, password: string): Observable<User> {
    return this.requestTokenWithUserCredentials(username, password).pipe(
           map(token =>{
             this.setToken(token);
             let user = new User(token);
             return user;
           })
    );
  }
  requestTokenWithUserCredentials(username: string, password: string): Observable<IToken> {
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

  requestTokenWithRefreshToken(refreshToken:string):Observable<IToken> {
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

  isAdmin(): boolean {
    throw new Error("Method not implemented.");

    // this.login("U", "P").subscribe(() => {
    //   //ALWAYS SUCCESS
    // }, () => {
    //   //ALWAYS ERROR!
    // })
  }

  public get currentUserValue(): User {
    return this.userSubject.value;
  }


  


  logout() {
    storage.remove("user");
    this.userSubject.next(null);
  }

  setToken(token: IToken) {
    this.token = token;

    let user = new User(token);
    this.user = user;
    this.userSubject.next(user);
  }

  wrapResult(method: Function) {
    var returnObservable = Observable.create((observer: Observer<any>) => {
      var result = {
        markDone: (data?: any) => {
          observer.next(data);
        },
        markError: (data?: any) => {
          observer.error(data);
        }
      }
      method(result);
    });

    return returnObservable;
  }
  private encodeToUrl(object: any): string {
    var strings = [];
    for (var property in object) {
      strings.push(encodeURIComponent(property) + "=" + encodeURIComponent(object[property]));
    }
    return strings.join("&");
  }
}



