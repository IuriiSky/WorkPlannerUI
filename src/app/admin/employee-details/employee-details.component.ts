import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CreateEmployeeCommand, EmployeeDto, EmployeeDetailsDto, UpdateEmployeeCommand, PlanHolidayCommand } from '../../shared/interfaces/employee';
import { FormControl, FormGroup } from '@angular/forms';
import { EmployeesService } from 'src/app/services/employees.service';
import {formatNumber} from '@angular/common';
// Angular Material

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  constructor(public employeeService: EmployeesService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.employeeId = params.id;
        this.employeeHoliday.employeeId = params.id;
      }
    });
  }

  showChangeNameForm = true;
  showChangeColorForm = true;

  modifyEmployee: FormGroup;

  public employeeDetail: EmployeeDetailsDto;

  public employeeId: number;

  public employeeUpdate: UpdateEmployeeCommand = {
    employeeId: 0,
    employeeName: '',
    colorCode: ''
  };

  public  employeeHoliday: PlanHolidayCommand = {
    employeeId: 0,
    startDate: Date,
    endDate: Date,
  };

  openSidenavSettings() {
    document.getElementById('sidenav-settings').style.width = '200px';
    document.getElementById('info').style.marginLeft = '200px';
  }

  closeSidenavSetting() {
    document.getElementById('sidenav-settings').style.width = '0';
    document.getElementById('info').style.marginLeft = '0';
  }

  toggleShowChangeNameForm() {
    this.showChangeNameForm = !this.showChangeNameForm;
  }

  toggleShowChangeColorForm() {
    this.showChangeColorForm = !this.showChangeColorForm;
  }

  updateName() {
    this.employeeService.updateEmployee(this.employeeUpdate).subscribe(employee => {
      this.initDetailsEmployee();
      this.showChangeNameForm = true;
    });
  }

  updateColor() {
    this.employeeService.updateEmployee(this.employeeUpdate).subscribe(employee => {
      this.initDetailsEmployee();
      this.showChangeColorForm = true;
    });
  }

  private initUpdateEmployee() {
    this.employeeUpdate.employeeId = this.employeeDetail.id;
    this.employeeUpdate.employeeName = this.employeeDetail.name;
    this.employeeUpdate.colorCode = this.employeeDetail.colorCode;
  }

  initDetailsEmployee() {
    this.employeeService.getEmployeeDetails(this.employeeId).subscribe((data: EmployeeDetailsDto) => {
      this.employeeDetail = data;
      this.initUpdateEmployee();
    });
  }

  getHolidays() {
    this.employeeService.planEmployeeHoliday(this.employeeId, this.employeeHoliday).subscribe((data: PlanHolidayCommand) => {
      this.employeeHoliday = data;
    });
  }

  ngOnInit() {
    this.initDetailsEmployee();

    this.modifyEmployee = new FormGroup({
      employeeName: new FormControl(''),
      colorCode: new FormControl('')
    });
  }
}
