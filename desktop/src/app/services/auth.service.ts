import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, of, tap, throwError } from 'rxjs';
import { MOCK_LOGIN_CREDENTIALS, MOCK_LOGIN_USER } from '../mock';

/**
 * Interface for login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface for login response from backend
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      createdAt: string;
      updatedAt: string | null;
    };
    expiredAt: string;
  };
}

/** Decoded payload of JWT token
 * @see https://jwt.io
 * @param userId - user ID
 * @param email - user email
 * @param firstName - user first name
 * @param lastName - user last name
 * @param iat - issued at timestamp (optional)
 * @param exp - expiration timestamp (optional)
 */
export type LoginDecodedToken = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  /**
   * Log in user with email and password
   * @param credentials - user email and password
   * @returns Observable of login response
   */
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    if (
      credentials.email !== MOCK_LOGIN_CREDENTIALS.email ||
      credentials.password !== MOCK_LOGIN_CREDENTIALS.password
    ) {
      return throwError(() => ({
        error: {
          message: 'Invalid email or password. Please try again.',
        },
      }));
    }

    const token = this.createMockToken();
    const response: LoginResponse = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { ...MOCK_LOGIN_USER },
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    return of(response).pipe(
      delay(250),
      tap((response) => {
        if (response.success) {
          // Store token and user data in localStorage
          this.saveToken(response.data.token);
          this.saveUser(response.data.user);
          console.log('✅ User logged in successfully:', response.data.user.email);
        }
      }),
    );
  }

  private createMockToken(): string {
    const payload: LoginDecodedToken = {
      userId: MOCK_LOGIN_USER.id,
      email: MOCK_LOGIN_USER.email,
      firstName: MOCK_LOGIN_USER.firstName,
      lastName: MOCK_LOGIN_USER.lastName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    };

    return `mock.${btoa(JSON.stringify(payload))}.signature`;
  }

  /**
   * Save JWT token to localStorage
   * @param token - JWT token from backend
   */
  private saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Save user data to localStorage
   * @param user - user information
   */
  private saveUser(user: any): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Get stored JWT token
   * @returns token string or null
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
  /**
   * Decode JWT token to get payload
   * @param token - JWT token string
   * @returns decoded payload or null if invalid
   */
  private decodeToken(token: string): LoginDecodedToken | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      // Decode base64 payload
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload) as LoginDecodedToken;
    } catch (error) {
      console.error('❌ Failed to decode token:', error);
      return null;
    }
  }
  /**
   * Check if JWT token is expired
   * @param token - JWT token string
   * @returns true if token is expired or invalid
   */
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      console.warn('⚠️ Token does not have exp field, treating as expired');
      return true; // Treat tokens without exp as expired for safety
    }
    // JWT exp is in seconds, Date.now() is in milliseconds
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  }
  /**
   * Get stored user data
   * @returns user object or null
   */
  getCurrentUser(): any {
    const userData = localStorage.getItem('current_user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is logged in
   * @returns true if user has valid token
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    // TODO: In production, you might want to check if token is expired
    if (this.isTokenExpired(token)) {
      console.log('❌ Token is expired, logging out user');
      this.logout();
      return false;
    }
    // For now, just check if token exists
    return true;
  }

  /**
   * Log out user - clear stored data and redirect to login
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    console.log('✅ User logged out successfully');
    this.router.navigate(['/login']);
  }

  /**
   * Redirect to dashboard after successful login
   */
  redirectToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
