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
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login']);
    }
    else if (this.authService.isUser())
    {
      this.router.navigate(['/employeesTasks']);
    }
    else if (this.authService.isAdmin())
    {
      this.router.navigate(['/admin']);
    }
  }
}
