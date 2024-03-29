import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from '../decorators/localstorage.decorator';

@Injectable({
  providedIn: 'root'
})
export class DepartamentService {

  @LocalStorage()  private selectedDepartment: number;
  departmentSubject : BehaviorSubject<number>;
  constructor() { 
    if(this.selectedDepartment === null || this.selectedDepartment === undefined){
      this.selectedDepartment = 1;
    }
    this.departmentSubject = new BehaviorSubject<number>(this.selectedDepartment);
  }

  setSelectedDepartment(departmentId:number){
    this.selectedDepartment = departmentId;
    this.departmentSubject.next(departmentId);
  }

}
