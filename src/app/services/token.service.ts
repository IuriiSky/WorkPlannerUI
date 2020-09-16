// import { Injectable, EventEmitter } from '@angular/core';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';

// import { Observable, Observer } from 'rxjs';
// import { map, take, catchError } from 'rxjs/operators';

// import * as jwt_decode from "jwt-decode";


// @Injectable()
// export class TokenHttp {

//     get isLoading() {
//         return !this.isStarted || this.isRequestingRefreshToken || this.isRequestingToken;
//     }

//     get token(): IToken | null {
//         return this.tokenData;
//     }

//     tokenChanged: EventEmitter<IToken> = new EventEmitter<IToken>();

//     private isStarted: boolean = false;
//     private onStart: EventEmitter<IOpenIdConfig> = new EventEmitter<IOpenIdConfig>();
//     private isStarting: boolean = false;
//     private hasRequestError: boolean = false;
//     private openIdConfiguration: IOpenIdConfig;
//     private tokenData: IToken | null = null;
//     private isRequestingRefreshToken: boolean = false;
//     private onRequestedRefreshToken: EventEmitter<ITokenStatus> = new EventEmitter<ITokenStatus>();
//     private isRequestingToken: boolean = false;
//     private onRequestedToken: EventEmitter<ITokenStatus> = new EventEmitter<ITokenStatus>();
//     private clientId: string;
//     private clientSecret: string;
//     private scope: string[];

//     constructor(private http: Http) {

//     }

//     start(openIdConfigRootUrl: string, clientId: string, clientSecret: string, token?: IToken, scope?: string[]) {
//         if (this.isStarting || this.isStarted) {
//             throw new Error("TokenHttp got started more than once!");
//         }

//         if (token)
//             this.tokenData = token;

//         if (scope)
//             this.scope = scope;

//         this.isStarting = true;
//         this.clientId = clientId;
//         this.clientSecret = clientSecret;

//         this.getOpenIdConfiguration(openIdConfigRootUrl).subscribe((res: IOpenIdConfig) => {
//             this.openIdConfiguration = res;
//             this.isStarted = true;
//             this.isStarting = false;
//             this.onStart.emit(res);
//         });
//     }

//     stop() {
//         this.revoke().subscribe();
//         this.isStarted = false;
//         this.isStarting = false;
//         this.clientId = "";
//         this.clientSecret = "";
//     }

//     get(url: string) {
//         return this.tokenValidatedRequest(() => {
//             return this.http.get(url, this.getRequestOptions());
//         });
//     }

//     post(url: string, body: any) {
//         return this.tokenValidatedRequest(() => {
//             return this.http.post(url, body, this.getRequestOptions());
//         });
//     }

//     put(url: string, body: any) {
//         return this.tokenValidatedRequest(() => {
//             return this.http.put(url, body, this.getRequestOptions());
//         });
//     }

//     delete(url: string) {
//         return this.tokenValidatedRequest(() => {
//             return this.http.delete(url, this.getRequestOptions());
//         });
//     }

//     login(username: string, password: string): Observable<IToken> {

//         //handle different login request scenarios:
//         var returnObservable = Observable.create((observer: Observer<IToken>) => {

//             this.onPermissionsReady(true).subscribe(() => {
//                 this.requestTokenSubscription(username, password, observer);
//             });


//         });

//         return returnObservable;
//     }

//     onAuthenticationChanged(additionalCondition: boolean = true, onlyOnSuccess: boolean = false): Observable<boolean> {

//         var returnObservable = Observable.create((observer: Observer<any>) => {

//             if (this.token) {
//                 observer.next(additionalCondition);
//             }
//             else if (!onlyOnSuccess) {
//                 observer.next(false);
//             }

//             this.tokenChanged.subscribe((token?: IToken) => {
//                 if (token) {
//                     observer.next(additionalCondition);
//                 }
//                 else if (!onlyOnSuccess) {
//                     observer.next(false);
//                 }
//             });
//         });

//         return returnObservable;

//     }

//     revoke() {
//         if (!this.token)
//             throw new Error("no token to revoke");

//         let body =
//             {
//                 token: this.token.refresh_token,
//                 token_type_hint: "refresh_token",
//                 client_id: this.clientId,
//                 client_secret: this.clientSecret
//             };

//         return this.http.post(
//             this.openIdConfiguration.revocation_endpoint,
//             this.objToEncodeUrl(body), this.getRequestOptions(true))
//             .pipe(
//                 map((res: Response) => {
//                     this.removeToken();
//                     return true;
//                 }),
//                 catchError((error: any) => {
//                     return this.createErrorObservable(error);
//                 })
//             )
//     }

//     private setToken(token: IToken) {

