import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService {

  constructor(private snackBar: MatSnackBar) { }

  // Handle errors
  handleError(error: Error | HttpErrorResponse): void {
    console.error('An error occurred:', error);
    let errorMessage: string;

    if (error instanceof HttpErrorResponse) {
      // Server or connection error
      errorMessage = this.getServerErrorMessage(error);
    } else {
      // Client Error
      errorMessage = 'Something went wrong on our side. We\'re working to fix it! Please try again later.';
    }

    // Show error message to the user
    this.showErrorMessage(errorMessage);
  }

  // Get server error message
  private getServerErrorMessage(error: HttpErrorResponse): string {
    // Handle different HTTP status codes
    if (error.status === 0) {
      return 'It seems like we are having trouble connecting to the server. Please check your internet connection and try again later.';
    } else if (error.status >= 500) {
      return 'Oops! Our service is temporarily unavailable. Please try again in a few minutes.';
    } else {
      return `Error: ${error.status}. Something went wrong on our side. Please try again later.`;
    }
  }

  // Display the error message to the user using a SnackBar
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 10000,  // Keep the error visible for 10 seconds
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
