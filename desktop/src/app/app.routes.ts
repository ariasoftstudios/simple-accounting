import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { Dashboard } from './routes/dashboard/dashboard';
import { LoginComponent } from './routes/login/login';
import { authGuard } from './guards/auth-guard';
import { loginGuard } from './guards/login-guard';
import {  InvoicesComponent } from './routes/invoices/invoices';
// Placeholder components for each route

@Component({
  selector: 'app-expenses',
  standalone: true,
  template:
    '<div class="p-6"><h1 class="text-2xl font-bold">Kostnader</h1><p>Expenses content coming soon...</p></div>',
})
export class ExpensesComponent {}

@Component({
  selector: 'app-summary',
  standalone: true,
  template:
    '<div class="p-6"><h1 class="text-2xl font-bold">Sammanställning</h1><p>Summary content coming soon...</p></div>',
})
export class SummaryComponent {}

@Component({
  selector: 'app-reports',
  standalone: true,
  template:
    '<div class="p-6"><h1 class="text-2xl font-bold">Rapporter</h1><p>Reports content coming soon...</p></div>',
})
export class ReportsComponent {}

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    data: { pageName: 'Dashboard' },
  },
  {
    path: 'intakter',
    component: InvoicesComponent,
    canActivate: [authGuard],
    data: { pageName: 'Intäkter' },
  },
  {
    path: 'kostnader',
    component: ExpensesComponent,
    canActivate: [authGuard],
    data: { pageName: 'Kostnader' },
  },
  {
    path: 'sammanstallning',
    component: SummaryComponent,
    canActivate: [authGuard],
    data: { pageName: 'Sammanställning' },
  },
  {
    path: 'rapporter',
    component: ReportsComponent,
    canActivate: [authGuard],
    data: { pageName: 'Rapporter' },
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
