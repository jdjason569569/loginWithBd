import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Wait a bit for the auth state to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!authService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/dashboard']);
    return false;
};
