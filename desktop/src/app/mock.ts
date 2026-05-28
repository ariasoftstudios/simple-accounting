import { WidgetInterface } from './interfaces';

export type MockUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string | null;
};

export type MockProductCategory = {
  id: number;
  name: string;
};

export type MockInvoice = {
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
};

export const MOCK_LOGIN_CREDENTIALS = {
  email: 'john.doe@example.com',
  password: 'password123',
};

export const MOCK_LOGIN_USER: MockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  createdAt: '2026-02-20T14:54:29.000Z',
  updatedAt: null,
};

export const MOCK_PRODUCT_CATEGORIES: MockProductCategory[] = [
  { id: 1, name: 'Produkt' },
  { id: 2, name: 'Tjanst' },
  { id: 3, name: 'Abonnemang' },
];

export const MOCK_INVOICES: MockInvoice[] = [
  {
    id: 1,
    userId: 1,
    productCategoryId: 2,
    productCategoryName: 'Tjanst',
    invoiceNumber: 'INV-2026-001',
    invoiceName: 'Bokslutsstod april',
    price: 15000,
    clientName: 'Nordic Lantern AB',
    clientEmail: 'finance@nordiclantern.se',
    clientPhone: '+46701234567',
    orgNumber: '556677-8899',
    outgoingVat: 25,
    createdDate: '2026-04-05',
    endingDate: '2026-05-05',
    attachmentPath: 'mock-uploads/bokslutsstod-april.pdf',
    createdAt: '2026-04-05T08:00:00.000Z',
    updatedAt: null,
  },
  {
    id: 2,
    userId: 1,
    productCategoryId: 1,
    productCategoryName: 'Produkt',
    invoiceNumber: 'INV-2026-002',
    invoiceName: 'Licenspaket Simple Accounting',
    price: 8900,
    clientName: 'Hav & Hem i Sverige AB',
    clientEmail: 'inkop@havhem.se',
    clientPhone: '+46812345678',
    orgNumber: '559901-1122',
    outgoingVat: 25,
    createdDate: '2026-04-22',
    endingDate: '2026-05-22',
    attachmentPath: null,
    createdAt: '2026-04-22T11:30:00.000Z',
    updatedAt: null,
  },
  {
    id: 3,
    userId: 1,
    productCategoryId: 3,
    productCategoryName: 'Abonnemang',
    invoiceNumber: 'INV-2026-003',
    invoiceName: 'Ekonomioversikt Q2',
    price: 4200,
    clientName: 'Studio Berg Form',
    clientEmail: 'admin@studiobergform.se',
    clientPhone: '+46709876543',
    orgNumber: '556123-4567',
    outgoingVat: 12,
    createdDate: '2026-05-10',
    endingDate: '2026-06-10',
    attachmentPath: 'mock-uploads/ekonomioversikt-q2.xlsx',
    createdAt: '2026-05-10T09:15:00.000Z',
    updatedAt: null,
  },
];

export const MOCK_DASHBOARD_WIDGETS: WidgetInterface[] = [
  {
    title: 'Fakturor',
    description: '15 aktiva kundfakturor just nu',
    icon: 'pi pi-file-edit',
  },
  {
    title: 'Kostnader',
    description: '4 nya registrerade kostnader denna manad',
    icon: 'pi pi-money-bill',
  },
  {
    title: 'Ingaende moms',
    description: '12 400 SEK att redovisa',
    icon: 'pi pi-arrow-down',
  },
  {
    title: 'Utgaende moms',
    description: '28 100 SEK baserat pa mockfakturor',
    icon: 'pi pi-arrow-up',
  },
  {
    title: 'Arets resultat',
    description: 'Stabil uppgang jamfort med forra kvartalet',
    icon: 'pi pi-chart-line',
  },
  {
    title: 'Intakter innevarande ar',
    description: '402 000 SEK i mockad omsattning',
    icon: 'pi pi-plus-circle',
  },
  {
    title: 'Kostnader innevarande ar',
    description: '188 000 SEK i mockade utgifter',
    icon: 'pi pi-minus-circle',
  },
];
