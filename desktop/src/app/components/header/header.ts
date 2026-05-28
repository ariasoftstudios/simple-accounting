import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppLogoComponent } from '../app-logo/app-logo';
import { RouteData } from '../../interfaces';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { HamburgerMenu } from '../hamburger-menu/hamburger-menu';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AppLogoComponent, ButtonModule, ButtonGroupModule, HamburgerMenu],

  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private routerSubscription?: Subscription;

  currentPageName: string | null = null;
  userName = 'John Doe';
  userRole = 'Accountant';
  userInitials = 'JD';

  ngOnInit() {
    // Listen to router events and extract page name from route data
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe({
        next: (event) => {
          this.updatePageName();
        },
        error: (error) => {
          console.error('Error updating page name:', error);
        },
      });

    // Set initial page name on component load
    this.updatePageName();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updatePageName() {
    let route = this.activatedRoute;

    // Navigate to the deepest child route
    while (route.firstChild) {
      route = route.firstChild;
    }

    // Extract page name from route data
    const routeData = route.snapshot.data as RouteData;
    this.currentPageName = routeData.pageName || null;
  }
}
