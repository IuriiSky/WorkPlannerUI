import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartamentService {

  baseApi: string;
  httpOptions: any;

  constructor(private http: HttpClient, private dataService: DataService) { 
    this.baseApi = dataService.baseApiUrl + 'department/';
    this.httpOptions = dataService.httpOptions;
  }

}
