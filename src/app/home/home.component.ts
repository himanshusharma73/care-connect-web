import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loginData = {
    username: '',
    password: ''
  };
  loginError: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.loginError = '';

    if (this.loginData.username && this.loginData.password) {
      const isLoggedIn = this.authService.login(
        this.loginData.username,
        this.loginData.password
      );

      if (isLoggedIn) {
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError = 'Invalid username or password';
      }
    } else {
      this.loginError = 'Please enter both username and password';
    }

    this.isLoading = false;
  }
}