import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError, EMPTY } from 'rxjs';
import { WishlistService } from '../../services/wishlist/wishlist.service';

export const errorsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const wishlistService = inject(WishlistService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check for specific JWT error
      if (error.status === 500 &&
        error.error?.message === 'jwt must be provided') {
        // Silently ignore JWT errors
        console.debug('Suppressing JWT error for non-authenticated request');
        return EMPTY;
      }

      // For all other errors, show toast notification and propagate the error
      if (error.error?.message) {
        wishlistService.error(error.error.message);
      } else {
        wishlistService.error('An unexpected error occurred');
      }

      return throwError(() => error);
    })
  );
};
