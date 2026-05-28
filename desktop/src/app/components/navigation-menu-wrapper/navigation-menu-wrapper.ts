import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuItemComponent } from '../menu-item/menu-item';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-menu-wrapper',
  standalone: true,
  imports: [MenuItemComponent, RouterModule],
  templateUrl: './navigation-menu-wrapper.html',
})
export class NavigationMenuWrapperComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription?: Subscription;

  menuItems = [
    { title: 'Dashboard', route: '/dashboard', isActive: false },
    { title: 'Intäkter', route: '/intakter', isActive: false },
    { title: 'Kostnader', route: '/kostnader', isActive: false },
    { title: 'Sammanställning', route: '/sammanstallning', isActive: false },
    { title: 'Rapporter', route: '/rapporter', isActive: false },
  ];

  ngOnInit() {
    // Listen to router events to update active states
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveStates();
      });

    // Set initial active states
    this.updateActiveStates();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateActiveStates() {
    const currentUrl = this.router.url;
    this.menuItems.forEach((item) => {
      item.isActive = currentUrl === item.route;
    });
  }
}
