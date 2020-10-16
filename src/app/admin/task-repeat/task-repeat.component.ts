import { Component, Input, OnInit } from '@angular/core';
import { WorkplansService } from 'src/app/services/dataservices/workplans.service';
import { EmployeeDto } from 'src/app/shared/interfaces/employee';
import { TaskDto } from 'src/app/shared/interfaces/task';
import { WorkPlanRepeatingCommand } from 'src/app/shared/interfaces/work-plan';

@Component({
  selector: 'app-task-repeat',
  templateUrl: './task-repeat.component.html',
  styleUrls: ['./task-repeat.component.css']
})
export class TaskRepeatComponent implements OnInit {
  @Input('selectedTask') task: TaskDto;
  @Input('selectedEmployee') employee: EmployeeDto;
  constructor(private plannerService: WorkplansService) { }

  private today = new Date();

  repeating: WorkPlanRepeatingCommand = {
    taskId:0,
    employeeId:0,
    startDate: this.today.toISOString(),
    endDate: this.today.toISOString(),
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  };
  
  repeatDaily:boolean;
  repeatWorkingDays:boolean;
  repeatWeekend:boolean;
  repeatCustom:boolean;

  setDaily(checked: boolean) {
    if(this.repeating){
      this.repeating.monday = checked;
      this.repeating.tuesday = checked;
      this.repeating.wednesday = checked;
      this.repeating.thursday = checked;
      this.repeating.friday = checked;
      this.repeating.saturday = checked;
      this.repeating.sunday = checked;
    }
    if(checked){
      this.repeatWorkingDays = false;
      this.repeatWeekend = false;
      this.repeatCustom = false;
    }
  }
  setWorking(checked: boolean) {
    if(this.repeating){
      this.repeating.monday = checked;
      this.repeating.tuesday = checked;
      this.repeating.wednesday = checked;
      this.repeating.thursday = checked;
      this.repeating.friday = checked;
      this.repeating.saturday = false;
      this.repeating.sunday = false;
    }
    if(checked){
      this.repeatDaily = false;
      this.repeatWeekend = false;
      this.repeatCustom = false;
    }
  }
  setWeekend(checked: boolean) {
    if(this.repeating){
      this.repeating.monday = false;
      this.repeating.tuesday = false;
      this.repeating.wednesday = false;
      this.repeating.thursday = false;
      this.repeating.friday = false;
      this.repeating.saturday = checked;
      this.repeating.sunday = checked;
    }
    if(checked){
      this.repeatDaily = false;
      this.repeatWorkingDays = false;
      this.repeatCustom = false;
    }
  }
  setCustom(checked: boolean) {
    if(checked){
      this.repeatDaily = false;
      this.repeatWorkingDays = false;
      this.repeatWeekend = false;
    }
  }

  next7Days:boolean;
  next14Days:boolean;
  next28Days:boolean;
  nextCustom:boolean;
  
  setNext7Days(checked: boolean){
    this.next7Days = checked;
    if(checked){
      this.next14Days = false;
      this.next28Days = false;
      this.nextCustom = false;
      
      this.repeating.startDate = this.getDateDiff(1);
      this.repeating.endDate = this.getDateDiff(8);
    }
    else{
      this.setDefaultNextDays();
    }  
  }

  setNext14Days(checked: boolean){
    this.next14Days = checked;
    if(checked){
      this.next7Days = false;
      this.next28Days = false;
      this.nextCustom = false;
      
      this.repeating.startDate = this.getDateDiff(1);
      this.repeating.endDate = this.getDateDiff(15);
    }
    else{
      this.setDefaultNextDays();
    }
  }
  setNext28Days(checked: boolean){
    this.next28Days = checked;
    if(checked){
      this.next7Days = false;
      this.next14Days = false;
      this.nextCustom = false;
      
      this.repeating.startDate = this.getDateDiff(1);
      this.repeating.endDate = this.getDateDiff(29);
    }
    else{
      this.setDefaultNextDays();
    }
  }

  setNextCustom(checked: boolean){
    this.nextCustom = checked;
    if(checked){
      this.next7Days = false;
      this.next14Days = false;
      this.next28Days = false;
    }
    else{
      this.setDefaultNextDays();
    }
  }
  generateRepeating(){
    this.repeating.employeeId = this.employee.id;
    this.repeating.taskId = this.task.id;
    
    this.plannerService.repeatWorkPlan(this.repeating)
    .subscribe((data:any) => {});
  }
  private setDefaultNextDays(){
    this.repeating.startDate = this.today.toISOString();
    this.repeating.endDate = this.today.toISOString();  
  }

  private getDateDiff(days:number): string {
    let date = new Date(this.today.getTime());
    date.setDate(this.today.getDate() + days);
    return date.toISOString(); 
  }

  ngOnInit() {
  }

}
