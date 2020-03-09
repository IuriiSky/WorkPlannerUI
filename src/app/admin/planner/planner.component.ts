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

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {

  constructor(
    private datepipe: DatePipe,
    private employeesService: EmployeesService,
    private tasksService: TasksService,
    private plannerService: WorkplansService,
    private router: Router) { }

  public currentDate: Date = new Date();

  public allEmployees:EmployeeDto[];
  public allTasks:TaskDto[];

  public employee : EmployeeDto;
  public employeeTasks : TaskDto[];
  public remainingTasks : TaskDto[];
  private employeeWorkPlan : WorkPlanDto[];


  

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
    let start = new Date();
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
    let com :DeleteWorkPlanCommand={
      employeeId: workPlan.employeeId,
      taskId: workPlan.taskId,
      date: workPlan.date
    };
    console.log(com);
    this.plannerService.deleteWorkPlan(com).subscribe((data:any) => {
      
    });
  }

  nextDay() {
    let date = new Date(this.currentDate.getTime());
    date.setDate(this.currentDate.getDate() + 1);
    this.currentDate = date;
  }

  previousDay() {
    let date = new Date(this.currentDate.getTime());
    date.setDate(this.currentDate.getDate() - 1);
    this.currentDate = date;
  }
  
  ngOnInit() {
    this.employeesService.getAllEmployees().subscribe((data: EmployeeDto[]) => {
      this.allEmployees = data;
    });
    this.tasksService.getAllTasks().subscribe((data: TaskDto[]) => {
      this.allTasks = data;
    })
  }

}
