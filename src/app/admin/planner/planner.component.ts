import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeDto } from 'src/app/shared/interfaces/employee';
import { EmployeesService } from 'src/app/services/dataservices/employees.service';
import { TasksService } from 'src/app/services/dataservices/tasks.service';
import { TaskDto } from 'src/app/shared/interfaces/task';
import { WorkplansService } from 'src/app/services/dataservices/workplans.service';
import { CreateWorkPlanCommand, WorkPlanDto, DeleteWorkPlanCommand } from 'src/app/shared/interfaces/work-plan';
import { CdkDragDrop} from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { DepartamentService } from 'src/app/services/departament.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent implements OnInit,OnDestroy {

  constructor(
    private datepipe: DatePipe,
    private departmentService: DepartamentService,
    private employeesService: EmployeesService,
    private tasksService: TasksService,
    private plannerService: WorkplansService) 
    {    }
  
  hideEmployeeList = true;

  departmentSubscription: Subscription;
  //public currentDate: Date = new Date();
  public currentDate: Date;

  public allEmployees:EmployeeDto[];
  public allTasks:TaskDto[];

  public employee : EmployeeDto;
  public employeeTasks : TaskDto[];
  public remainingTasks : TaskDto[];
  private employeeWorkPlan : WorkPlanDto[];

  toggleShowEmployeeList() {
    this.hideEmployeeList = !this.hideEmployeeList;
  }

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

  dateChanged(date:Date){
    this.currentDate = date;
    if(this.employee) {
      this.setActiveEmployee(this.employee);
    }
  }

  public setActiveEmployee(empl: EmployeeDto){
    this.employee = empl;
    this.getWorkPlanForEmployee(this.currentDate,empl.id);
  }

  private getWorkPlanForEmployee(date: Date, employeeId : number){
    
    let stringDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.plannerService.getWorkPlansForEmployee(stringDate, employeeId).subscribe((data : WorkPlanDto[]) => {
      this.employeeWorkPlan = data;
      this.recalculateTask(data);
    });
  }

  private recalculateTask(workPlan :WorkPlanDto[]){
    this.employeeTasks = this.allTasks.filter(t => {
      return workPlan.some(wp => wp.taskId == t.id);
    });
    this.remainingTasks = this.allTasks.filter(t =>{
      return !workPlan.some(wp => wp.taskId == t.id);
    });
  }

  private addTask(taskId: number){
    let com: CreateWorkPlanCommand =
    {
      employeeId: this.employee.id,
      taskId: taskId,
      date: this.currentDate,
    };
    this.plannerService.createWorkPlan(com).subscribe((data:any) => {
      
    });
  }
  private removeTask(taskId: number){
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

  // nextDay() {
  //   let date = new Date(this.currentDate.getTime());
  //   date.setDate(this.currentDate.getDate() + 1);
  //   this.currentDate = date;
  //   this.setActiveEmployee(this.employee);
  // }

  // previousDay() {
  //   let date = new Date(this.currentDate.getTime());
  //   date.setDate(this.currentDate.getDate() - 1);
  //   this.currentDate = date;
  //   this.setActiveEmployee(this.employee);
  // }
  

  private getAllEmployees() {
    let departmentId = this.departmentService.departmentSubject.getValue();
    this.employeesService.getAllEmployeesInDepartment(departmentId).subscribe((data: EmployeeDto[]) => {
      this.allEmployees = data;
      if(data.length > 0) {
        this.setActiveEmployee(data[0]);
      }
    });
  }

  listenToDepartment() {
    this.departmentSubscription = this.departmentService.departmentSubject
      .pipe(delay(0))
      .subscribe(() => {
        this.getAllEmployees();
      })
  }

  ngOnInit() {
    this.tasksService.getAllTasks().subscribe((data: TaskDto[]) => {
      this.allTasks = data;
      this.listenToDepartment();
    });
  }

  ngOnDestroy(): void {
    this.departmentSubscription.unsubscribe();
  }

}
