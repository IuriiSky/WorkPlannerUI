import { Component, OnInit, Input } from '@angular/core';
import { EmployeeDto } from 'src/app/shared/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { TasksService } from 'src/app/services/tasks.service';
import { Router } from '@angular/router';
import { TaskDto } from 'src/app/shared/interfaces/task';
import { WorkplansService } from 'src/app/services/workplans.service';
import { CreateWorkPlanCommand, WorkPlanDto, DeleteWorkPlanCommand } from 'src/app/shared/interfaces/work-plan';
import { CdkDragDrop, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent extends BaseComponent implements OnInit {

  constructor(
    private datepipe: DatePipe,
    private employeesService: EmployeesService,
    private tasksService: TasksService,
    private plannerService: WorkplansService,
    loadingService: LoadingService) 
    {
      super(loadingService);
    }

  public currentDate: Date = new Date();

  public allEmployees:EmployeeDto[];
  public allTasks:TaskDto[];

  public employee : EmployeeDto;
  public employeeTasks : TaskDto[];
  public remainingTasks : TaskDto[];
  private employeeWorkPlan : WorkPlanDto[];


 

  // getCurrentWeek() {

  //   let week = [];
    
  //   for (let i = 1; i <= 7; i++) {
  //     let first = this.currentDate.getDate() - this.currentDate.getDay() + i 
  //     let day = new Date(this.currentDate.setDate(first)).toISOString().slice(0, 10)
  //     week.push(day)
  //   };
    
  //   console.log(week);
  // }


//   getWeekNumber(d) {
//     // Copy date so don't modify original
//     d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
//     // Set to nearest Thursday: current date + 4 - current day number
//     // Make Sunday's day number 7
//     d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
//     // Get first day of year
//     let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
//     // Calculate full weeks to nearest Thursday
//     let weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
//     // Return array of year and week number

//     return [d.getUTCFullYear(), weekNo];
   
      
// }

 

  drop(event: CdkDragDrop<TaskDto[]>) {
    if(!this.employee) return;

    if (event.previousContainer !== event.container) {
      
      let index = event.previousIndex;
      //add task
      if(event.previousContainer.id === "taskList"){
        let task = this.remainingTasks[index];
        this.addTask(task.id);
        this.employeeTasks.push(task);
        this.remainingTasks.splice(index, 1);
      } 
      //remove task
      else{
        let task = this.employeeTasks[index];
        this.removeTask(task.id);
        this.remainingTasks.push(task);
        this.employeeTasks.splice(index, 1);
      }
    } 
  }

  setActiveEmployee(empl: EmployeeDto){
    this.employee = empl;
    this.getWorkPlanForEmployee(this.currentDate,empl.id);
  }
  getWorkPlanForEmployee(date: Date, employeeId : number){
    
    let stringDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.plannerService.getWorkPlansForEmployee(stringDate, employeeId).subscribe((data : WorkPlanDto[]) => {
      this.employeeWorkPlan = data;
      this.recalculateTask(data);
    });
  }
  recalculateTask(workPlan :WorkPlanDto[]){
    this.employeeTasks = this.allTasks.filter(t => {
      return workPlan.some(wp => wp.taskId == t.id);
    });
    this.remainingTasks = this.allTasks.filter(t =>{
      return !workPlan.some(wp => wp.taskId == t.id);
    });
  }

  addTask(taskId: number){
    let start = new Date(this.currentDate.getTime());
    start.setHours(6);
    let com: CreateWorkPlanCommand =
    {
      employeeId: this.employee.id,
      taskId: taskId,
      date: this.currentDate,
      startTime: start,
      endTime: this.currentDate,
    };
    this.plannerService.createWorkPlan(com).subscribe((data:any) => {
      
    });
    //reload list
  }
  removeTask(taskId: number){
    let workPlan = this.employeeWorkPlan.find(wp => wp.taskId == taskId);
    if(workPlan === undefined){
      let com :DeleteWorkPlanCommand={
        employeeId: this.employee.id,
        taskId: taskId,
        date: this.currentDate
      };
      this.plannerService.deleteWorkPlan(com).subscribe((data:any) => {
      });

    }else{

      let com :DeleteWorkPlanCommand={
        employeeId: workPlan.employeeId,
        taskId: workPlan.taskId,
        date: workPlan.date
      };
      
      this.plannerService.deleteWorkPlan(com).subscribe((data:any) => {
      });
    }
  }

  nextDay() {
    let date = new Date(this.currentDate.getTime());
    date.setDate(this.currentDate.getDate() + 1);
    this.currentDate = date;
    this.setActiveEmployee(this.employee);
  }

  previousDay() {
    let date = new Date(this.currentDate.getTime());
    date.setDate(this.currentDate.getDate() - 1);
    this.currentDate = date;
    this.setActiveEmployee(this.employee);
  }
  
  ngOnInit() {
    this.isLoading = true;
    this.employeesService.getAllEmployees().subscribe((data: EmployeeDto[]) => {
      this.allEmployees = data;
      this.isLoading = false;
      if(data.length > 0) {
        this.setActiveEmployee(data[0]);
      }
    });
    this.isLoading = true;
    this.tasksService.getAllTasks().subscribe((data: TaskDto[]) => {
      this.allTasks = data;
      this.isLoading = false;
    })
  }

}
