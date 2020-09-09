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
   
    this.authService.requestToken(this.login,this.password).subscribe( () =>{
      console.log('login succes');
      //redirect
    },() => 
    {
      console.log('login mislykkes');
      //show eeror to user
    });
  }

  ngOnInit() {
    this.login = '';
    this.password = '';
  }
}
