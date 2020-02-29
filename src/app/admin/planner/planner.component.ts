import { Component, OnInit, Input, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { EmployeeDto } from 'src/app/shared/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { TasksService } from 'src/app/services/tasks.service';
import { Router } from '@angular/router';
import { TaskDto } from 'src/app/shared/interfaces/task';
import { WorkplansService } from 'src/app/services/workplans.service';
import { CreateWorkPlanCommand } from 'src/app/shared/interfaces/work-plan';
import {DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {

  constructor(private employeesService: EmployeesService,
    private tasksService: TasksService,
    private plannerService: WorkplansService,
    private router: Router) { }

  public currentDate: Date;
  public employees:EmployeeDto[];
  public tasks:TaskDto[];

  public activeEmployee : EmployeeDto;
  public activeEmployeeTasks : TaskDto[];


  setActiveEmployee(empl: EmployeeDto){
    this.activeEmployee = empl;
    this.activeEmployeeTasks = [];

  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    if(!this.activeEmployee) return;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log("same container");
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      console.log("other container");
    }
    console.log(event);
    console.log(this.activeEmployeeTasks);
  }
  
  getTaskForEmployee(){
    return [
      "goSleep","wash car"];
    

    //let task = this.plannerService.getWorkPlansForEmployee(this.currentDate, this.activeEmployee.id);
  }
  addTask(taskId: number){
    let com: CreateWorkPlanCommand =
    {
      employeeId: this.activeEmployee.id,
      taskId: taskId,
      date: this.currentDate,
      startTime: new Date,
      endTime: new Date,

    };

    let create = this.plannerService.createWorkPlan(com);
    //reload list
  }
  ngOnInit() {
    this.employeesService.getAllEmployees().subscribe((data: EmployeeDto[]) => {
      this.employees = data;
    });
    this.tasksService.getAllTasks().subscribe((data: TaskDto[]) => {
      this.tasks = data;
    })
  }

}
