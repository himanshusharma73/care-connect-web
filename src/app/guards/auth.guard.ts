import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Check if route is restricted by role
      if (route.data['roles'] && route.data['roles'].indexOf(currentUser.role) === -1) {
        // Role not authorized
        this.router.navigate(['/']);
        return false;
      }

      // Authorized
      return true;
    }

    // Not logged in
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}