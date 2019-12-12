import { Component, OnInit} from '@angular/core';
import { EmployeeDetails} from '../../shared/interfaces/employee-details';
import { EmployeeDetailsService} from '../../services/employee-details.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  private baseApi = 'http://workplanner.softwaris.eu/api/';

  public employeeDetail: EmployeeDetails;

  public employeeId: number;

  constructor(public employeeDetailsService: EmployeeDetailsService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      if (params.id) {
        this.employeeId = params.id;
      }
    });
  }

ngOnInit() {
    this.employeeDetailsService.getAllDetails(this.employeeId).subscribe((data: EmployeeDetails) => {
      this.employeeDetail = data;
    });
  }
}
