import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employees} from '../shared/interfaces/employees';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private http: HttpClient) { }

  baseApi = 'http://workplanner.softwaris.eu/api/';

  getAllEmployees(): Observable<Employees[]> {
    return  this.http.get<Employees[]>(this.baseApi + 'Employees');
  }
}
