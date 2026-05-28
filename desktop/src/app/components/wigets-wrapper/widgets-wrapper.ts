import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-widgets-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widgets-wrapper.html',
  styleUrl: './widgets-wrapper.scss',
})
export class WidgetsWrapper {}
