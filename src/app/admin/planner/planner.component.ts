import { Component, OnInit, Input } from '@angular/core';
import { EmployeeDto } from 'src/app/shared/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { TasksService } from 'src/app/services/tasks.service';
import { Router } from '@angular/router';
import { TaskDto } from 'src/app/shared/interfaces/task';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {

  constructor(private employeesService: EmployeesService,
    private tasksService: TasksService,
    private router: Router) { }

  public employees:EmployeeDto[];
  public tasks:TaskDto[];


  canDeactivate(): void {
    this.router.navigate(['/#']);
  
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
