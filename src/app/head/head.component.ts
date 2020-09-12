import { Component, OnInit } from '@angular/core';
import { DepartamentService } from '../services/departament.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {

  constructor() { }

  nameDepartament1 = 'Departament-1';
  nameDepartament2 = 'Departament-2';

  public humburgerMenu: boolean = false;

  public requestDepartamentValue: string = '';

  // Plug
  public isUserLoggedIn: boolean = true;
  toggle(){
    this.isUserLoggedIn = !this.isUserLoggedIn;
  }

  openCloseHamburgerMenu() {
    this.humburgerMenu = !this.humburgerMenu;
  }
  

public selectDepartament1: boolean = true;
public selectDepartament2: boolean = false;

chooseDepartament(){
    this.selectDepartament1 = !this.selectDepartament1;   
    this.selectDepartament2 = !this.selectDepartament2;
    this.setDepartamentValue();    
}

setDepartamentValue() {
  if (this.selectDepartament1 === true) {
    this.requestDepartamentValue = '1';
  } else { 
    this.requestDepartamentValue = '2'
  }
  
  return this.requestDepartamentValue;
}

  ngOnInit() {
  }

}
