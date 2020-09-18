import { Component, OnInit } from '@angular/core';
import { CreateEmployeeCommand, EmployeeDto } from '../../shared/interfaces/employee';
import { EmployeesService } from '../../services/employees.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DepartamentService } from 'src/app/services/departament.service';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  constructor(private employeesService: EmployeesService,private departmentService: DepartamentService) {
    
  }
  
  createEmployee: FormGroup;

  showCreateForm = true;

  public employees: EmployeeDto[];

  public createNewEmployee: CreateEmployeeCommand = {
    employeeName: '',
    colorCode: '#ff0000',
  };

  toggleShowCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  addEmployee() {
    this.employeesService.createEmployee(this.createNewEmployee).subscribe(employee => {
      this.createNewEmployee.employeeName = '';
      this.createNewEmployee.colorCode = '';
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

  ngOnInit() {
    this.getAllEmployees();
    this.createEmployee = new FormGroup({
      employeeName: new FormControl(''),
      colorCode: new FormControl('')
    });
    this.listenToDepartment();
  }

  listenToDepartment() {
    this.departmentService.departmentSubject
      .pipe(delay(0))
      .subscribe(() => {
        this.getAllEmployees();
      })
  }
}
