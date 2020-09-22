import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EmployeeDto, CreateEmployeeCommand, EmployeeDetailsDto, UpdateEmployeeCommand, PlanHolidayCommand, UpdateEmployeeCredentialsCommand } from '../shared/interfaces/employee';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseApi :string;
  httpOptions : any;
  constructor(private http: HttpClient, dataService: DataService)
  {
    this.baseApi = dataService.baseApiUrl + 'Employees/';
    this.httpOptions = dataService.httpOptions;
  }

  getAllEmployees() : Observable<EmployeeDto[]> 
  {
    return  this.http.get<EmployeeDto[]>(this.baseApi);
  }

  getAllEmployeesInDepartment(departmentId:number): Observable<EmployeeDto[]> 
  {
    return  this.http.get<EmployeeDto[]>(this.baseApi+'inDepartment?departmentId='+departmentId);
  }

  getAvailableEmployees(date:Date|string) :Observable<EmployeeDto[]> {
    return this.http.get<EmployeeDto[]>(this.baseApi);
  }

  getEmployeeDetails(employeeId: number) {
    return this.http.get<EmployeeDetailsDto>(this.baseApi + employeeId + '/details');
  }

  createEmployee(employee: CreateEmployeeCommand) {
    return this.http.post<any>(this.baseApi + 'create', employee);
  }

  updateEmployee(employee: UpdateEmployeeCommand) {
    return this.http.put<any>(this.baseApi + employee.employeeId + '/update', employee);
  }
  updateCredentials(updateCredentialsCommand: UpdateEmployeeCredentialsCommand) {
    return this.http.put<any>(this.baseApi + updateCredentialsCommand.employeeId + '/updatecredentials', updateCredentialsCommand);
  }

  planEmployeeHoliday(employeeId: number, holiday: PlanHolidayCommand ) {
    return this.http.post<any>(this.baseApi + employeeId + '/createHoliday', holiday);
  }

  deleteHoliday(employeeId: number, holidayStart: string |Date ) {
    return this.http.delete<any>(this.baseApi + employeeId + '/deleteHoliday?holidayStart=' + holidayStart);
  }
}
