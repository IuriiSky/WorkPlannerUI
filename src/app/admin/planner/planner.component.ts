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

  public currentDate: Date = new Date();

  public employees:EmployeeDto[];
  public tasks:TaskDto[];

  public activeEmployee : EmployeeDto;
  public activeEmployeeTasks : TaskDto[];


  setActiveEmployee(empl: EmployeeDto){
    this.activeEmployee = empl;
    this.activeEmployeeTasks = [];
    console.log(this.currentDate);

  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    if(!this.activeEmployee) return;

    if (event.previousContainer !== event.container) {
      
      let index = event.previousIndex;
      if(event.previousContainer.id === "taskList"){
        let task = this.tasks[index];
        this.addTask(task.id);

        this.activeEmployeeTasks.push(task);
        this.tasks.splice(index, 1);
      } else{

        let task = this.activeEmployeeTasks[index];
        this.removeTask(task.id);
        this.tasks.push(task);
        this.activeEmployeeTasks.splice(index, 1);
      }
    } 
  }
  
  getTaskForEmployee(){
    return [
      "goSleep","wash car"];
    

    //let task = this.plannerService.getWorkPlansForEmployee(this.currentDate, this.activeEmployee.id);
  }
  addTask(taskId: number){
    let start = new Date();
    start.setHours(6);

    let com: CreateWorkPlanCommand =
    {
      employeeId: this.activeEmployee.id,
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
    let com :DeleteWorkPlanCommand={
      employeeId: this.activeEmployee.id,
      taskId: taskId,
      date: this.currentDate
    }
    this.plannerService.deleteWorkPlan(com).subscribe((data:any) => {
      
    });
  }

  getStringDate(model: any) {
    if (!model || !model.date)
        return undefined;

    return model.date.year + "-" + this.pad(model.date.month) + "-" + this.pad(model.date.day) + "T00:00:00Z";
}
pad(num: number): string {
  return num < 10 ? "0" + num : num.toString();
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
