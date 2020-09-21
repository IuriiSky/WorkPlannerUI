import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { WorkPlanDto, CreateWorkPlanCommand, UpdateWorkPlanCommand, DeleteWorkPlanCommand } from '../../shared/interfaces/work-plan';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkplansService {
  
  getEmployeesOwnTasks(stringDate: string): Observable<WorkPlanDto[]>{
    return this.http.get<WorkPlanDto[]>(this.baseApi+ 'employee?date='+stringDate );
  }

  baseApi :string;
  constructor(private http: HttpClient) 
  { 
    this.baseApi = environment.apiUrl + 'WorkPlans/';
  }

  getWorkPlans(date: Date|string): Observable<WorkPlanDto[]>{
    return this.http.get<WorkPlanDto[]>(this.baseApi + date);
  }

  getWorkPlansForEmployee(date: Date|string, employeeId:number): Observable<WorkPlanDto[]>{
    return this.http.get<WorkPlanDto[]>(this.baseApi+ 'employee/' +  employeeId + '/' + date );
  }

  createWorkPlan(workplan: CreateWorkPlanCommand){
    return this.http.post<any>(this.baseApi,workplan);
  }

  updateWorkPlan(workplan: UpdateWorkPlanCommand){
    return this.http.put<any>(this.baseApi,workplan);
  }

  deleteWorkPlan(workPlan:DeleteWorkPlanCommand){
    return this.http.put<any>(this.baseApi+'delete',workPlan);
  }
}