import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { WorkPlanDto, CreateWorkPlanCommand, UpdateWorkPlanCommand, DeleteWorkPlanCommand } from '../shared/interfaces/work-plan';

@Injectable({
  providedIn: 'root'
})
export class WorkplansService {

  baseApi :string;
  httpOptions : any;
  constructor(private http: HttpClient, private dataService: DataService) 
  { 
    this.baseApi = dataService.baseApiUrl + 'WorkPlans/';
    this.httpOptions = dataService.httpOptions;
  }

  getWorkPlans(date: Date|string): Observable<WorkPlanDto[]>{
    return this.http.get<WorkPlanDto[]>(this.baseApi + date);
  }

  getWorkPlansForEmployee(date: Date|string, employeeId:number): Observable<WorkPlanDto[]>{
    return this.http.get<WorkPlanDto[]>(this.baseApi + date + '/employee/' + employeeId);
  }

  createWorkPlan(workplan: CreateWorkPlanCommand){
    return this.http.post<any>(this.baseApi,workplan);
  }

  updateWorkPlan(workplan: UpdateWorkPlanCommand){
    return this.http.put<any>(this.baseApi,workplan);
  }

  dleteWorkPlan(workPlan:DeleteWorkPlanCommand){
    return this.http.put<any>(this.baseApi,workPlan);
  }
}
