import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EmployeeDto, CreateEmployeeCommand, EmployeeDetailsDto, UpdateEmployeeCommand } from '../shared/interfaces/employee';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseApi :string;
  httpOptions : any;
  constructor(private http: HttpClient, private dataService: DataService) 
  { 
    this.baseApi = dataService.baseApiUrl + 'Employees/';
    this.httpOptions = dataService.httpOptions;
  }

  getAllEmployees(): Observable<EmployeeDto[]> {
    return  this.http.get<EmployeeDto[]>(this.baseApi);
  }

  createEmployee(employee: CreateEmployeeCommand) {
    //return this.http.post<any>(this.baseApi + 'create', employee, this.httpOptions);
    return this.http.post<any>(this.baseApi + 'create', employee);
  }
  getAllDetails(id: number) {
    return this.http.get<EmployeeDetailsDto>(this.baseApi + id + '/details');
  }

  updateEmployee(employee: UpdateEmployeeCommand) {
    return this.http.put<any>(this.baseApi + employee.employeeId + '/update', employee);
    //return this.http.put<any>(this.baseApi + employee.employeeId + '/update', employee, this.httpOptions);
  }
}
