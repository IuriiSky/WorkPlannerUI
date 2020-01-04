import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmployeeDetailsDto, UpdateEmployeeCommand, PlanHolidayCommand, DeleteHolidayCommand, HolidayDto } from '../../shared/interfaces/employee';
import { FormControl, FormGroup } from '@angular/forms';
import { EmployeesService } from 'src/app/services/employees.service';
import {TaskDto} from '../../shared/interfaces/task';

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
        // this.employeeHoliday.employeeId = params.id;
      }
    });
  }

  showChangeNameForm = true;
  showChangeColorForm = true;

  modifyEmployee: FormGroup;

  public employeeDetail: EmployeeDetailsDto;

  public employeeId: number;

  public  activeHoliday: HolidayDto;

  public employeeUpdate: UpdateEmployeeCommand = {
    employeeId: 0,
    employeeName: '',
    colorCode: ''
  };

  public  employeeHoliday: PlanHolidayCommand = {
    employeeId: 0,
    startDate: '',
    endDate: '',
  };

  public employeeDeleteHoliday: DeleteHolidayCommand = {
    employeeId: 0,
    startDate: '',
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

  createHolidays() {
    this.employeeHoliday.employeeId = Number(this.employeeId);
    this.employeeService.planEmployeeHoliday(this.employeeId, this.employeeHoliday).subscribe(() => {
      this.initDetailsEmployee();
    });
  }

  setActiveHoliday(holidayDto: HolidayDto) {
    this.activeHoliday = holidayDto;
  }

  deleteHolidays() {
    this.employeeDeleteHoliday.startDate = this.activeHoliday.startDate;
    this.employeeService.deleteHoliday(this.employeeId, this.employeeDeleteHoliday.startDate).subscribe((data: EmployeeDetailsDto) => {
      this.initDetailsEmployee();
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
