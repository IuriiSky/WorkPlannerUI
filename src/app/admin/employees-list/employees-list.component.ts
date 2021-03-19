import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {EmployeeDto} from '../../shared/interfaces/employee';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {

  constructor() {
  }

  @Input('employees') employees: EmployeeDto[];
  @Input('selectedEmployee') selectedEmployee: EmployeeDto;
  @Input('clicable') clicable: boolean;

  @Output() voted = new EventEmitter<any>();

  vote(agreed: any) {
    this.voted.emit(agreed);
  }

  ngOnInit() {
  }

}
