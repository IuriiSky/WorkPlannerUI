import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeDetails} from '../shared/interfaces/employee-details';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDetailsService {

  constructor(private http: HttpClient) {
  }

  baseApi = 'http://workplanner.softwaris.eu/api/';

  getAllDetails(id: number) {
    return this.http.get<EmployeeDetails>(this.baseApi + 'Employees/' + id + '/details');
  }

}

