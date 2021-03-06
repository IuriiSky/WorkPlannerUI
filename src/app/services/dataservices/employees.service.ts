import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EmployeeDto, CreateEmployeeCommand, EmployeeDetailsDto, UpdateEmployeeCommand, PlanHolidayCommand, UpdateEmployeeCredentialsCommand } from '../../shared/interfaces/employee';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseApi :string;
  constructor(private http: HttpClient)
  {
    this.baseApi = environment.apiUrl + 'Employees/';
  }

  getAllEmployees() : Observable<EmployeeDto[]> 
  {
    return  this.http.get<EmployeeDto[]>(this.baseApi);
  }

  getAllEmployeesInDepartment(departmentId:number): Observable<EmployeeDto[]> 
  {
    return  this.http.get<EmployeeDto[]>(this.baseApi+'inDepartment?departmentId='+departmentId);
  }

  getAvailableEmployeesInDepartment(date:Date|string,departmentId:number) :Observable<EmployeeDto[]> {
    return this.http.get<EmployeeDto[]>(this.baseApi + 'available?date=' + date + '&departmentId=' + departmentId);
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
