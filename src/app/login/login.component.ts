import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../auth/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticationService,private router: Router ) { }
  login : string;
  password: string;
  
  doLogin()
  {
    this.authService.login(this.login,this.password).subscribe(
      (user:User) =>{
        if(this.authService.hasAdminRole(user)){
          this.router.navigate(['/admin']);
        }else{
          this.router.navigate(['/Tasks']);
        }
    },(error =>{
    }));
  }

  ngOnInit() {
    this.login = '';
    this.password = '';
  }
}
