import { Component, OnInit } from '@angular/core';
import { Employees} from '../../shared/interfaces/employees';
import { EmployeesService} from '../../services/employees.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  public employees: Employees[];

  constructor(private employeesService: EmployeesService,
              private router: Router) {
  }

  ngOnInit() {
    this.employeesService.getAllEmployees().subscribe((data: Employees[]) => {
      this.employees = data;
    });
  }
}
