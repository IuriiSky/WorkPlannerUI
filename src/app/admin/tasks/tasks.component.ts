import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { TasksService } from '../../services/dataservices/tasks.service';
import { TaskDto, CreateTaskCommand, UpdateTaskCommand } from '../../shared/interfaces/task';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  constructor( private tasksService: TasksService) 
  {  }

  public tasks: TaskDto[];

  public addNewTask: CreateTaskCommand = {
    taskDescription: '',
};

  public  activeTask: TaskDto;

  public rewriteTask: UpdateTaskCommand = {
    taskId: 0,
    taskDescription: '',
  };

  createTask: FormGroup;
  showCreateForm = true;
  showUpdateTaskForm = true;

  toggleShowCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  toggleShowUpdateTaskForm() {
    this.showUpdateTaskForm = !this.showUpdateTaskForm;
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

  setActiveTask(taskDto: TaskDto) {
    this.activeTask = taskDto;
  }

  updateTask() {
    this.rewriteTask.taskId = Number(this.activeTask.id);
    this.tasksService.updateTask(this.rewriteTask).subscribe(task => {
      this.rewriteTask.taskDescription = this.addNewTask.taskDescription;
      this.showUpdateTaskForm = true;
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