//         if (this.tokenData && this.tokenData.refresh_token && !token.refresh_token) {
//             token.refresh_token = this.tokenData.refresh_token;
//         }

//         this.tokenData = token;
//         this.tokenChanged.emit(token);
//     }

//     private removeToken() {
//         this.tokenData = null;
//         this.tokenChanged.emit(undefined);
//     }

//     private requestTokenSubscription(username: string, password: string, observer: Observer<IToken>) {
//         this.isRequestingToken = true;
//         this.requestToken(username, password).subscribe(
//             (token: IToken) => {
//                 this.isRequestingToken = false;
//                 this.setToken(token);
//                 this.onRequestedToken.emit({
//                     success: true,
//                     token: token
//                 });
//                 observer.next(token);
//                 observer.complete();
//             },
//             (error: any) => {
//                 this.isRequestingToken = false;
//                 if (this.token) {
//                     this.revoke().subscribe(() => {
//                         this.onRequestedToken.emit({
//                             success: false
//                         });
//                         observer.error(error);
//                     });
//                 }
//                 else {
//                     observer.error(error);
//                 }
//             });
//     }

//     private requestToken(username: string, password: string): Observable<any> {
//         let body =
//             {
//                 username: username,
//                 password: password,
//                 grant_type: "password",
//                 client_id: this.clientId,
//                 client_secret: this.clientSecret,
//                 scope: this.getScopeString()
//             };

//         return this.http.post(
//             this.openIdConfiguration.token_endpoint,
//             this.objToEncodeUrl(body),
//             this.getRequestOptions(true))

//             .pipe(
//                 map((res: Response) => {
//                     if (res) {
//                         var result = res.json();
//                         this.convertTokenResult(result);
//                         return result;
//                     }
//                 }),
//                 catchError((error: any) => {
//                     var result = error.json();
//                     return this.createErrorObservable(result);
//                 })
//             )
//     }

//     private requestRefreshTokenSubscription(onSuccess: Function, onError: Function) {

//         if (!this.tokenData || !this.tokenData.refresh_token) {
//             onError("no refreshtoken to refresh");
//         }
//         else {
//             this.isRequestingRefreshToken = true;
//             this.requestRefreshToken(this.tokenData.refresh_token).subscribe(
//                 (token: IToken) => {
//                     this.isRequestingRefreshToken = false;
//                     this.setToken(token);
//                     this.onRequestedRefreshToken.emit({
//                         success: true,
//                         token: token
//                     });
//                     onSuccess(token);
//                 },
//                 (error: any) => {
//                     this.isRequestingRefreshToken = false;
//                     this.revoke().subscribe(() => {
//                         this.onRequestedRefreshToken.emit({
//                             success: false
//                         });
//                         onError(error);
//                     });
//                 });
//         }
//     }

//     private requestRefreshToken(refreshToken: string): Observable<IToken> {

//         let body =
//             {
//                 grant_type: "refresh_token",
//                 refresh_token: refreshToken,
//                 client_id: this.clientId,
//                 client_secret: this.clientSecret,
//                 scope: this.getScopeString()
//             };

//         return this.http.post(
//             this.openIdConfiguration.token_endpoint,
//             this.objToEncodeUrl(body),
//             this.getRequestOptions(true))

//             .pipe(
//                 map((res: Response) => {
//                     if (res) {
//                         var result = res.json();
//                         this.convertTokenResult(result);
//                         return result;
//                     }
//                 }),
//                 catchError((error: any) => {
//                     return this.createErrorObservable(error);
//                 })
//             )
//     }

//     private onPermissionsReady(ignoreExistingToken: boolean = false): Observable<boolean> {
//         var returnObservable = Observable.create((observer: Observer<any>) => {
//             this.onPermissionsReadyObserver(observer, ignoreExistingToken);
//         });

//         return returnObservable;
//     }

//     private onPermissionsReadyObserver(observer: Observer<any>, ignoreExistingToken: boolean = false) {

//         //not started yet, pls wait for start:
//         if (!this.isStarted) {
//             this.onStart.subscribe(() => {
//                 this.onPermissionsReadyObserver(observer, ignoreExistingToken);
//             });
//         }
//         //currently requesting a token, wait for it to complete
//         else if (this.isRequestingToken) {
//             this.onRequestedToken.subscribe(() => {
//                 this.onPermissionsReadyObserver(observer, ignoreExistingToken);
//             });
//         }
//         //currently requesting a refresh token, wait for it to complete
//         else if (this.isRequestingRefreshToken) {
//             this.onRequestedRefreshToken.subscribe(() => {
//                 this.onPermissionsReadyObserver(observer, ignoreExistingToken);
//             });
//         }
//         //no token assigned, wait for token request:
//         else if (!ignoreExistingToken && !this.tokenData) {
//             this.onRequestedToken.subscribe(() => {
//                 this.onPermissionsReadyObserver(observer, ignoreExistingToken);
//             });
//         }
//         //if token is expired, request new:
//         else if (!ignoreExistingToken && this.tokenIsExpired()) {
//             this.requestRefreshTokenSubscription(() => {
//                 this.onPermissionsReadyObserver(observer, ignoreExistingToken);
//             }, () => {
//                 //on request token error, do logout:
//                 this.revoke().subscribe(() => {
//                     this.onPermissionsReadyObserver(observer, ignoreExistingToken);
//                 });

