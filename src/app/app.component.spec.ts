import { describe, it, expect, beforeEach } from 'vitest'
import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents()
  })

  it('renders the h1 containing Angular Starter', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const h1 = fixture.nativeElement.querySelector('h1')
    expect(h1.textContent).toContain('Angular Starter')
  })

  it('renders two c-button elements', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelectorAll('button.c-button').length).toBe(2)
  })
})
