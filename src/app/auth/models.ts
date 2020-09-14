import * as jwt_decode from "jwt-decode";

export interface IToken {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token?: string;
    scope: string;
    // expire_date: string;
    // info: any;
  }
  
  export class User{
    access_token: string;
    token_expires: Date;
    refresh_token?: string;
    info? : any;
    isAdmin: boolean;
    
    constructor(token: IToken) {
      this.access_token = token.access_token;
      this.refresh_token = token.refresh_token;
      this.info = jwt_decode(token.access_token);
  
       var date = new Date();
       let buffer = 10;
       date.setSeconds(date.getSeconds() + token.expires_in - buffer);
       this.token_expires = date;
    }

    // public get isTokenExpired() : boolean {
    //   if(this.token_expires){
    //     let expired = new Date() >= new Date(this.token_expires);
    //     console.log(expired);
    //     return expired;
    //   }
    //   else{
    //     return true;
    //   }
    // }
  }
  
  export interface IOpenIdConfig {
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