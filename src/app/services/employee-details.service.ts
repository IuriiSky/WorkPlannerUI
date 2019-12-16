import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Employee, CreateEmployee, EmployeeDetails, UpdateEmployee} from '../shared/interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsService {

  constructor(private http: HttpClient) {
  }

  baseApi = 'http://workplanner.softwaris.eu/api/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  getAllDetails(id: number) {
    return this.http.get<EmployeeDetails>(this.baseApi + 'Employees/' + id + '/details');
  }

  updateEmployee(employee: UpdateEmployee) {
    return this.http.put<any>(this.baseApi + 'Employees/' + employee.employeeId + '/update', employee, this.httpOptions);
  }
}
