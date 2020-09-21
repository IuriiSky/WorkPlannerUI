import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkplansService } from 'src/app/services/dataservices/workplans.service';
import { WorkPlanDto } from 'src/app/shared/interfaces/work-plan';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.css']
})
export class EmployeeTasksComponent implements OnInit {

  constructor(private plannerService: WorkplansService,private datepipe: DatePipe,) { }
  private employeeWorkPlan : WorkPlanDto[];
  

  ngOnInit() {
    let stringDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    this.plannerService.getEmployeesOwnTasks(stringDate).subscribe((data : WorkPlanDto[]) => {
      this.employeeWorkPlan = data;
    });
  }

}
