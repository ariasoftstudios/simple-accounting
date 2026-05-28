import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './app-logo.html',
  styleUrl: './app-logo.scss',
})
export class AppLogoComponent {
  private router = inject(Router);

  onLogoClick(): void {
    // Implement logic to navigate to homepage
    this.router.navigate(['/dashboard']);
  }
}
