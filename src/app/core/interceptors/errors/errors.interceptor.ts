import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { WishlistService } from '../../services/wishlist/wishlist.service';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {

  const wishlistService = inject(WishlistService)
  return next(req).pipe(catchError((err) => {
    console.log(err);


    wishlistService.error(err.error.message)
    return throwError(() => err);
  }));
};
