import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';
import {
  CreateInvoiceRequest,
  InvoiceApiItem,
  InvoiceService,
  ProductCategoryApiItem,
} from '../../services/invoice.service';
import { InvoiceFiltersComponent } from '../../components/invoice-filters/invoice-filters';
import { InvoiceTableComponent } from '../../components/invoice-table/invoice-table';
import { AppModalComponent } from '../../components/app-modal/app-modal';
export interface InvoiceTableRow {
  invoiceName: string;
  invoiceNumber: string;
  createdAt: string;
  type: string;
  price: number;
  attachmentPath: string | null;
}

export interface FilterValues {
  invoiceName: string;
  invoiceNumber: string;
  customer: string;
  fromDate: Date | null;
  toDate: Date | null;
  type: string | null;
  productCategoryId: number | null;
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    InputTextModule,
    ButtonModule,
    InvoiceFiltersComponent,
    InvoiceTableComponent,
    AppModalComponent,
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss',
})
export class InvoicesComponent {
  private invoiceService = inject(InvoiceService);
  private formBuilder = inject(NonNullableFormBuilder);

  isLoading = signal(false);
  isCreateInvoiceModalVisible = signal(false);
  errorMessage = '';

  openCreateInvoiceModal(): void {
    this.isCreateInvoiceModalVisible.set(true);
  }

  closeCreateInvoiceModal(): void {
    this.isCreateInvoiceModalVisible.set(false);
  }

  onCancelCreateInvoice(): void {
    this.resetCreateInvoiceFormInteractionState();
    this.closeCreateInvoiceModal();
  }

  private resetCreateInvoiceFormInteractionState(): void {
    this.createInvoiceForm.markAsUntouched();
    this.createInvoiceForm.markAsPristine();
    this.createInvoiceForm.updateValueAndValidity({ emitEvent: false });
  }

  onSaveCreateInvoice(): void {
    if (this.createInvoiceForm.invalid) {
      this.touchCreateInvoiceForm();
      return;
    }

    const rawFormValue = this.createInvoiceForm.getRawValue();
    const createdDate = this.toApiDateString(rawFormValue.invoice.invoiceDate);
    const endingDate = this.toApiDateString(rawFormValue.invoice.dueDate);
    const invoiceName = rawFormValue.invoice.invoiceName;

    if (!createdDate || !endingDate || rawFormValue.invoice.category === null || !invoiceName) {
      this.errorMessage =
        'Faktureringsdatum, förfallodatum, kategori eller fakturanamn är ogiltigt.';
      this.touchCreateInvoiceForm();
      return;
    }

    const file = this.selectedAttachmentFiles[0] ?? null;

    if (file) {
      this.invoiceService.uploadAttachment(file).subscribe({
        next: (response) => this.submitInvoice(response.data.path),
        error: () => {
          this.errorMessage = 'Kunde inte ladda upp filen. Försök igen.';
        },
      });
    } else {
      this.submitInvoice(null);
    }
  }

  private submitInvoice(attachmentPath: string | null): void {
    const rawFormValue = this.createInvoiceForm.getRawValue();
    const createdDate = this.toApiDateString(rawFormValue.invoice.invoiceDate)!;
    const endingDate = this.toApiDateString(rawFormValue.invoice.dueDate)!;

    const payload: CreateInvoiceRequest = {
      productCategoryId: rawFormValue.invoice.category!,
      invoiceName: rawFormValue.invoice.invoiceName,
      invoiceNumber: rawFormValue.invoice.invoiceNumber,
      price: rawFormValue.invoice.price,
      clientName: rawFormValue.contact.name,
      clientEmail: rawFormValue.contact.email,
      clientPhone: rawFormValue.contact.phoneNumber,
      orgNumber: rawFormValue.company.orgNumber,
      outgoingVat: rawFormValue.invoice.outgoingVat,
      createdDate,
      endingDate,
      attachmentPath,
    };

    this.invoiceService.createInvoice(payload).subscribe({
      next: () => {
        this.errorMessage = '';
        this.resetCreateInvoiceForm();
        this.closeCreateInvoiceModal();
        this.onFilterClick(this.lastFilterValues);
      },
      error: (error) => {
        console.error('Failed to create invoice:', error);
        this.errorMessage = error.error?.message || 'Kunde inte skapa fakturan. Försök igen.';
      },
    });
  }

  private toApiDateString(value: unknown): string | null {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().split('T')[0];
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }

