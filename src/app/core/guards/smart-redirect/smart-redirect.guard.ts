import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const smartRedirectGuard: CanActivateFn = () => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (isPlatformBrowser(platformId)) {
        const role = localStorage.getItem('role');



        if (role === 'admin') {
            return router.createUrlTree(['/dashboard-overview']);
        }

        return router.createUrlTree(['/home']);
    }

    // For server-side rendering, redirect to home
    return router.createUrlTree(['/home']);
}; 