import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGuard } from './admin.guard';
import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';

export function loadConfiguration(authService: AuthenticationService){
  return () => authService.getConfig();
}

@NgModule({
  declarations: [],
  providers:[
    AdminGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
      deps: [AuthenticationService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfiguration,
      deps: [AuthenticationService],
      multi: true
    }
  ],
  imports: [
    CommonModule
  ]
})
export class AuthModule { }
