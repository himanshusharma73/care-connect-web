// src/app/services/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalErrorHandlerService } from './global-error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private globalErrorHandler: GlobalErrorHandlerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.globalErrorHandler.handleError(error); // Pass the error to the global error handler
        throw error; // Rethrow the error for further processing if needed
      })
    );
  }
}
