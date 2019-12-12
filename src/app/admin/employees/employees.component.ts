import { Component, OnInit } from '@angular/core';
import { Employee} from '../../shared/interfaces/employee';
import { EmployeesService} from '../../services/employees.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  public employees: Employee[];

  constructor(private employeesService: EmployeesService,
              private router: Router) {
  }

  ngOnInit() {
    this.employeesService.getAllEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
    });
  }
}
