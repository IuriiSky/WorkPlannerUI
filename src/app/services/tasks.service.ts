import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { TaskDto, CreateTaskCommand, UpdateTaskCommand } from '../shared/interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  baseApi :string;
  httpOptions : any;
  constructor(private http: HttpClient, private dataService: DataService) 
  { 
    this.baseApi = dataService.baseApiUrl + 'Tasks/';
    this.httpOptions = dataService.httpOptions;
  }

  getAllTasks(): Observable<TaskDto[]> {
    return  this.http.get<TaskDto[]>(this.baseApi);
  }

  createTask(task: CreateTaskCommand){
    return this.http.post<any>(this.baseApi + 'create', task);
  }

  updateTask(task:UpdateTaskCommand){
    return this.http.put<any>(this.baseApi + task.taskId + '/update', task);
  }
}
