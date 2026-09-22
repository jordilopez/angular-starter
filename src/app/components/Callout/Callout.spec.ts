import { describe, it, expect, beforeEach } from 'vitest'
import { TestBed } from '@angular/core/testing'
import { CalloutComponent } from './Callout.component'

describe('Callout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalloutComponent],
    }).compileComponents()
  })

  function render(
    props: {
      tone?: 'info' | 'success' | 'warning' | 'error'
      role?: 'status' | 'alert'
      title?: string
    } = {},
  ) {
    const fixture = TestBed.createComponent(CalloutComponent)
    if (props.tone !== undefined) fixture.componentRef.setInput('tone', props.tone)
    if (props.role !== undefined) fixture.componentRef.setInput('role', props.role)
    if (props.title !== undefined) fixture.componentRef.setInput('title', props.title)
    fixture.detectChanges()
    return fixture
  }

  it('renders with the default info tone and status role', () => {
    const fixture = render()
    const el = fixture.nativeElement.querySelector('.callout') as HTMLElement
    expect(el.classList).toContain('callout--info')
    expect(el.getAttribute('role')).toBe('status')
  })

  it('applies the tone modifier class', () => {
    const fixture = render({ tone: 'warning', title: 'Careful' })
    const el = fixture.nativeElement.querySelector('.callout') as HTMLElement
    expect(el.classList).toContain('callout--warning')
  })

  it('exposes an assertive role when requested', () => {
    const fixture = render({ tone: 'error', role: 'alert' })
    const el = fixture.nativeElement.querySelector('.callout') as HTMLElement
    expect(el.getAttribute('role')).toBe('alert')
  })

  it('renders the title in .callout__title and a decorative icon', () => {
    const fixture = render({ tone: 'success', title: 'Saved' })
    const title = fixture.nativeElement.querySelector('.callout__title')
    expect(title?.textContent?.trim()).toBe('Saved')
    const icon = fixture.nativeElement.querySelector('.callout__icon') as HTMLElement
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    expect(icon.querySelector('svg')).not.toBeNull()
    expect(icon.querySelector('svg')?.getAttribute('data-icon')).toBe('success')
  })

  it('omits the title when not provided', () => {
    const fixture = render()
    expect(fixture.nativeElement.querySelector('.callout__title')).toBeNull()
  })
})
