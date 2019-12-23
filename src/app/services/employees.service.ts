import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Employee, CreateEmployee, EmployeeDetails, UpdateEmployee } from '../shared/interfaces/employee';
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

  getAllEmployees(): Observable<Employee[]> {
    return  this.http.get<Employee[]>(this.baseApi);
  }

  createEmployee(employee: CreateEmployee) {
    //return this.http.post<any>(this.baseApi + 'create', employee, this.httpOptions);
    return this.http.post<any>(this.baseApi + 'create', employee);
  }
  getAllDetails(id: number) {
    return this.http.get<EmployeeDetails>(this.baseApi + id + '/details');
  }

  updateEmployee(employee: UpdateEmployee) {
    return this.http.put<any>(this.baseApi + employee.employeeId + '/update', employee);
    //return this.http.put<any>(this.baseApi + employee.employeeId + '/update', employee, this.httpOptions);
  }
}
