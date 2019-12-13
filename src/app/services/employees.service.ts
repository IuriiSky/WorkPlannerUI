import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Employee, CreateEmployee } from '../shared/interfaces/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  baseApi = 'http://workplanner.softwaris.eu/api/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  getAllEmployees(): Observable<Employee[]> {
    return  this.http.get<Employee[]>(this.baseApi + 'Employees');
  }

  createEmployee(employee: CreateEmployee) {
    return this.http.post<any>(this.baseApi + 'Employees/create',employee, this.httpOptions);
  }
}
