import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const roleGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Only run in browser environment
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  const role = localStorage.getItem('role');

  // If no role or non-admin role, redirect to home
  if (!role || role === 'user' || role === 'visitor') {
    return router.parseUrl('/home');
  }

  // If role is admin, allow access
  if (role === 'admin') {
    return true;
  }

  // For any other unexpected role value, redirect to home
  return router.parseUrl('/home');
};
