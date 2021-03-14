import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { TaskDto, CreateTaskCommand, UpdateTaskCommand } from '../../shared/interfaces/task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  baseApi: string;
  //httpOptions: any;
  constructor(private http: HttpClient) {
    this.baseApi = environment.apiUrl + 'Tasks/';
    //this.httpOptions = dataService.httpOptions;
  }

  getAllTasks(departmentId:number): Observable<TaskDto[]> {
    return  this.http.get<TaskDto[]>(this.baseApi+'?departmentId=' + departmentId);
  }

  createTask(task: CreateTaskCommand) {
    return this.http.post<any>(this.baseApi + 'create', task);
  }

  updateTask(task: UpdateTaskCommand) {
    return this.http.put<any>(this.baseApi + task.taskId + '/update', task);
  }
}
