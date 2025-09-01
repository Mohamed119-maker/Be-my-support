import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const userRoleGuard: CanActivateFn = () => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // Only run in browser environment
    if (!isPlatformBrowser(platformId)) {
        return false;
    }

    const role = localStorage.getItem('role');

    // Redirect to home if role is user, visitor, or missing
    if (!role || role === 'user' || role === 'visitor') {
        router.navigate(['/home']);
        return false;
    }

    // Allow access for other roles (like admin)
    return true;
}; 