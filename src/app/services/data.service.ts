import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //public baseApiUrl: string = isDevMode() ? 'http://workplanner.softwaris.eu/api/' : 'http://workplanner.softwaris.eu/api/';
  public baseApiUrl: string = isDevMode() ? 'http://localhost:64162/api/' : 'http://workplanner.softwaris.eu/api/';
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  constructor() { }
}
