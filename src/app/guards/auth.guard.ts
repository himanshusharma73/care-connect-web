import { Injectable } from "@angular/core"
import { type Observable, map, catchError, of } from "rxjs"
import { AuthService } from "../services/auth.service"
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    console.log("Auth guard checking authentication...")

    // Check current authentication status
    if (this.authService.isAuthenticated) {
      console.log("Auth guard passed - user is authenticated")
      return true
    }

    // Check if we have a session flag but no valid token
    const hasSession = sessionStorage.getItem("authenticated") === "true"
    const hasToken = !!this.authService.getAccessToken()

    console.log("Guard check:", { hasSession, hasToken })

    if (!hasSession) {
      console.log("No session found, redirecting to login")
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url },
      })
      return false
    }

    if (!hasToken) {
      console.log("No valid token, attempting refresh...")
      // Try to refresh token
      return this.authService.refreshToken().pipe(
        map(() => {
          console.log("Token refresh successful in guard")
          return true
        }),
        catchError((error) => {
          console.log("Token refresh failed in guard:", error)
          this.router.navigate(["/login"], {
            queryParams: { returnUrl: state.url },
          })
          return of(false)
        }),
      )
    }

    console.log("Auth guard passed")
    return true
  }
}
