import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = "accessToken"
  private readonly REFRESH_TOKEN_KEY = "refreshToken"
  private readonly TOKEN_EXPIRY_KEY = "tokenExpiryTime"
  private readonly USER_EMAIL_KEY = "userEmail"
  private readonly AUTHENTICATED_KEY = "authenticated"

  setTokens(accessToken: string, refreshToken?: string, expiryTime?: number): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) {
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    }
    if (expiryTime) {
      sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
    }
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  getTokenExpiry(): number | null {
    const expiry = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY)
    return expiry ? Number.parseInt(expiry, 10) : null
  }

  setUserEmail(email: string): void {
    sessionStorage.setItem(this.USER_EMAIL_KEY, email)
  }

  getUserEmail(): string | null {
    return sessionStorage.getItem(this.USER_EMAIL_KEY)
  }

  setAuthenticated(authenticated: boolean): void {
    sessionStorage.setItem(this.AUTHENTICATED_KEY, authenticated.toString())
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.AUTHENTICATED_KEY) === "true"
  }

  clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY)
    sessionStorage.removeItem(this.USER_EMAIL_KEY)
    sessionStorage.removeItem(this.AUTHENTICATED_KEY)
  }

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry()
    if (!expiry) {
      return true
    }
    return Date.now() >= expiry
  }
}
