import { Injectable } from "@angular/core"
import { HttpErrorResponse } from "@angular/common/http"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"

export interface ErrorConfig {
  showSnackbar?: boolean
  duration?: number
  redirectTo?: string
  customMessage?: string
}

@Injectable({
  providedIn: "root",
})
export class GlobalErrorHandlerService {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  /**
   * Main error handler method
   */
  handleError(error: Error | HttpErrorResponse, config: ErrorConfig = {}): void {
    console.error("An error occurred:", error)

    const defaultConfig: ErrorConfig = {
      showSnackbar: true,
      duration: 10000,
      redirectTo: undefined,
      customMessage: undefined,
    }

    const finalConfig = { ...defaultConfig, ...config }
    let errorMessage: string

    if (error instanceof HttpErrorResponse) {
      errorMessage = this.getServerErrorMessage(error)
      this.handleHttpError(error, finalConfig)
    } else {
      errorMessage =
        finalConfig.customMessage ||
        "Something went wrong on our side. We're working to fix it! Please try again later."
    }

    if (finalConfig.showSnackbar) {
      this.showErrorMessage(errorMessage, this.getErrorType(error))
    }

    if (finalConfig.redirectTo) {
      this.router.navigate([finalConfig.redirectTo])
    }
  }

  /**
   * Handle authentication specific errors
   */
  handleAuthError(error: HttpErrorResponse): void {
    let message: string
    let redirectTo: string | undefined

    switch (error.status) {
      case 401:
        if (error.url?.includes("/auth/login")) {
          message = "Invalid email or password. Please try again."
        } else {
          message = "Your session has expired. Please log in again."
          redirectTo = "/login"
        }
        break
      case 403:
        message = "You don't have permission to access this resource."
        break
      case 422:
        message = this.extractValidationErrors(error)
        break
      default:
        message = "Authentication failed. Please try again."
    }

    this.handleError(error, {
      customMessage: message,
      redirectTo: redirectTo,
    })
  }

  /**
   * Handle registration specific errors
   */
  handleRegistrationError(error: HttpErrorResponse): void {
    let message: string

    switch (error.status) {
      case 409:
        message = "An account with this email already exists. Please try logging in instead."
        break
      case 422:
        message = this.extractValidationErrors(error)
        break
      case 400:
        message = "Please check your information and try again."
        break
      default:
        message = "Registration failed. Please try again."
    }

    this.handleError(error, {
      customMessage: message,
    })
  }

  /**
   * Handle API specific errors
   */
  handleApiError(error: HttpErrorResponse, operation = "operation"): void {
    let message: string

    switch (error.status) {
      case 404:
        message = `The requested ${operation} was not found.`
        break
      case 409:
        message = `Conflict occurred during ${operation}. Please try again.`
        break
      case 429:
        message = "Too many requests. Please wait a moment and try again."
        break
      default:
        message = `Failed to complete ${operation}. Please try again.`
    }

    this.handleError(error, {
      customMessage: message,
    })
  }

  /**
   * Show success message
   */
  showSuccess(message: string, duration = 5000): void {
    this.snackBar.open(message, "Close", {
      duration: duration,
      panelClass: ["success-snackbar"],
      horizontalPosition: "right",
      verticalPosition: "bottom",
    })
  }

  /**
   * Show info message
   */
  showInfo(message: string, duration = 5000): void {
    this.snackBar.open(message, "Close", {
      duration: duration,
      panelClass: ["info-snackbar"],
      horizontalPosition: "right",
      verticalPosition: "bottom",
    })
  }

  /**
   * Show warning message
   */
  showWarning(message: string, duration = 7000): void {
    this.snackBar.open(message, "Close", {
      duration: duration,
      panelClass: ["warning-snackbar"],
      horizontalPosition: "right",
      verticalPosition: "bottom",
    })
  }

  /**
   * Handle HTTP errors with specific logic
   */
  private handleHttpError(error: HttpErrorResponse, config: ErrorConfig): void {
    // Handle specific status codes that might require special actions
    switch (error.status) {
      case 401:
        // Don't auto-redirect for login attempts
        if (!error.url?.includes("/auth/login")) {
          config.redirectTo = "/login"
        }
        break
      case 403:
        // Could redirect to unauthorized page
        break
      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors - could implement retry logic
        break
    }
  }

  /**
   * Get server error message based on HTTP status
   */
  private getServerErrorMessage(error: HttpErrorResponse): string {
    // Try to extract message from error response
    if (error.error && typeof error.error === "object") {
      if (error.error.message) {
        return error.error.message
      }
      if (error.error.error) {
        return error.error.error
      }
    }

    // Fallback to status-based messages
    switch (error.status) {
      case 0:
        return "Unable to connect to the server. Please check your internet connection and try again."
      case 400:
        return "Bad request. Please check your input and try again."
      case 401:
        return "Authentication required. Please log in and try again."
      case 403:
        return "You don't have permission to perform this action."
      case 404:
        return "The requested resource was not found."
      case 409:
        return "Conflict occurred. The resource already exists or is in use."
      case 422:
        return "Validation failed. Please check your input."
      case 429:
        return "Too many requests. Please wait a moment and try again."
      case 500:
        return "Internal server error. Our team has been notified."
      case 502:
        return "Bad gateway. The server is temporarily unavailable."
      case 503:
        return "Service temporarily unavailable. Please try again later."
      case 504:
        return "Gateway timeout. The request took too long to process."
      default:
        return `An unexpected error occurred (${error.status}). Please try again later.`
    }
  }

  /**
   * Extract validation errors from response
   */
  private extractValidationErrors(error: HttpErrorResponse): string {
    if (error.error && error.error.errors) {
      // Handle validation errors array
      if (Array.isArray(error.error.errors)) {
        return error.error.errors.join(", ")
      }
      // Handle validation errors object
      if (typeof error.error.errors === "object") {
        const errors = Object.values(error.error.errors).flat()
        return errors.join(", ")
      }
    }

    if (error.error && error.error.message) {
      return error.error.message
    }

    return "Validation failed. Please check your input and try again."
  }

  /**
   * Determine error type for styling
   */
  private getErrorType(error: Error | HttpErrorResponse): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status >= 500) {
        return "server-error"
      } else if (error.status >= 400) {
        return "client-error"
      }
    }
    return "general-error"
  }

  /**
   * Display error message with appropriate styling
   */
  private showErrorMessage(message: string, errorType = "general-error"): void {
    const panelClass = ["error-snackbar", errorType]

    this.snackBar.open(message, "Close", {
      duration: 10000,
      panelClass: panelClass,
      horizontalPosition: "right",
      verticalPosition: "bottom",
    })
  }

  /**
   * Clear all snackbars
   */
  clearMessages(): void {
    this.snackBar.dismiss()
  }
}
