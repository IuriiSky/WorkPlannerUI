import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { EmployeeDto } from '../../shared/interfaces/employee';
import { NgClass } from '@angular/common';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LoadingService } from 'src/app/services/loading.service';



@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent extends BaseComponent implements OnInit {

  constructor(loadingService:LoadingService) 
  { 
    super(loadingService);
  }

  @Input('employees') employees:EmployeeDto[];
  @Input('selectedEmployee') selectedEmployee: EmployeeDto;
  @Input('clicable') clicable: boolean;
  
  @Output() voted = new EventEmitter<any>();
  
  vote(agreed: any) {
    this.voted.emit(agreed);
  }
  
  ngOnInit() {
  }

}
