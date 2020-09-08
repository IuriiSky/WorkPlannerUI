
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
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

    console.log('Auth ctor')
    this.userSubject = new BehaviorSubject<User>(this.user);
    this.observableUser = this.userSubject.asObservable();

    this.tokenSubject = new BehaviorSubject<IToken>(this.token);
    this.observableToken = this.tokenSubject.asObservable();
    
  }


  private ensureOpenIdConfig(): Observable<boolean> {
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
      this.ensureOpenIdConfig().subscribe(() => {
        this.requestToken(username, password).subscribe(
          (tokenRes) => {
            this.setToken(tokenRes);
            res.markDone(true);
          }, 
          (err) => {
            console.log(err);
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

  private requestToken(username: string, password: string): Observable<any> {
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
    this.token = token;

    let user = new User(token);
    this.user = user;
    this.userSubject.next(user);
  }
}



