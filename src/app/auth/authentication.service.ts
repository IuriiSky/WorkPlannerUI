
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Observer,of } from 'rxjs';
import * as storage from '../_helpers/localstorage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOpenIdConfig, IToken, User } from './models';
import { map, switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService  {

  private openIdConfig : IOpenIdConfig;

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  private tokenSubject : BehaviorSubject<IToken>;
  private token: Observable<IToken>;
  

  constructor(private http: HttpClient) {
    
    console.log('Auth ctor')
    this.userSubject = new BehaviorSubject<User>(storage.get("user"));
    this.user = this.userSubject.asObservable();

    this.tokenSubject = new BehaviorSubject<IToken>(storage.get("token"));
    this.token = this.tokenSubject.asObservable();
    //this.initOpenIdConfig();
    this.initOID();
  }
  
  private initOID(){
    let url : string = environment.identityServerUrl;
      if (!url.endsWith("/")) { url += "/"; }
      url += '.well-known/openid-configuration';
      this.http.get<IOpenIdConfig>(url).subscribe((res)=>{
        this.openIdConfig = res;
      })

  }

  private initOpenIdConfig(): Observable<IOpenIdConfig> {
    if(this.openIdConfig){
      console.log('opendid from static');
      return of(this.openIdConfig);
    }
    else
    {
      console.log('opendid from remote');
      let url : string = environment.identityServerUrl;
      if (!url.endsWith("/")) { url += "/"; }
      url += '.well-known/openid-configuration';

      return this.http.get<IOpenIdConfig>(url).pipe(
        map(
          (response:IOpenIdConfig) => {
          console.log(response);
          this.openIdConfig = response;
          return response;
        })
      );
    } 
  }

isAdmin():boolean {
  throw new Error("Method not implemented.");
}

  public get currentUserValue(): User {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<IToken> {
    return this.initOpenIdConfig().pipe(switchMap(res => {
      return this.requestToken(username,password).pipe(
        map((response:IToken)=>{
          this.setToken(response);
          return response;
        })
      )
    }))
  }

  private requestToken(username: string, password: string):Observable<IToken>{
    let body =
            {
                username: username,
                password: password,
                grant_type: "password",
                client_id: environment.clientId,
                client_secret: environment.clientSecret,
                scope: environment.scope
            };
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    
    return this.http.post<any>(
            this.openIdConfig.token_endpoint,
            this.encodeToUrl(body),
            {headers:headers});
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
    storage.set('token',token);
    let user = new User(token);
    storage.set('user',user);
    this.userSubject.next(user);
  }
}



