import { Component, OnInit } from '@angular/core';
import {CreateEmployee, Employee} from '../../shared/interfaces/employee';
import { EmployeesService} from '../../services/employees.service';
import { Router } from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(private employeesService: EmployeesService,
              private router: Router) {
  }

  createEmployee: FormGroup;

  showCreateForm = true;

  public employees: Employee[];

  public createNewEmployee: CreateEmployee = {
    employeeName: '',
    colorCode: '',
  };

  toggleShowCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  addEmployee() {
    this.employeesService.createEmployee(this.createNewEmployee).subscribe(employee => {
      this.createNewEmployee.employeeName = '';
      this.createNewEmployee.colorCode = '';
      this.showCreateForm = false;
      window.location.reload();
    });
  }

  ngOnInit() {
    this.employeesService.getAllEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
    });

    this.createEmployee = new FormGroup({
      employeeName: new FormControl(''),
      colorCode: new FormControl('')
    });
  }
}
