import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ProductCategoryApiItem } from '../../services/invoice.service';
import { FilterValues } from '../../routes/invoices/invoices';

@Component({
  selector: 'invoice-filters',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, DatePickerModule, SelectModule],
  templateUrl: './invoice-filters.html',
  styleUrl: './invoice-filters.scss',
})
export class InvoiceFiltersComponent {
  @Input() productCategoryOptions: ProductCategoryApiItem[] = [];
  @Input() isLoading: boolean = false;

  @Output() filterSubmit = new EventEmitter<FilterValues>();
  @Output() filterReset = new EventEmitter<void>();

  filters: FilterValues = {
    invoiceName: '',
    invoiceNumber: '',
    customer: '',
    fromDate: null,
    toDate: null,
    type: null,
    productCategoryId: null,
  };

  onSubmit(): void {
    this.filterSubmit.emit({ ...this.filters });
  }

  onReset(): void {
    this.filters = {
      invoiceName: '',
      invoiceNumber: '',
      customer: '',
      fromDate: null,
      toDate: null,
      type: null,
      productCategoryId: -1,
    };
    this.filterReset.emit();
  }
}