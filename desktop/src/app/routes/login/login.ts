import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

// PrimeNG Components
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

// Services
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(NonNullableFormBuilder);

  // Form group with strongly typed controls
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  // UI state
  isLoading = signal(false);
  errorMessage = '';

  ngOnInit(): void {
    // If user is already logged in, redirect to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Check if form is valid and can be submitted
   */
  get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  /**
   * Get email form control for template access
   */
  get emailControl() {
    return this.loginForm.controls.email;
  }

  /**
   * Get password form control for template access
   */
  get passwordControl() {
    return this.loginForm.controls.password;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage = '';

    const credentials: LoginCredentials = {
      email: this.emailControl.value,
      password: this.passwordControl.value,
    };

    this.authService
      .login(credentials)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.authService.redirectToDashboard();
        },
        error: (error) => {
          console.error('Login failed:', error);

          // Show error message to user
          this.errorMessage =
            error.error?.message || 'Invalid email or password. Please try again.';
        },
      });
  }

  /**
   * Clear error messages when user starts typing
   */
  onInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}
