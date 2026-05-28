import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { MOCK_INVOICES, MOCK_PRODUCT_CATEGORIES } from '../mock';

export interface InvoiceApiItem {
  id: number;
  userId: number;
  productCategoryId: number;
  productCategoryName: string;
  invoiceNumber: string;
  invoiceName: string;
  price: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  orgNumber: string;
  outgoingVat: number;
  createdDate: string;
  endingDate: string;
  attachmentPath: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProductCategoryApiItem {
  id: number;
  name: string;
}

export interface InvoicesResponse {
  success: boolean;
  message: string;
  data: InvoiceApiItem[];
}

export interface InvoiceCategoriesResponse {
  success: boolean;
  message: string;
  data: ProductCategoryApiItem[];
}

export interface CreateInvoiceRequest {
  productCategoryId: number;
  invoiceNumber: string;
  invoiceName: string;
  price: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  orgNumber: string;
  outgoingVat: number;
  createdDate: string;
  endingDate: string;
  attachmentPath?: string | null;
}

export interface CreateInvoiceResponse {
  success: boolean;
  message: string;
  data: InvoiceApiItem;
}
export interface InvoiceFilterParams {
  fromDate?: string;
  toDate?: string;
  productCategoryId?: number;
  invoiceName?: string;
  invoiceNumber?: string;
  clientName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoices: InvoiceApiItem[] = MOCK_INVOICES.map((invoice) => ({ ...invoice }));

  getInvoices(filters: InvoiceFilterParams = {}): Observable<InvoicesResponse> {
    const filteredInvoices = this.invoices.filter((invoice) => {
      if (filters.fromDate && invoice.createdDate < filters.fromDate) {
        return false;
      }

      if (filters.toDate && invoice.createdDate > filters.toDate) {
        return false;
      }

      if (filters.productCategoryId && invoice.productCategoryId !== filters.productCategoryId) {
        return false;
      }

      if (!this.matchesFilter(invoice.clientName, filters.clientName)) {
        return false;
      }

      if (!this.matchesFilter(invoice.invoiceName, filters.invoiceName)) {
        return false;
      }

      if (!this.matchesFilter(invoice.invoiceNumber, filters.invoiceNumber)) {
        return false;
      }

      return true;
    });

    return of({
      success: true,
      message: 'Invoices fetched successfully',
      data: filteredInvoices.map((invoice) => ({ ...invoice })),
    }).pipe(delay(250));
  }

  uploadAttachment(file: File): Observable<{ success: boolean; data: { path: string } }> {
    return of({
      success: true,
      data: {
        path: `mock-uploads/${encodeURIComponent(file.name)}`,
      },
    }).pipe(delay(150));
  }

  getInvoiceCategories(): Observable<InvoiceCategoriesResponse> {
    return of({
      success: true,
      message: 'Invoice categories fetched successfully',
      data: MOCK_PRODUCT_CATEGORIES.map((category) => ({ ...category })),
    }).pipe(delay(150));
  }

  createInvoice(payload: CreateInvoiceRequest): Observable<CreateInvoiceResponse> {
    const category = MOCK_PRODUCT_CATEGORIES.find((item) => item.id === payload.productCategoryId);
    const timestamp = new Date().toISOString();
    const nextId = this.invoices.reduce((maxId, invoice) => Math.max(maxId, invoice.id), 0) + 1;

    const createdInvoice: InvoiceApiItem = {
      id: nextId,
      userId: 1,
      productCategoryId: payload.productCategoryId,
      productCategoryName: category?.name ?? 'Ingen kategori',
      invoiceNumber: payload.invoiceNumber,
      invoiceName: payload.invoiceName,
      price: payload.price,
      clientName: payload.clientName,
      clientEmail: payload.clientEmail,
      clientPhone: payload.clientPhone,
      orgNumber: payload.orgNumber,
      outgoingVat: payload.outgoingVat,
      createdDate: payload.createdDate,
      endingDate: payload.endingDate,
      attachmentPath: payload.attachmentPath ?? null,
      createdAt: timestamp,
      updatedAt: null,
    };

    this.invoices = [createdInvoice, ...this.invoices];

    return of({
      success: true,
      message: 'Invoice created successfully',
      data: { ...createdInvoice },
    }).pipe(delay(250));
  }

  private matchesFilter(value: string, query?: string): boolean {
    if (!query) {
      return true;
    }

    return value.toLowerCase().includes(query.trim().toLowerCase());
  }
}
