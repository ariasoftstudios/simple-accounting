import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { NavigationMenuWrapperComponent } from './components/navigation-menu-wrapper/navigation-menu-wrapper';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavigationMenuWrapperComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  readonly title = signal('simple-accounting');
  readonly authService = inject(AuthService);
}