    return null;
  }

  private resetCreateInvoiceForm(): void {
    this.createInvoiceForm.reset({
      invoice: {
        invoiceName: '',
        invoiceNumber: '',
        category: null,
        price: 0,
        outgoingVat: 25,
        invoiceDate: '',
        dueDate: '',
      },
      company: {
        companyName: '',
        orgNumber: '',
        phoneNumber: '',
      },
      contact: {
        name: '',
        email: '',
        phoneNumber: '',
      },
      attachments: {
        files: [],
      },
    });
    this.createInvoiceForm.markAsPristine();
    this.createInvoiceForm.markAsUntouched();
  }

  productCategoryOptions = signal<ProductCategoryApiItem[]>([]);

  private readonly defaultProductCategory: ProductCategoryApiItem = {
    id: null as unknown as number,
    name: 'Ingen kategori',
  };

  private lastFilterValues: FilterValues = {
    invoiceName: '',
    invoiceNumber: '',
    customer: '',
    fromDate: null,
    toDate: null,
    type: null,
    productCategoryId: null,
  };

  ngOnInit(): void {
    this.invoiceService.getInvoiceCategories().subscribe({
      next: (response) => {
        this.productCategoryOptions.set([this.defaultProductCategory, ...response.data]);
      },
      error: (error) => {
        console.error('Failed to fetch invoice categories:', error);
        this.productCategoryOptions.set([this.defaultProductCategory]);
      },
    });
  }

  invoices: InvoiceTableRow[] = [];

  onFilterClick(filterValues: FilterValues): void {
    if (this.isLoading()) {
      return;
    }

    this.lastFilterValues = filterValues;
    this.errorMessage = '';
    this.isLoading.set(true);

    const filterParams = {
      fromDate: filterValues.fromDate
        ? filterValues.fromDate.toISOString().split('T')[0]
        : undefined,
      toDate: filterValues.toDate ? filterValues.toDate.toISOString().split('T')[0] : undefined,
      productCategoryId: filterValues.productCategoryId ?? undefined,
      clientName: filterValues.customer.trim() || undefined,
      invoiceName: filterValues.invoiceName.trim() || undefined,
      invoiceNumber: filterValues.invoiceNumber.trim() || undefined,
    };

    this.invoiceService
      .getInvoices(filterParams)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this.invoices = response.data.map((invoice) => this.toTableRow(invoice));
        },
        error: (error) => {
          console.error('Failed to fetch invoices:', error);
          this.errorMessage = error.error?.message || 'Kunde inte hämta fakturor. Försök igen.';
          this.invoices = [];
        },
      });
  }

  onAttachmentInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newFiles = input.files ? Array.from(input.files) : [];
    const existingFiles: File[] = this.attachmentsGroup.get('files')?.value || [];
    const merged = [...existingFiles, ...newFiles];
    this.attachmentsGroup.get('files')?.setValue(merged);
    input.value = '';
  }

  removeAttachment(index: number): void {
    const currentFiles = this.attachmentsGroup.get('files')?.value || [];
    const updatedFiles = currentFiles.filter((_: File, i: number) => i !== index);
    this.attachmentsGroup.get('files')?.setValue(updatedFiles);
  }

  get selectedAttachmentFiles(): File[] {
    return this.attachmentsGroup.get('files')?.value || [];
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const size = bytes / Math.pow(1024, exponent);

    return `${size.toFixed(2)} ${units[exponent]}`;
  }

  private toTableRow(invoice: InvoiceApiItem): InvoiceTableRow {
    return {
      invoiceName: invoice.invoiceName,
      invoiceNumber: invoice.invoiceNumber,
      createdAt: invoice.createdDate,
      type: invoice.productCategoryName,
      price: invoice.price,
      attachmentPath: invoice.attachmentPath,
    };
  }

  createInvoiceForm = this.formBuilder.group({
    invoice: this.formBuilder.group({
      invoiceNumber: ['', [Validators.required, Validators.minLength(2)]],
      invoiceName: ['', [Validators.required, Validators.minLength(2)]],
      category: [null as number | null, Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      outgoingVat: [25, Validators.required],
      invoiceDate: ['', Validators.required],
      dueDate: ['', Validators.required],
    }),
    company: this.formBuilder.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      orgNumber: ['', [Validators.required, Validators.pattern(/^\d{6}-\d{4}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
    }),
    contact: this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
    }),
    attachments: this.formBuilder.group({
      files: [[] as File[]],
    }),
  });

  vatOptions = [
    { label: '0%', value: 0 },
    { label: '6%', value: 6 },
    { label: '12%', value: 12 },
    { label: '25%', value: 25 },
  ];

  get invoiceGroup() {
    return this.createInvoiceForm.controls.invoice;
  }

  get companyGroup() {
    return this.createInvoiceForm.controls.company;
  }

  get contactGroup() {
    return this.createInvoiceForm.controls.contact;
  }

  get attachmentsGroup() {
    return this.createInvoiceForm.controls.attachments;
  }

  get isCreateInvoiceSaveDisabled(): boolean {
    return this.isLoading() || this.createInvoiceForm.invalid;
  }

  hasCreateInvoiceError(path: string, errorCode: string): boolean {
    const control = this.createInvoiceForm.get(path);
    return !!control && control.hasError(errorCode) && (control.touched || control.dirty);
  }

  touchCreateInvoiceForm(): void {
    this.createInvoiceForm.markAllAsTouched();
  }
}
