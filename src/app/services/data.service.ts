import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  //public baseApiUrl: string = isDevMode() ? 'http://workplanner.softwaris.eu/api/' : 'http://workplanner.softwaris.eu/api/';
  //public baseApiUrl: string = isDevMode() ? 'http://localhost:64162/api/' : 'http://workplanner.softwaris.eu/api/';
  public baseApiUrl: string =  environment.apiUrl;
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  constructor() { }
}
