import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hospital-management-system';
  showSidebar: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide sidebar on these routes
      const routesWithoutSidebar = ['/', '/login', '/register'];
      this.showSidebar = !routesWithoutSidebar.includes(this.router.url);
    });
  }
      
  ngOnInit() {
    this.authService.checkAuthStatus();
  }
}