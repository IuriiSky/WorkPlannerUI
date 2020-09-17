import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthenticationService,private router: Router) { }

  ngOnInit() {
    if(!this.authService.isUserLoggedIn()){
      this.router.navigate(['/login']);
    }
    else{
      this.router.navigate(['/admin']);
    }
  }
}
