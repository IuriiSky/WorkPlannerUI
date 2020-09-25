import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkplansService } from 'src/app/services/dataservices/workplans.service';
import { EmployeeTaskDto } from 'src/app/shared/interfaces/work-plan';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.css']
})
export class EmployeeTasksComponent implements OnInit {

  constructor(private plannerService: WorkplansService,private datepipe: DatePipe,) { }
  public todaysTasks : EmployeeTaskDto[];
  public tommorowTasks : EmployeeTaskDto[];
  public weekTasks : EmployeeTaskDto[];
  private today : Date;
  
  slideToggled(task:EmployeeTaskDto){
    this.plannerService.updateEmployeeTask(task).subscribe(
      (data : any) => {
        this.todaysTasks.sort((t1,t2)=>{
          return (t1.isDone === t2.isDone)?0: t1.isDone? 1 : -1;
        })
    },
    (err)=>{
      console.log(err);  
    });
  }
  
  getTommorowTasks(){
    let tommorow = new Date();
    tommorow.setDate(this.today.getDate() + 1);
    let tommorowString =  this.datepipe.transform(tommorow, 'yyyy-MM-dd');
    this.plannerService.getEmployeesOwnTasksForDate(tommorowString).subscribe((data : EmployeeTaskDto[]) => {
      this.tommorowTasks = data;
    });
  }
  
  getWeekTasks(){
    let afterTomorrow = new Date();
    afterTomorrow.setDate(this.today.getDate() + 2);
    let afterTommorowString =  this.datepipe.transform(afterTomorrow, 'yyyy-MM-dd');

    let aboutWeek = new Date();
    aboutWeek.setDate(this.today.getDate() + 7);
    let aboutWeekString =  this.datepipe.transform(aboutWeek, 'yyyy-MM-dd');
    console.log(aboutWeekString);
    this.plannerService.getEmployeesOwnTasksForDateRange(afterTommorowString,aboutWeekString).subscribe((data : EmployeeTaskDto[]) => {
      this.weekTasks = data;
    });

  }
  // nextDay() {
  //   let date = new Date(this.currentDate.getTime());
  //   date.setDate(this.currentDate.getDate() + 1);
  //   this.currentDate = date;
  //   this.setActiveEmployee(this.employee);
  // }

  ngOnInit() {
    this.today = new Date();
    let todayString = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    this.plannerService.getEmployeesOwnTasksForDate(todayString).subscribe((data : EmployeeTaskDto[]) => {
      //this.mapTasks(data);
      this.todaysTasks = data;
    });
  }

}
