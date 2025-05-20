import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { headersInterceptor } from './core/interceptors/headers/headers.interceptor';
import { errorsInterceptor } from './core/interceptors/errors/errors.interceptor';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), // required animations providers
  provideToastr(), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),
  provideAnimationsAsync(), provideHttpClient(withFetch(), withInterceptors([headersInterceptor, errorsInterceptor, loadingInterceptor])),
  providePrimeNG({
    theme: {
      preset: Aura
    }
  }), importProvidersFrom(NgxSpinnerModule)
  ]
};
