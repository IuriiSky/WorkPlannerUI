import { Component, OnInit, Input } from '@angular/core';
import { EmployeeDto } from 'src/app/shared/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { TasksService } from 'src/app/services/tasks.service';
import { Router } from '@angular/router';
import { TaskDto } from 'src/app/shared/interfaces/task';
import { WorkplansService } from 'src/app/services/workplans.service';
import { CreateWorkPlanCommand } from 'src/app/shared/interfaces/work-plan';

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

  public employees:EmployeeDto[];
  public tasks:TaskDto[];

  public activeEmployee : EmployeeDto;
  public currentDate: Date;

  setActiveEmployee(empl: EmployeeDto){
    console.log(empl);
    this.activeEmployee = empl;
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
  
  openTabs(event) {
    alert("It`s test")
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
