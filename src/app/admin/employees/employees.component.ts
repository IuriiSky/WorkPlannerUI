import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateEmployeeCommand, EmployeeDto } from '../../shared/interfaces/employee';
import { EmployeesService } from '../../services/employees.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartamentService } from 'src/app/services/departament.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, OnDestroy {

  constructor(private employeesService: EmployeesService,private departmentService: DepartamentService) {
    
  }
  
  departmentSubscription: Subscription;
  
  createEmployee: FormGroup;

  showCreateForm = true;

  public employees: EmployeeDto[];

  public createNewEmployee: CreateEmployeeCommand = {
    employeeName: '',
    colorCode: '#ff0000',
    login: '',
    password: '',
    departmentId : 0
  };

  toggleShowCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  addEmployee() {
    this.createNewEmployee.departmentId = this.departmentService.departmentSubject.getValue();
    this.employeesService.createEmployee(this.createNewEmployee).subscribe(employee => {
      this.createNewEmployee.employeeName = '';
      this.createNewEmployee.colorCode = '';
      this.createNewEmployee.login = '';
      this.createNewEmployee.password = '';
      this.createNewEmployee.departmentId = 0;
      this.showCreateForm = true;
      this.getAllEmployees();
    });
  }

  getAllEmployees() {
    let departmentId = this.departmentService.departmentSubject.getValue();
    this.employeesService.getAllEmployeesInDepartment(departmentId).subscribe((data: EmployeeDto[]) => {
      this.employees = data;
    });
  }


  listenToDepartment() {
    this.departmentSubscription = this.departmentService.departmentSubject
      .pipe(delay(0))
      .subscribe(() => {
        this.getAllEmployees();
      })
  }
  ngOnInit() {
    this.listenToDepartment();
    this.createEmployee = new FormGroup({
      employeeName: new FormControl(''),
      colorCode: new FormControl(''),
      login: new FormControl(''),
      password: new FormControl(''),
    });
  }
  ngOnDestroy(): void {
    this.departmentSubscription.unsubscribe();
  }

  
}
