import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './app-modal.html',
  styleUrl: './app-modal.scss',
})
export class AppModalComponent {
  @Input() headerTitle: string = '';
  @Input() confirmLabel: string = 'Confirm';
  @Input() cancelLabel: string = 'Cancel';
  @Input() resetLabel: string = '';
  @Input() visible: boolean = false;
  @Input() confirmDisabled: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  onHide(): void {
    this.cancel.emit();
  }
}