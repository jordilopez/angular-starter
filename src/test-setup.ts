import '@angular/compiler'
import '@analogjs/vitest-angular/setup-zone'

import { getTestBed } from '@angular/core/testing'
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing'

/**
 * Vitest + jsdom test bootstrap: initializes the Angular TestBed
 * environment for `@angular/platform-browser`-based component tests.
 */
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting())
