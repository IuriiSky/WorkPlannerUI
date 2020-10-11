import { Component, OnInit, Input} from '@angular/core';
import { EmployeeDto } from '../../shared/interfaces/employee';
import { EmployeesService } from '../../services/dataservices/employees.service';

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.css']
})
export class TaskOverviewComponent implements OnInit {

  // @Input('employees') employees:EmployeeDto[];
  
  constructor() { }
  
  // public employees: EmployeeDto[];

  // public employees: EmployeeDto[] = [
  //   {
  //   id: 1,
  //   name: 'string;',
  //   colorCode: '#ffffff'
  //   }
  // ]

  


  users = ['Baskervilly', 'Fantik', 'Tuzik', 'Barsik', 'Tramsormer Baskervilly'];

  tasks = [           'Jump to the moon',
                      'Wash the car',
                      'Read the book',
                      'Run',
                      'Go to city',
                      'Go to shop and buy the tractor',
                      'Somethink',
                      'Go to shop and buy the tractor Go to shop and buy the tractor Go to shop and buy the tractor Go to shop and buy the tractor'
                    ]

  ngOnInit() {
  }

}
