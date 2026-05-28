import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { MenuItemCommandEvent } from 'primeng/api';

@Component({
  selector: 'app-hamburger-menu',
  imports: [ButtonModule, RippleModule, DrawerModule, CommonModule],
  standalone: true,
  templateUrl: './hamburger-menu.html',
  styleUrl: './hamburger-menu.scss',
})
export class HamburgerMenu implements OnInit {
  visible: boolean = false;
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: (event: MenuItemCommandEvent) => {
          this.close();
        },
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: (event: MenuItemCommandEvent) => {
          console.log('Settings', event);
          this.close();
        },
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: (event: MenuItemCommandEvent) => {
          console.log('Logout', event);
          this.close();
        },
      },
    ];
  }

  close() {
    this.visible = false;
  }

  onItemClick(item: MenuItem, event: Event) {
    item.command?.({ originalEvent: event, item });
  }
}
