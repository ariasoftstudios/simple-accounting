import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CardModule, CommonModule],
  templateUrl: './widget.html',
  styleUrl: './widget.scss',
})
export class Widget {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() iconColor: string = 'text-blue-500';
}
