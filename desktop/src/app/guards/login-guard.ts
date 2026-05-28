import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  void route; // Unused parameter
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 Login guard checking access to:', state.url);
  if (authService.isLoggedIn()) {
    // Redirect to home page if already logged in
    console.log('❌ User already logged in, redirecting to home page');
    router.navigate(['/dashboard']);
    return false;
  } else {
    console.log('✅ User not logged in, allowing access to login page');
    return true;
  }
};
