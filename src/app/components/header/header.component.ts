import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() isDashboard = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}