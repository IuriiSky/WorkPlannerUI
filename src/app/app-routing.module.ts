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
import { EmployeeTasksComponent } from './employee/employee-tasks/employee-tasks.component';
import { TaskOverviewComponent } from './admin/task-overview/task-overview.component';
import {TaskWeekOverviewComponent} from './admin/task-week-overview/task-week-overview.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: 'employees', component: EmployeesComponent, canActivate: [AdminGuard]},
  {path: 'employees/:id', component: EmployeeDetailsComponent, canActivate: [AdminGuard]},
  {path: 'tasks', component: TasksComponent, canActivate: [AdminGuard]},
  {path: 'planner', component: PlannerComponent, canActivate: [AdminGuard]},
  {path: 'employeesTasks', component: EmployeeTasksComponent },
  {path: 'login', component: LoginComponent},
  {path: 'overview', component: TaskOverviewComponent},
  {path: 'week-overview', component: TaskWeekOverviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
