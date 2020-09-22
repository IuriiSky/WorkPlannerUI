import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkplansService } from 'src/app/services/dataservices/workplans.service';
import { EmployeeTaskDto, WorkPlanDto } from 'src/app/shared/interfaces/work-plan';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.css']
})
export class EmployeeTasksComponent implements OnInit {

  constructor(private plannerService: WorkplansService,private datepipe: DatePipe,) { }
  private employeeTasks : EmployeeTaskDto[];
  
  groupedTask: Map<Date, EmployeeTaskDto[]> = new Map<Date, EmployeeTaskDto[]>();;

  mapTasks(employeeTasks : EmployeeTaskDto[]){
    employeeTasks.forEach(task => {
      if (this.groupedTask.has(task.date)){
        let dateTasks = this.groupedTask.get(task.date);
        dateTasks.push(task);
        this.groupedTask.set(task.date,dateTasks);
      }else
      {
        this.groupedTask.set(task.date,[task])
      }
    });
    console.log(this.groupedTask);
  }

  ngOnInit() {
    let stringDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    this.plannerService.getEmployeesOwnTasks(stringDate).subscribe((data : EmployeeTaskDto[]) => {
      this.mapTasks(data);
      this.employeeTasks = data;
    });
  }

}
