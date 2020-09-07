import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticationService ) { }
  login : string;
  password: string;
  
  doLogin()
  {
    this.authService.login(this.login,this.password);
  }

  ngOnInit() {
    this.login = '';
    this.password = '';
  }
}
