import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
  // Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeadComponent } from './head/head.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeesComponent } from './admin/employees/employees.component';
  // Services
import { EmployeesService} from './services/employees.service';
import { EmployeeDetailsComponent } from './admin/employee-details/employee-details.component';
import { EmployeeDetailsService } from './services/employee-details.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeadComponent,
    AdminComponent,
    EmployeesComponent,
    EmployeeDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [EmployeesService,
              EmployeeDetailsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
