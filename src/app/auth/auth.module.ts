import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGuard } from './admin.guard';
import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';



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
    }
  ],
  imports: [
    CommonModule
  ]
})
export class AuthModule { }
