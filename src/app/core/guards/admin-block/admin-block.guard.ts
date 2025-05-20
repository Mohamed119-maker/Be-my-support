import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const adminBlockGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      router.navigate(['/dashboard-overview']);
      return false;
    }
  }

  return true;
};
