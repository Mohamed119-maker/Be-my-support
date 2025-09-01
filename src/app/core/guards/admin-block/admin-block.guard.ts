import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const adminBlockGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // For SSR, block access immediately
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  // Check role synchronously
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // If admin, redirect immediately
  if (token && role === 'admin') {
    // Create URL tree synchronously to prevent any rendering
    return router.parseUrl('/dashboard-overview');
  }

  // Allow access for non-admin users
  return true;
};
