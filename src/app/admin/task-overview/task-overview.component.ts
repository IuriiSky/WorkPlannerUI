import { Component, OnInit, Input} from '@angular/core';
import { WorkplansService } from 'src/app/services/dataservices/workplans.service';
import { DatePipe } from '@angular/common';
import { WorkPlanDto } from 'src/app/shared/interfaces/work-plan';
import { DepartamentService } from 'src/app/services/departament.service';
import { Subscription, timer } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.css']
})
export class TaskOverviewComponent implements OnInit {

  constructor(
    private departmentService: DepartamentService,
    private plannerService: WorkplansService,
    private datepipe: DatePipe) 
  {}
  private updatePeriod : number = 1 * 60 * 1000;  
  departmentSubscription : Subscription;
  timerSubsription : Subscription;

  taskOverview : EmployeeTasks[] = [];

  getTaskOverview()
  {
    this.taskOverview = [];
    let todayString = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    let departmentId = this.departmentService.departmentSubject.getValue();
    this.plannerService.getWorkPlansForDepartment(todayString,departmentId).subscribe((data : WorkPlanDto[]) => {
      data.forEach(workPlan =>{
        if(this.taskOverview.find(o => o.employeeName === workPlan.employeeName)){
          this.taskOverview.find(o => o.employeeName === workPlan.employeeName).tasks.push(workPlan);
        }
        else
        {
          let employeeTasks = new EmployeeTasks();
          employeeTasks.employeeName = workPlan.employeeName;
          employeeTasks.tasks.push(workPlan);
          this.taskOverview.push(employeeTasks);          
        }
      })
    });
  }

  listenToDepartment() {
    this.departmentSubscription = this.departmentService.departmentSubject
      .pipe(delay(0))
      .subscribe(() => {

        if(this.timerSubsription){
          this.timerSubsription.unsubscribe();
        }  
        const source = timer(0, this.updatePeriod);
        this.timerSubsription = source.subscribe(x =>{
          this.getTaskOverview();
        });
    })
  }

  ngOnInit() {
    this.listenToDepartment();
  }
  
  ngOnDestroy(): void {
    this.departmentSubscription.unsubscribe();
    this.timerSubsription.unsubscribe();
  }
}

class EmployeeTasks{
  employeeName:string;
  tasks:WorkPlanDto[]=[];
}