import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmployeeDetailsDto, UpdateEmployeeCommand, PlanHolidayCommand, HolidayDto, UpdateEmployeeCredentialsCommand } from '../../shared/interfaces/employee';
import { FormControl, FormGroup } from '@angular/forms';
import { EmployeesService } from 'src/app/services/employees.service';

// Angular Material

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  constructor(public employeeService: EmployeesService, private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.employeeId = params.id;
        // this.employeeHoliday.employeeId = params.id;
      }
    });
  }
  showChangeInfoForm = true;
  showChangeCredentialsForm = true;

  showInfo = false;
  showSettings = false;

  modifyEmployee: FormGroup;
  modifyCredentials: FormGroup;

  public employeeDetail: EmployeeDetailsDto;

  public employeeId: number;

  public employeeUpdate: UpdateEmployeeCommand = {
    employeeId: 0,
    employeeName: '',
    colorCode: ''
  };
  public credentialsUpdate : UpdateEmployeeCredentialsCommand = {
    employeeId: 0,
    password: '',
    isActive: true,
  };

  public  employeeHoliday: PlanHolidayCommand = {
    employeeId: 0,
    startDate: '',
    endDate: '',
  };

  // public employeeDeleteHoliday: DeleteHolidayCommand = {
  //   employeeId: 0,
  //   startDate: '',
  // };

  sidenavSettings() {
    this.showInfo = !this.showInfo;
    this.showSettings = !this.showSettings
  }

  closeSidenavSettings() {
    this.showSettings = false;
    this.showInfo = false;
  }

  // closeSidenavSetting() {
  //   this.showInfo = !this.showInfo;
  //   this.showSettings = !this.showSettings
  // }

  toggleShowChangeInfoForm() {
    this.showChangeInfoForm = !this.showChangeInfoForm;
    this.initUpdateEmployee();
  }

  toggleShowChangeCredentialsForm() {
    this.showChangeCredentialsForm = !this.showChangeCredentialsForm;
    this.initUpdateEmployee();
  }

  updateUserInfo() {
    this.employeeService.updateEmployee(this.employeeUpdate).subscribe(employee => {
      this.initDetailsEmployee();
      this.showChangeInfoForm = true;
    });
  }

  updateCredentials() {
    this.employeeService.updateEmployee(this.employeeUpdate).subscribe(employee => {
      this.initDetailsEmployee();
      this.showChangeCredentialsForm = true;
    });
  }

  private initUpdateEmployee() {
    this.employeeUpdate.employeeId = this.employeeDetail.id;
    this.employeeUpdate.employeeName = this.employeeDetail.name;
    this.employeeUpdate.colorCode = this.employeeDetail.colorCode;

    this.credentialsUpdate.employeeId = this.employeeDetail.id;
    this.credentialsUpdate.isActive = this.employeeDetail.isActive;
  }

  initDetailsEmployee() {
    this.employeeService.getEmployeeDetails(this.employeeId).subscribe((data: EmployeeDetailsDto) => {
      this.employeeDetail = data;
      this.initUpdateEmployee();
    });
  }

  createHolidays() {
    this.employeeHoliday.employeeId = Number(this.employeeId);
    this.employeeService.planEmployeeHoliday(this.employeeId, this.employeeHoliday).subscribe(() => {
      this.initDetailsEmployee();
    });
  }


  deleteHolidays(holiday: HolidayDto) {
    this.employeeService.deleteHoliday(this.employeeId, holiday.startDate).subscribe((data: EmployeeDetailsDto) => {
      this.employeeDetail = data;
      this.initUpdateEmployee();
    });
  }

  ngOnInit() {
    this.initDetailsEmployee();
    this.modifyEmployee = new FormGroup({
      employeeName: new FormControl(''),
      colorCode: new FormControl('')
    });

    this.modifyCredentials = new FormGroup({
      password: new FormControl(''),
      isActive: new FormControl('')
    });
  }
}
