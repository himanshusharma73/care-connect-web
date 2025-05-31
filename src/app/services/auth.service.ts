import { Inject, Injectable } from "@angular/core"
import { HttpBackend, HttpClient, type HttpErrorResponse } from "@angular/common/http"
import { Router } from "@angular/router"
import { type Observable, throwError, BehaviorSubject } from "rxjs"
import { catchError, tap } from "rxjs/operators"
import type { AuthResponse } from "../models/auth.models"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "http://localhost:8080/auth"

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidSession())
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  private accessToken: string | null = null
  private tokenExpiryTime: number | null = null
  private refreshTimer: any

  // Use HttpBackend to bypass interceptors for auth requests
  private httpClient: HttpClient

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(HttpBackend) private httpBackend: HttpBackend,
  ) {
    // Create a separate HttpClient that bypasses interceptors
    this.httpClient = new HttpClient(httpBackend)
    this.initializeAuth()
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.API_URL}/login`, credentials, { withCredentials: true }).pipe(
      tap((response) => {
        console.log("Login response received:", response)
        this.handleAuthSuccess(response, credentials.email)
      }),
      catchError(this.handleAuthError.bind(this)),
    )
  }

  refreshToken(): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.API_URL}/refresh`, {}, { withCredentials: true }).pipe(
      tap((response) => {
        console.log("Token refresh successful")
        this.handleTokenRefresh(response)
      }),
      catchError((err) => {
        console.error("Token refresh failed:", err)
        this.logout()
        return throwError(() => err)
      }),
    )
  }

  logout(): void {
    console.log("Logging out...")
    this.clearAuthData()
    this.httpClient.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).subscribe({
      complete: () => this.router.navigate(["/login"]),
      error: () => this.router.navigate(["/login"]),
    })
  }

  getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      console.log("Token expired, clearing...")
      this.clearAccessToken()
      return null
    }
    return this.accessToken
  }

  get isAuthenticated(): boolean {
    const hasValidToken = !this.isTokenExpired() && !!this.accessToken
    const hasSession = this.hasValidSession()
    const isAuth = hasValidToken && hasSession

    console.log("Auth check:", {
      hasValidToken,
      hasSession,
      isAuthenticated: isAuth,
      tokenExpiry: this.tokenExpiryTime ? new Date(this.tokenExpiryTime).toLocaleTimeString() : null,
    })

    return isAuth
  }

  getCurrentUserEmail(): string | null {
    return sessionStorage.getItem("userEmail")
  }

  private handleAuthSuccess(response: AuthResponse, email: string): void {
    console.log("Handling auth success...")
    this.accessToken = response.accessToken
    const expiryTime = this.getTokenExpiry(response.accessToken)
    if (expiryTime) {
      this.tokenExpiryTime = expiryTime - 30 * 1000
      sessionStorage.setItem("accessToken", this.accessToken)
      sessionStorage.setItem("tokenExpiryTime", this.tokenExpiryTime.toString())
    } else {
      console.warn("Token missing expiry; forcing immediate expiration.")
      this.tokenExpiryTime = Date.now()
    }
    sessionStorage.setItem("userEmail", email)
    sessionStorage.setItem("authenticated", "true")
    this.isAuthenticatedSubject.next(true)
    this.scheduleTokenRefresh()
    console.log("Authentication successful, state updated")
  }

  private handleTokenRefresh(response: AuthResponse): void {
    this.accessToken = response.accessToken
    const expiryTime = this.getTokenExpiry(response.accessToken)
    if (expiryTime) {
      this.tokenExpiryTime = expiryTime - 30 * 1000
      sessionStorage.setItem("accessToken", this.accessToken)
      sessionStorage.setItem("tokenExpiryTime", this.tokenExpiryTime.toString())
    } else {
      console.warn("Token missing expiry; forcing immediate expiration.")
      this.tokenExpiryTime = Date.now()
    }
    this.isAuthenticatedSubject.next(true)
    this.scheduleTokenRefresh()
  }

  private getTokenExpiry(token: string): number | null {
    const decoded = this.decodeToken(token)
    if (decoded && decoded.exp) {
      return decoded.exp * 1000
    }
    return null
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split(".")[1]
      const decodedPayload = atob(payload)
      return JSON.parse(decodedPayload)
    } catch (error) {
      console.error("Error decoding token:", error)
      return null
    }
  }

  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    console.error("Authentication error:", error)
    this.clearAuthData()
    return throwError(() => error)
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiryTime) {
      return true
    }
    return Date.now() >= this.tokenExpiryTime
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
    }
    if (!this.tokenExpiryTime) {
      return
    }
    const refreshTime = this.tokenExpiryTime - Date.now() - 2 * 60 * 1000
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        if (this.isAuthenticated) {
          console.log("Auto-refreshing token...")
          this.refreshToken().subscribe({
            error: (err) => console.error("Auto-refresh failed:", err),
          })
        }
      }, refreshTime)
    }
  }

  private clearAccessToken(): void {
    this.accessToken = null
    this.tokenExpiryTime = null
  }

  private clearAuthData(): void {
    this.clearAccessToken()
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
    }
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("tokenExpiryTime")
    sessionStorage.removeItem("userEmail")
    sessionStorage.removeItem("authenticated")
    this.isAuthenticatedSubject.next(false)
  }

  private hasValidSession(): boolean {
    return sessionStorage.getItem("authenticated") === "true"
  }

  private initializeAuth(): void {
    const storedToken = sessionStorage.getItem("accessToken")
    const storedExpiry = sessionStorage.getItem("tokenExpiryTime")

    if (storedToken && storedExpiry) {
      this.accessToken = storedToken
      this.tokenExpiryTime = Number.parseInt(storedExpiry, 10)

      // Check if token is still valid before attempting refresh
      if (!this.isTokenExpired() && this.hasValidSession()) {
        this.isAuthenticatedSubject.next(true)
        this.scheduleTokenRefresh()
        return
      }
    }

    if (this.hasValidSession()) {
      console.log("Found existing session, attempting refresh...")
      this.refreshToken().subscribe({
        next: () => console.log("Session restored successfully"),
        error: () => {
          console.log("Session restore failed, clearing data")
          this.clearAuthData()
        },
      })
    }
  }
}
