import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


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
 import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
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
import { MatMomentDateModule} from '@angular/material-moment-adapter';
import { TaskRepeatComponent } from './admin/task-repeat/task-repeat.component';

export const DateFormats = {
  parse: {
      dateInput: ['DD/MM/YYYY']
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
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
    TaskOverviewComponent,
    TaskRepeatComponent
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
    MatDividerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    AuthModule,
    MatMomentDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BusyInterceptor,multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: DateAdapter, useClass: MomentUtcDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats },
    
    EmployeesService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
