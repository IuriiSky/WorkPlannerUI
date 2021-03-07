// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl:'http://localhost:64162/api/',
  apiUrl: 'http://wp-test-api.softwaris.eu/api/',
  //identityServerUrl:'http://localhost:64162/',
  identityServerUrl:'http://wp-test-api.softwaris.eu/',
  clientId: 'WebClient',
  clientSecret : 'd30120c1-c1b2-4f3b-bb55-a32ad0dbb66d64b9c69f',
  //clientSecret : 'verylongsectet',
  scope : 'IdentityServerApi offline_access',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
