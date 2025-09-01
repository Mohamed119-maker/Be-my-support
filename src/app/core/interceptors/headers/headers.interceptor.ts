import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Skip token checks if not in browser environment
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Protected endpoints that require authentication
  const protectedEndpoints = [
    '/wishlist',
    '/user',
    '/categories',
    '/dashboard',
    '/admin',
    '/products/contact'
  ];

  // Check if the current request is to a protected endpoint
  const isProtectedEndpoint = protectedEndpoints.some(endpoint =>
    req.url.toLowerCase().includes(endpoint.toLowerCase())
  );

  // Get token from localStorage
  let token: string | null = localStorage.getItem('token');

  // Clean and validate token
  if (token) {
    token = token.trim();
  }

  // Skip adding auth header if token is invalid
  if (!token ||
    token === 'undefined' ||
    token === 'null' ||
    token === '' ||
    token.length < 20) {
    return next(req);
  }

  // Validate JWT structure (should have 3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return next(req);
  }

  // At this point we have a valid-looking token
  try {
    // Remove any existing bearer prefix to prevent duplication
    token = token.replace(/^bearer\s+/i, '');

    // Clone request with authorization header
    const authReq = req.clone({
      setHeaders: {
        ttoken: `bearer ${token}`
      }
    });

    return next(authReq);
  } catch (error) {
    // If any error occurs during token processing, proceed without auth header
    console.warn('Error processing auth token:', error);
    return next(req);
  }
};
