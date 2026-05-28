import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu-item.html',
})
export class MenuItemComponent {
  @Input() title: string = '';
  @Input() isActive: boolean = false;
  @Input() route: string = '';
}
