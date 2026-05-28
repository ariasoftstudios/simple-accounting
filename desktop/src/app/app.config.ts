import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';

import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptor/auth-interceptor';
import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
// import Nora from '@primeuix/themes/nora';

registerLocaleData(localeSv);
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    providePrimeNG({
      theme: {
        preset: Lara,
      },
      ripple: true,
    }),
  ],
};
