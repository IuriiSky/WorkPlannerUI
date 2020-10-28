import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateEmployeeCommand, EmployeeDto } from '../../shared/interfaces/employee';
import { EmployeesService } from '../../services/dataservices/employees.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartamentService } from 'src/app/services/departament.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/authentication.service';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit, OnDestroy {

  constructor(private employeesService: EmployeesService,private departmentService: DepartamentService,private authService : AuthenticationService) {
    
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
      this.createNewEmployee.colorCode = '#ff0000';
      this.createNewEmployee.login = '';
      this.createNewEmployee.password = '';
      this.createNewEmployee.departmentId = 0;
      this.showCreateForm = true;
      this.getAllEmployees();
    });
  }

  getAllEmployees() {
    if(this.authService.isSuperAdmin()){

      this.employeesService.getAllEmployees().subscribe((data: EmployeeDto[]) => {
        this.employees = data;
      });
    }else if(this.authService.isAdmin()){
      let departmentId = this.departmentService.departmentSubject.getValue();
      this.employeesService.getAllEmployeesInDepartment(departmentId).subscribe((data: EmployeeDto[]) => {
        this.employees = data;
      });
    }
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
