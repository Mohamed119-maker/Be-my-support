import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.includes('products') || req.url.includes('wishList') || req.url.includes('user') || req.url.includes('user/reset-pass') || req.url.includes('categories')) {
    if (localStorage.getItem('token')) {
      req = req.clone({
        setHeaders: {
          ttoken: `bearer ${localStorage.getItem('token')}`
        }
      })

    }
  }


  return next(req);
};
