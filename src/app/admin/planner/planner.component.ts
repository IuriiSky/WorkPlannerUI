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
  public currentDate: Date = new Date();

  public allEmployees:EmployeeDto[];
  public allTasks:TaskDto[];

  public selectedEmployee : EmployeeDto;
  public selectedTask: TaskDto;
  
  public employeeTasks : TaskDto[];
  public remainingTasks : TaskDto[];
  private employeeWorkPlan : WorkPlanDto[];
  

  toggleShowEmployeeList() {
    this.hideEmployeeList = !this.hideEmployeeList;
  }

  drop(event: CdkDragDrop<TaskDto[]>) {
    if(!this.selectedEmployee) return;

    if (event.previousContainer !== event.container) {
      
      let index = event.previousIndex;
      //add task
      if(event.previousContainer.id === "taskList"){
        let task = this.remainingTasks[index];
        this.addTask(task.id);
        this.employeeTasks.push(task);
        this.remainingTasks.splice(index, 1);
        this.selectedTask = task;
      } 
      //remove task
      else{
        let task = this.employeeTasks[index];
        this.removeTask(task.id);
        this.remainingTasks.push(task);
        this.employeeTasks.splice(index, 1);
        if (this.selectedTask){
          if(task.id === this.selectedTask.id){
            this.selectedTask = undefined;
          }
        }
      }
    } 
  }

  dateChanged(date:Date){
    this.currentDate = date;
    this.getAvailableEmployees(date);
  }

  public employeeSelected(empl: EmployeeDto){
    this.selectedEmployee = empl;
    this.getWorkPlanForEmployee(this.currentDate,empl.id);
  }

  private setActiveEmployee(employees: EmployeeDto[]){
    if(this.selectedEmployee){
      let employeeAvaiable = employees.find(e => e.id === this.selectedEmployee.id) !== undefined;
      if(employeeAvaiable){
        this.getWorkPlanForEmployee(this.currentDate,this.selectedEmployee.id);
        return;
      }
    }
    this.employeeSelected(employees[0]);
  }

  private getWorkPlanForEmployee(date: Date, employeeId : number){
    let stringDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.plannerService.getWorkPlansForEmployee(stringDate, employeeId).subscribe((data : WorkPlanDto[]) => {
      this.employeeWorkPlan = data;
      this.recalculateTask(data);
    });
  }

  private recalculateTask(workPlan :WorkPlanDto[]){
    if(this.allTasks){

      this.employeeTasks = this.allTasks.filter(t => {
        return workPlan.some(wp => wp.taskId == t.id);
      });
      this.remainingTasks = this.allTasks.filter(t =>{
        return !workPlan.some(wp => wp.taskId == t.id);
      });
      
      if (this.selectedTask){
        let isAssigned = this.employeeTasks.findIndex(t => t.id == this.selectedTask.id) !== -1;
        if(!isAssigned){
          this.selectedTask = undefined;
        }
      }
    }
  }

  private addTask(taskId: number){
    let com: CreateWorkPlanCommand =
    {
      employeeId: this.selectedEmployee.id,
      taskId: taskId,
      date: this.datepipe.transform(this.currentDate,'yyyy-MM-dd'),
    };
    this.plannerService.createWorkPlan(com).subscribe((data:any) => {
    });
  }
  private removeTask(taskId: number){
    let workPlan = this.employeeWorkPlan.find(wp => wp.taskId == taskId);
    if(workPlan === undefined){
      let com :DeleteWorkPlanCommand={
        employeeId: this.selectedEmployee.id,
        taskId: taskId,
        date: this.datepipe.transform(this.currentDate,'yyyy-MM-dd')
      };
      this.plannerService.deleteWorkPlan(com).subscribe((data:any) => {
      });

    }else{

      let com :DeleteWorkPlanCommand={
        employeeId: workPlan.employeeId,
        taskId: workPlan.taskId,
        date: this.datepipe.transform(workPlan.date,'yyyy-MM-dd')
      };
      
      this.plannerService.deleteWorkPlan(com).subscribe((data:any) => {
      });
    }
  }

  private getAvailableEmployees(forDate: Date) {
    let departmentId = this.departmentService.departmentSubject.getValue();
    let stringDate = this.datepipe.transform(forDate, 'yyyy-MM-dd');
    this.employeesService.getAvailableEmployeesInDepartment(stringDate,departmentId).subscribe((data: EmployeeDto[]) => {
      this.allEmployees = data;
      this.setActiveEmployee(data);
    });
  }
  
  selectTask(task:TaskDto){
    this.selectedTask = task;
  }
  onRepeatingSaved(emit:any){
    this.getWorkPlanForEmployee(this.currentDate,this.selectedEmployee.id);
  }

  listenToDepartment() {
    this.departmentSubscription = this.departmentService.departmentSubject
      .pipe(delay(0))
      .subscribe(() => {
        let departmentId = this.departmentService.departmentSubject.getValue();
        this.tasksService.getAllTasks(departmentId).subscribe((data: TaskDto[]) => {
          this.allTasks = data;
          this.getAvailableEmployees(this.currentDate);    
        });
      })
  }
  
  ngOnInit() {
      this.listenToDepartment();
  }

  ngOnDestroy(): void {
    this.departmentSubscription.unsubscribe();
  }
}
