import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

// Helpers
import {BusyInterceptor} from './_helpers/busy.interceptor';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';

  // Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeadComponent } from './head/head.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeesComponent } from './admin/employees/employees.component';
import { TasksComponent } from './admin/tasks/tasks.component';
import { PlannerComponent } from './admin/planner/planner.component';
import { EmployeesListComponent } from './admin/employees-list/employees-list.component';
import { TasksListComponent } from './admin/tasks-list/tasks-list.component';
import { LoginComponent } from './login/login.component';
import { TaskOverviewComponent } from './admin/task-overview/task-overview.component';
  // Shared components
import { LoadingComponent } from './shared/components/loading/loading.component';
  // Services
import { EmployeesService} from './services/dataservices/employees.service';
import { EmployeeDetailsComponent } from './admin/employee-details/employee-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

  // Angular Material
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatFormFieldModule, MatInputModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { AuthModule } from './auth/auth.module';
import { EmployeeTasksComponent } from './employee/employee-tasks/employee-tasks.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MomentUtcDateAdapter } from './decorators/moment-utc-date-adapter';
import { MatMomentDateModule, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeadComponent,
    AdminComponent,
    EmployeesComponent,
    EmployeeDetailsComponent,
    TasksComponent,
    PlannerComponent,
    EmployeesListComponent,
    TasksListComponent,
    LoginComponent,
    LoadingComponent,
    LoadingComponent,
    NavigationComponent,
    EmployeeTasksComponent,
    CalendarComponent,
    TaskOverviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSlideToggleModule,
    AuthModule,
    MatMomentDateModule
  ],
  // exports:[
  //   MatCardModule
  // ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BusyInterceptor,multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    EmployeesService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
