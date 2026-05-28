import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InvoiceTableRow } from '../../routes/invoices/invoices';

@Component({
  selector: 'invoice-table',
  standalone: true,
  imports: [CurrencyPipe, ButtonModule, TableModule, TagModule],
  templateUrl: './invoice-table.html',
  styleUrl: './invoice-table.scss',
})
export class InvoiceTableComponent {
  @Input() invoices: InvoiceTableRow[] = [];
  @Input() errorMessage: string = '';

  @Output() newInvoiceClick = new EventEmitter<void>();

  get totalPrice(): number {
    return this.invoices.reduce((sum, inv) => sum + inv.price, 0);
  }

  getCategoryTag(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const normalized = type.trim().toLowerCase();
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      Produkt: 'success',
      Tjänst: 'info',
      Abonnemang: 'warn',
      service: 'info',
      general: 'success',
      home: 'warn',
      office: 'danger',
      other: 'contrast',
    };
    return map[normalized] ?? 'secondary';
  }
}