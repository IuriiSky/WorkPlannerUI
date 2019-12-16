import { Component, OnInit} from '@angular/core';
import { EmployeeDetailsService} from '../../services/employee-details.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CreateEmployee, Employee, EmployeeDetails, UpdateEmployee} from '../../shared/interfaces/employee';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  constructor(public employeeDetailsService: EmployeeDetailsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.employeeId = params.id;
      }
    });
  }

  showChangeNameForm = true;
  showChangeColorForm = true;

  private baseApi = 'http://workplanner.softwaris.eu/api/';

  modifyEmployee: FormGroup;

  public employeeDetail: EmployeeDetails;

  public employeeId: number;

  public employeeUpdate: UpdateEmployee = {
    employeeId: 0,
    employeeName: '',
    colorCode: ''
  };

  openSidenavSettings() {
    document.getElementById('sidenav-settings').style.width =  '200px';
    document.getElementById('info').style.marginLeft = '200px';
  }

  closeSidenavSetting() {
    document.getElementById('sidenav-settings').style.width =  '0';
    document.getElementById('info').style.marginLeft = '0';
  }

  toggleShowChangeNameForm() {
    this.showChangeNameForm = !this.showChangeNameForm;
  }

  toggleShowChangeColorForm() {
    this.showChangeColorForm = !this.showChangeColorForm;
  }

  updateName() {
    // this.employeeUpdate.employeeId = this.employeeDetail.id;
    // this.employeeUpdate.colorCode = this.employeeDetail.colorCode;
    this.employeeDetailsService.updateEmployee(this.employeeUpdate).subscribe(employee => {
      this.initDetailsEmployee();
      this.showChangeNameForm = true;
      });
  }

  private initUpdateEmployee() {
    this.employeeUpdate.employeeId = this.employeeDetail.id;
    this.employeeUpdate.employeeName = this.employeeDetail.name;
    this.employeeUpdate.colorCode = this.employeeDetail.colorCode;
  }

  initDetailsEmployee() {
    this.employeeDetailsService.getAllDetails(this.employeeId).subscribe((data: EmployeeDetails) => {
      this.employeeDetail = data;
      this.initUpdateEmployee();
    });
  }

  // putEmployee() {
  //   this.employeeUpdate.id = this.employeeDetail.id;
  //   this.employeeDetailsService.updateEmployee(this.employeeUpdate).subscribe(employee => {
  //    this.employeeUpdate.employeeName = '';
  //    this.showChangeNameForm = true;
  //  });
  // }



ngOnInit() {
    this.initDetailsEmployee();

    this.modifyEmployee = new FormGroup({
    employeeName: new FormControl(''),
    colorCode: new FormControl('')
  });


}
  }

// public employeeUpdate: UpdateEmployee = {
//   employeeId: this.employeeDetail.id,
//   employeeName: this.employeeDetail.name,
//   colorCode: this.employeeDetail.colorCode,
// };
