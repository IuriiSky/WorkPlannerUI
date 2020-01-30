import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskDto } from '../../shared/interfaces/task';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {

  constructor() { }

@Input('tasks') tasks: TaskDto[];

@Output() voted = new EventEmitter<any>();


vote(agreed: any) {
  console.log(agreed);
  this.voted.emit(agreed);
  
}

  ngOnInit() {}
}
