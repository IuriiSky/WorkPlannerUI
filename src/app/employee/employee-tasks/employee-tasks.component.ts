import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { WorkplansService } from 'src/app/services/dataservices/workplans.service';
import { DeleteFutureEmployeeTaskCommand, EmployeeTaskDto } from 'src/app/shared/interfaces/work-plan';

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
  
  private today : Date = new Date();
  
  
  slideToggled(task:EmployeeTaskDto){
    this.plannerService.updateEmployeeTask(task).subscribe(
      (data : any) => {
        this.getTodaysTask();
    },
    (err)=>{
      console.log(err);  
    });
  }

  deleteFutureTask(task:EmployeeTaskDto){
    if (confirm('Det  handling du er i gang i, fjerne alle fremtidige opgaver af vælgte type. Er du sikker ?')) {
      let delFuture: DeleteFutureEmployeeTaskCommand = {
        taskId: task.taskId,
        deleteFrom: this.datepipe.transform(task.date,'yyyy-MM-dd')
      };
      this.plannerService.deleteFutureTask(delFuture).subscribe(
        (data:any)=>{this.ngOnInit();}
        );
    }
  }

  getTodaysTask(){
    let todayString = this.datepipe.transform(this.today, 'yyyy-MM-dd');
    this.plannerService.getEmployeesOwnTasksForDate(todayString).subscribe((data : EmployeeTaskDto[]) => {
      data.sort((t1,t2)=>{
        return (t1.isDone === t2.isDone)?0: t1.isDone? 1 : -1;
      })
      this.todaysTasks = data;
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
    
    this.plannerService.getEmployeesOwnTasksForDateRange(afterTommorowString,aboutWeekString).subscribe((data : EmployeeTaskDto[]) => {
      this.weekTasks = data;
    });
  }
  
  private updatePeriod : number = 10 * 60 * 1000;
  timerSubsription : Subscription;
  createTodayTaskRefreshSubscription(){
    if(this.timerSubsription){
      this.timerSubsription.unsubscribe();
    } 
    const source = timer(0, this.updatePeriod);
    this.timerSubsription = source.subscribe(x =>
      {
        this.getTodaysTask();
      });
  }

  ngOnInit() {
    this.tommorowTasks = undefined;
    this.weekTasks = undefined;
    this.createTodayTaskRefreshSubscription();
  }

  ngOnDestroy(): void {
    this.timerSubsription.unsubscribe();
  }
}
