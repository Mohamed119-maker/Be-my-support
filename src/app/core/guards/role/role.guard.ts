import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const roleGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user?.role === 'admin') {
      router.navigate(['/dashboard-overview']);
      return false;
    }

    // أي دور آخر يروح لـ home
    router.navigate(['/home']);
    return false;
  }

  // في حالة السيرفر أو عدم التحقق من المنصة، امنع التفعيل
  return false;
};
