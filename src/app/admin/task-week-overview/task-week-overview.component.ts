import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {EmployeeDto} from 'src/app/shared/interfaces/employee';
import {EmployeesService} from 'src/app/services/dataservices/employees.service';
import {TasksService} from 'src/app/services/dataservices/tasks.service';
import {TaskDto} from 'src/app/shared/interfaces/task';
import {WorkplansService} from 'src/app/services/dataservices/workplans.service';
import {WorkPlanDto} from 'src/app/shared/interfaces/work-plan';
import {DatePipe} from '@angular/common';
import {Subscription, timer} from 'rxjs';
import {DepartamentService} from 'src/app/services/departament.service';
import {delay} from 'rxjs/operators';


@Component({
  selector: 'app-task-week-overview',
  templateUrl: './task-week-overview.component.html',
  styleUrls: ['./task-week-overview.component.css']
})
export class TaskWeekOverviewComponent implements OnInit, OnDestroy {

  constructor(
    private datepipe: DatePipe,
    private departmentService: DepartamentService,
    private employeesService: EmployeesService,
    private tasksService: TasksService,
    private plannerService: WorkplansService,
  ) {
  }

  hideEmployeeList = true;
  public currentDate: Date = new Date();
  public allEmployees: EmployeeDto[];
  public selectedEmployee: EmployeeDto;
  public employeeTasks: TaskDto[];
  public remainingTasks: TaskDto[];
  public allTasks: TaskDto[];
  public employeeWorkPlan: WorkPlanDto[];
  departmentSubscription: Subscription;

  taskOverview: EmployeeTasks[] = [];


  // Calendar
  dateChanged(date: Date) {
    this.currentDate = date;
    this.getAvailableEmployees(date);
  }

  // Get employees list
  toggleShowEmployeeList() {
    this.hideEmployeeList = !this.hideEmployeeList;
  }

  public employeeSelected(empl: EmployeeDto) {
    this.selectedEmployee = empl;
    this.getWorkPlanForEmployee(this.currentDate, empl.id);
  }

  private getWorkPlanForEmployee(date: Date, employeeId: number) {

    let stringDate = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.plannerService.getWorkPlansForEmployee(stringDate, employeeId).subscribe((data: WorkPlanDto[]) => {
      this.employeeWorkPlan = data;
      this.recalculateTask(data);
    });
  }

  private recalculateTask(workPlan: WorkPlanDto[]) {
    this.employeeTasks = this.allTasks.filter(t => {
      return workPlan.some(wp => wp.taskId == t.id);
    });
    this.remainingTasks = this.allTasks.filter(t => {
      return !workPlan.some(wp => wp.taskId == t.id);
    });
  }

  private getAvailableEmployees(forDate: Date) {
    let departmentId = this.departmentService.departmentSubject.getValue();
    let stringDate = this.datepipe.transform(forDate, 'yyyy-MM-dd');
    this.employeesService.getAvailableEmployeesInDepartment(stringDate, departmentId).subscribe((data: EmployeeDto[]) => {
      this.allEmployees = data;
      this.setActiveEmployee(data);
    });
  }

  private setActiveEmployee(employees: EmployeeDto[]) {
    if (this.selectedEmployee) {
      let employeeAvaiable = employees.find(e => e.id === this.selectedEmployee.id) !== undefined;
      if (employeeAvaiable) {
        this.getWorkPlanForEmployee(this.currentDate, this.selectedEmployee.id);
        return;
      }
    }
    this.employeeSelected(employees[0]);
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
      });
  }

  getTaskOverview() {
    this.taskOverview = [];
    let todayString = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    let departmentId = this.departmentService.departmentSubject.getValue();
    this.plannerService.getWorkPlansForDepartment(todayString, departmentId).subscribe((data: WorkPlanDto[]) => {
      data.forEach(workPlan => {
        if (this.taskOverview.find(o => o.employeeName === workPlan.employeeName)) {
          this.taskOverview.find(o => o.employeeName === workPlan.employeeName).tasks.push(workPlan);
        } else {
          let employeeTasks = new EmployeeTasks();
          employeeTasks.employeeName = workPlan.employeeName;
          employeeTasks.employeeColor = workPlan.colorCode;

          employeeTasks.tasks.push(workPlan);
          this.taskOverview.push(employeeTasks);
        }
      });
    });
  }

  ngOnInit() {
    this.listenToDepartment();
    this.getTaskOverview();
  }

  ngOnDestroy(): void {
    this.departmentSubscription.unsubscribe();
  }
}

class EmployeeTasks {
  employeeName: string;
  employeeColor: string;
  tasks: WorkPlanDto[] = [];
}
