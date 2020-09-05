import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TaskDto } from '../../shared/interfaces/task';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent extends BaseComponent implements OnInit {

  constructor(loadingService: LoadingService) 
  { 
    super(loadingService);
  }

@Input('tasks') tasks: TaskDto[];

@Output() voted = new EventEmitter<any>();


vote(agreed: any) {
  this.voted.emit(agreed);
}

  ngOnInit() {}
}
