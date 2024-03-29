import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { WorkPlanDto, CreateWorkPlanCommand, UpdateWorkPlanCommand, DeleteWorkPlanCommand, EmployeeTaskDto, WorkPlanRepeatingCommand, DeleteFutureEmployeeTaskCommand } from '../../shared/interfaces/work-plan';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkplansService {
  

  baseApi :string;
  constructor(private http: HttpClient) 
  { 
    this.baseApi = environment.apiUrl + 'WorkPlans/';
  }

  getEmployeesOwnTasksForDate(date: string): Observable<EmployeeTaskDto[]>{
    return this.http.get<EmployeeTaskDto[]>(environment.apiUrl + 'employeeTasks?startDate=' + date + '&endDate=' + date);
  }
  getEmployeesOwnTasksForDateRange(startDate: string, endDate: string): Observable<EmployeeTaskDto[]>{
    return this.http.get<EmployeeTaskDto[]>(environment.apiUrl + 'employeeTasks?startDate=' + startDate + '&endDate=' + endDate);
  }
  updateEmployeeTask(task: EmployeeTaskDto) {
    return this.http.put<any>(environment.apiUrl + 'employeeTasks/update',task);
  }

  deleteFutureTask(deleteFutureCommand: DeleteFutureEmployeeTaskCommand){
    return this.http.put<any>(environment.apiUrl + 'employeeTasks/deletefuture',deleteFutureCommand);
  }

  getWorkPlansForDepartment(date: Date|string,deparmentId:number): Observable<WorkPlanDto[]>{
    return this.http.get<WorkPlanDto[]>(this.baseApi + 'department/' + deparmentId + '/' + date);
  }
  // getWorkPlans(date: Date|string): Observable<WorkPlanDto[]>{
  //   return this.http.get<WorkPlanDto[]>(this.baseApi + date);
  // }

  getWorkPlansForEmployee(employeeId:number, fromDate: string,toDate: string = ""): Observable<WorkPlanDto[]>{
    return this.http.get<WorkPlanDto[]>(this.baseApi+ 'employee/' +  employeeId + '?fromDate=' + fromDate + "&toDate="+ toDate );
  }

  createWorkPlan(workplan: CreateWorkPlanCommand){
    return this.http.post<any>(this.baseApi,workplan);
  }

  // updateWorkPlan(workplan: UpdateWorkPlanCommand){
  //   return this.http.put<any>(this.baseApi,workplan);
  // }
  repeatWorkPlan(repeating: WorkPlanRepeatingCommand){
    return this.http.put<any>(this.baseApi+'repeating', repeating);
  }

  deleteWorkPlan(workPlan:DeleteWorkPlanCommand){
    return this.http.put<any>(this.baseApi+'delete',workPlan);
  }
}
