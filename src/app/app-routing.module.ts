import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { EmployeesComponent } from './admin/employees/employees.component';
import { EmployeeDetailsComponent } from './admin/employee-details/employee-details.component';
import { TasksComponent } from './admin/tasks/tasks.component';
import { PlannerComponent} from './admin/planner/planner.component';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './auth/admin.guard';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: 'Employees', component: EmployeesComponent, canActivate: [AdminGuard]},
  {path: 'Employees/:id', component: EmployeeDetailsComponent, canActivate: [AdminGuard]},
  {path: 'Tasks', component: TasksComponent, canActivate: [AdminGuard]},
  {path: 'Planner', component: PlannerComponent, canActivate: [AdminGuard]},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
