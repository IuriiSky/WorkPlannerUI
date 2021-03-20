import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {EmployeeDto} from 'src/app/shared/interfaces/employee';
import {EmployeesService} from 'src/app/services/dataservices/employees.service';
import {WorkplansService} from 'src/app/services/dataservices/workplans.service';
import {WorkPlanDto} from 'src/app/shared/interfaces/work-plan';
import {DatePipe} from '@angular/common';
import {Subscription} from 'rxjs';
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
     private plannerService: WorkplansService,
  ) {}

  hideEmployeeList = true;
  public currentDate: Date = new Date();
  public allEmployees: EmployeeDto[];
  public selectedEmployee: EmployeeDto;
  departmentSubscription: Subscription;

  weekOverview: EmployeeWeek = {
    employeeColor : '#ffffff',
    days : []
  };

  dateChanged(date: Date) {
    this.currentDate = date;
    if(this.selectedEmployee){
      this.getWeekWorkPlansForEmployee(date,this.selectedEmployee.id);
    }
  }


  toggleShowEmployeeList() {
    this.hideEmployeeList = !this.hideEmployeeList;
  }

  ///Returns date of Moday for this week som has date parameter
  private getMonday(date: Date) : Date{
    let d = new Date(date);
    let day = d.getDay();
    let diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  private addDays(date:Date,days:number) : Date{
    let d = new Date(date.getTime());
    d.setDate(date.getDate() + days);
    d.setHours(0,0,0,0);
    return d;
  }
  private getWeekWorkPlansForEmployee(date: Date, employeeId: number) {
    let monday = this.getMonday(date);
    let sunday = this.addDays(monday,6);
    let m = this.datepipe.transform(monday, 'yyyy-MM-dd');
    let s = this.datepipe.transform(sunday, 'yyyy-MM-dd');
    this.plannerService.getWorkPlansForEmployee(employeeId, m, s).subscribe((data: WorkPlanDto[]) => {
      this.weekOverview = this.mapWeek(data);
      if(this.selectedEmployee){
        this.weekOverview.employeeColor = this.selectedEmployee.colorCode;
      }
    });
  }
  private mapWeek(weekWorkPlans:WorkPlanDto[]) : EmployeeWeek {
    let week = new EmployeeWeek();
  
    let monday = this.getMonday(this.currentDate);
    let mondayTasks = weekWorkPlans.filter((wp:WorkPlanDto) => this.sameDay(new Date(wp.date),monday));
    week.days.push(new EmpoyeeDay(monday,mondayTasks));

    for (let i = 1; i < 7; i++) {
      let dayOfWeek = this.addDays(monday,i);
      let daysTasks = weekWorkPlans.filter((wp:WorkPlanDto) => this.sameDay(new Date(wp.date),dayOfWeek));
      week.days.push(new EmpoyeeDay(dayOfWeek,daysTasks));
    }
    return week;
  }
  public isPast(any:any){
    return true;
  }
  private sameDay( d1:Date, d2:Date) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  public employeeSelected(empl: EmployeeDto) {
    this.selectedEmployee = empl;
    this.getWeekWorkPlansForEmployee(this.currentDate, empl.id);
  }
  private setActiveEmployee(employees: EmployeeDto[]) {
    if (this.selectedEmployee) {
      let employeeAvaiable = employees.find(e => e.id === this.selectedEmployee.id) !== undefined;
      if (employeeAvaiable) {
        this.getWeekWorkPlansForEmployee(this.currentDate, this.selectedEmployee.id);
        return;
      }
    }
    this.employeeSelected(employees[0]);
  }

  private getAllEmployees(departmentId:number){
    this.employeesService.getAllEmployeesInDepartment(departmentId).subscribe((employees:EmployeeDto[]) =>
    {
      this.allEmployees = employees;
      this.setActiveEmployee(employees);
    });
  }

  listenToDepartment() {
    this.departmentSubscription = this.departmentService.departmentSubject
      .pipe(delay(0))
      .subscribe(() => {
        let departmentId = this.departmentService.departmentSubject.getValue();
        this.getAllEmployees(departmentId);
      });
  }

  ngOnInit() {
    this.listenToDepartment();
  }

  ngOnDestroy(): void {
    this.departmentSubscription.unsubscribe();
  }
}

class EmployeeWeek {
  employeeColor = '#ffffff';
  days: EmpoyeeDay[] = [];
}

class EmpoyeeDay{
  date:Date;
  isPast:boolean;
  tasks: WorkPlanDto[] = [];

  constructor(date:Date,tasks:WorkPlanDto[]) {
    this.date = date;
    this.isPast = date.setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
    this.tasks = tasks;
  }
  getWeekDay(){
    let dayWeek = this.date.getDay();
    if(dayWeek === 0)
    {
      return 'Søndag';
    }
    else if(dayWeek === 1){
      return 'Mandag';
    }
    else if(dayWeek === 2){
      return 'Tirsdag';
    }
    else if(dayWeek === 3){
      return 'Onsdag';
    }
    else if(dayWeek === 4){
      return 'Torsdag';
    }
    else if(dayWeek === 5){
      return 'Fredag';
    }
    else 
      return 'Lørdag';
    }
}