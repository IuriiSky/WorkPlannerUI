import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { TaskDto, CreateTaskCommand, UpdateTaskCommand } from '../../shared/interfaces/task';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor( private tasksService: TasksService,
               private router: Router) { }

  public tasks: TaskDto[];

  public addNewTask: CreateTaskCommand = {
    taskDescription: '',
};

  createTask: FormGroup;
  showCreateForm = true;

  toggleShowCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  getAllTasks() {
    this.tasksService.getAllTasks().subscribe((data) => {
      this.tasks = data;
    });
  }

  createNewTask() {
    this.tasksService.createTask(this.addNewTask).subscribe(task => {
      this.addNewTask.taskDescription = '';
      this.showCreateForm = true;
      this.getAllTasks();
    });
  }


  ngOnInit() {
    this.getAllTasks();

    this.createTask = new FormGroup({
      taskDescription: new FormControl(''),
    });
  }

}
