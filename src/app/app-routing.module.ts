import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent} from './home/home.component';
import { AdminComponent} from './admin/admin.component';
import { EmployeesComponent} from './admin/employees/employees.component';
import { EmployeeDetailsComponent} from './admin/employee-details/employee-details.component';
import {TasksComponent} from './admin/tasks/tasks.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'Employees', component: EmployeesComponent},
  {path: 'Employees/:id', component: EmployeeDetailsComponent},
  {path: 'Tasks', component: TasksComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
