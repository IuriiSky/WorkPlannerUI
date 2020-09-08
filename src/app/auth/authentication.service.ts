
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';
import * as storage from '../_helpers/localstorage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOpenIdConfig, IToken, User } from './models';
import { map, switchMap } from 'rxjs/operators';
import { LocalStorage } from '../decorators/localstorage.decorator';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  @LocalStorage() myVar: string = "123";

  private openIdConfig: IOpenIdConfig;

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  private tokenSubject: BehaviorSubject<IToken>;
  private token: Observable<IToken>;


  constructor(private http: HttpClient) {

    console.log('Auth ctor')
    this.userSubject = new BehaviorSubject<User>(storage.get("user"));
    this.user = this.userSubject.asObservable();

    this.tokenSubject = new BehaviorSubject<IToken>(storage.get("token"));
    this.token = this.tokenSubject.asObservable();
    //this.initOpenIdConfig();
    //this.initOID();
  }

  private initOID() {
    let url: string = environment.identityServerUrl;
    if (!url.endsWith("/")) { url += "/"; }
    url += '.well-known/openid-configuration';
    this.http.get<IOpenIdConfig>(url).subscribe((res) => {
      this.openIdConfig = res;
    })

  }

  private initOpenIdConfig(): Observable<boolean> {
    return this.wrapResult((res) => {
      if (this.openIdConfig) {
        res.markDone(true);
      } else {
        let url: string = environment.identityServerUrl;
        if (!url.endsWith("/")) { url += "/"; }
        url += '.well-known/openid-configuration';
        this.http.get<IOpenIdConfig>(url).subscribe((cfg) => {
          this.openIdConfig = cfg;
          res.markDone(true);
        }, () => {
          res.markError(false);
        })

      }
    });

    // if (this.openIdConfig) {
    //   return of(this.openIdConfig);
    // }
    // else {
    //   let url: string = environment.identityServerUrl;
    //   if (!url.endsWith("/")) { url += "/"; }
    //   url += '.well-known/openid-configuration';
    //   this.http.get<IOpenIdConfig>(url).subscribe((res) => {
    //     this.openIdConfig = res;
    //     onDone();
    //   })
    // }
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

  login(username: string, password: string): Observable<boolean> {

    return this.wrapResult((res) => {
      this.initOpenIdConfig().subscribe(() => {
        this.requestToken(username, password).subscribe((tokenRes) => {
          this.setToken(tokenRes);
          res.markDone(true);
        }, () => {
          res.markError(false);
        });
      });
    });
  }

  // refresh():Observable<boolean>{

  // }


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

  private requestToken(username: string, password: string): Observable<IToken> {
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

    return this.http.post<any>(
      this.openIdConfig.token_endpoint,
      this.encodeToUrl(body),
      { headers: headers });
  }


  private encodeToUrl(object: any): string {
    var strings = [];
    for (var property in object) {
      strings.push(encodeURIComponent(property) + "=" + encodeURIComponent(object[property]));
    }
    return strings.join("&");
  }


  logout() {
    storage.remove("user");
    this.userSubject.next(null);
  }

  setToken(token: IToken) {
    storage.set('token', token);
    let user = new User(token);
    storage.set('user', user);
    this.userSubject.next(user);
  }
}



