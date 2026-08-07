import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'

/**
 * Application-wide providers for the standalone bootstrap.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
}
