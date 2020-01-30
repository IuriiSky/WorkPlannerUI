import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeDto } from '../../shared/interfaces/employee';



@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {

  constructor() { }

  @Input('employees') employees:EmployeeDto[];
  
  @Output() voted = new EventEmitter<any>();

vote(agreed: any) {
  console.log(agreed);
  this.voted.emit(agreed);
  
}

  ngOnInit() {
  }

}
