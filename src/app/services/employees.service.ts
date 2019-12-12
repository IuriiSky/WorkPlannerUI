import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../shared/interfaces/employee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  baseApi = 'http://workplanner.softwaris.eu/api/';

  getAllEmployees(): Observable<Employee[]> {
    return  this.http.get<Employee[]>(this.baseApi + 'Employees');
  }
}
