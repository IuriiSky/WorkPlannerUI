import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//Helpers
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';

  // Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeadComponent } from './head/head.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeesComponent } from './admin/employees/employees.component';
import { TasksComponent } from './admin/tasks/tasks.component';
  // Services
import { EmployeesService} from './services/employees.service';
import { EmployeeDetailsComponent } from './admin/employee-details/employee-details.component';
import { DatepickerComponent } from './admin/datepicker/datepicker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  // Angular Material
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeadComponent,
    AdminComponent,
    EmployeesComponent,
    EmployeeDetailsComponent,
    DatepickerComponent,
    TasksComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    EmployeesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