//             })
//         }
//         else {
//             observer.next(true);
//             observer.complete();
//         }


//     }


//     private convertTokenResult(result: any) {
//         result.info = jwt_decode(result.access_token);
//         var d = new Date();
//         d.setSeconds(d.getSeconds() + result.expires_in);
//         result.expire_date = d;
//     }

//     private getOpenIdConfiguration(url: string): Observable<IOpenIdConfig> {
//         if (!url.endsWith("/")) {
//             url += "/";
//         }
//         return this.http.get(url + ".well-known/openid-configuration", this.getRequestOptions())
//             .pipe(
//                 map((res: Response) => {
//                     return res.json();
//                 }),
//                 catchError((error: any) => {
//                     throw new Error("TokenHttp could not connect to openIdConfigUrl:" + error.message);
//                 })
//             )

//     }

//     private getRequestOptions(asXWWWFormUrlEncoded: boolean = false) {
//         let headerObj = { 'Content-Type': (asXWWWFormUrlEncoded ? 'application/x-www-form-urlencoded' : 'application/json'), 'Authorization': '' };

//         if (this.tokenData && this.tokenData !== null) {
//             headerObj.Authorization = "Bearer " + this.tokenData.access_token;
//         }

//         let header = new Headers(headerObj);
//         let options = new RequestOptions({ headers: header });

//         return options;
//     }


//     private tokenValidatedRequest(func: Function): Observable<any> {

//         var returnObservable = Observable.create((observer: Observer<any>) => {
//             this.onPermissionsReady().subscribe(() => {
//                 this.attachRefreshFuncObserverSubscription(func, observer);
//             });
//         });

//         return returnObservable;
//     }

//     private getScopeString() {
//         if (this.scope && this.scope.length > 0) {
//             return this.scope.join(" ");
//         }

//         return "";
//     }

//     private attachRefreshFuncObserverSubscription(func: Function, observer: Observer<any>) {
//         func().subscribe(
//             (d: any) => {
//                 observer.next(d);
//                 observer.complete();
//             },
//             (error: any) => {
//                 observer.error(error);
//             }
//         );
//     }


//     private createErrorObservable(error: any) {
//         return Observable.create((observer: Observer<any>) => {
//             observer.error(error);
//         });
//     }

//     private objToEncodeUrl(obj: any): string {
//         var str = [];
//         for (var p in obj) {
//             if (Array.isArray(obj[p])) {
//                 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//             }
//             else {
//                 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
//             }
//         }
//         return str.join("&");
//     }


//     private tokenIsExpired(token?: IToken) {

//         if (token) {
//             return new Date() > new Date(token.expire_date);
//         }
//         else if (this.tokenData) {
//             return new Date() > new Date(this.tokenData.expire_date);
//         }
//         else {
//             return true;
//         }
//     }

// }


// interface IOpenIdConfig {
//     issuer: string,
//     jwks_uri: string,
//     authorization_endpoint: string,
//     token_endpoint: string,
//     userinfo_endpoint: string,
//     end_session_endpoint: string,
//     check_session_iframe: string,
//     revocation_endpoint: string,
//     introspection_endpoint: string,
//     device_authorization_endpoint: string,
//     frontchannel_logout_supported: boolean,
//     frontchannel_logout_session_supported: boolean,
//     backchannel_logout_supported: boolean,
//     backchannel_logout_session_supported: boolean,
//     scopes_supported: string[],
//     claims_supported: string[],
//     grant_types_supported: string[],
//     response_types_supported: string[],
//     response_modes_supported: string[],
//     token_endpoint_auth_methods_supported: string[],
//     id_token_signing_alg_values_supported: string[],
//     subject_types_supported: string[],
//     code_challenge_methods_supported: string[],
//     request_parameter_supported: boolean
// }

// export interface IToken {
//     access_token: string;
//     expires_in: number;
//     token_type: string;
//     refresh_token?: string;
//     scope: string;

//     expire_date: string;
//     info: any;
// }

// interface ITokenStatus {
//     success: boolean;
//     token?: IToken;
// }