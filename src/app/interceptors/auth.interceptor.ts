import { Injectable } from "@angular/core"
import {
  type HttpEvent,
  type HttpHandler,
  type HttpInterceptor,
  type HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http"
import { type Observable, throwError, BehaviorSubject, EMPTY } from "rxjs"
import { catchError, filter, finalize, switchMap, take } from "rxjs/operators"
import { AuthService } from "../services/auth.service"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null)

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth endpoints to prevent circular dependency
    if (this.isAuthEndpoint(req.url)) {
      return next.handle(req)
    }

    // Add security headers to all requests
    let secureReq = this.addSecurityHeaders(req)

    // Add auth token if available
    const token = this.authService.getAccessToken()
    if (token) {
      secureReq = this.addAuthHeader(secureReq, token)
    }

    return next.handle(secureReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(secureReq, next)
        }
        return throwError(() => error)
      }),
    )
  }

  /**
   * Add security headers to request
   */
  private addSecurityHeaders(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
      },
    })
  }

  /**
   * Add authorization header
   */
  private addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  /**
   * Handle 401 errors with token refresh
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      this.refreshTokenSubject.next(null)

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.refreshTokenSubject.next(response.accessToken)
          const newToken = this.authService.getAccessToken()

          if (newToken) {
            return next.handle(this.addAuthHeader(request, newToken))
          }

          return EMPTY
        }),
        catchError((err) => {
          this.authService.logout()
          return throwError(() => err)
        }),
        finalize(() => {
          this.isRefreshing = false
        }),
      )
    }

    // Wait for refresh to complete
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const newToken = this.authService.getAccessToken()
        if (newToken) {
          return next.handle(this.addAuthHeader(request, newToken))
        }
        return EMPTY
      }),
    )
  }

  /**
   * Check if URL is an auth endpoint
   */
  private isAuthEndpoint(url: string): boolean {
    return (
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout")
    )
  }
}
