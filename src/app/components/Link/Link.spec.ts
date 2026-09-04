import { describe, it, expect, beforeEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { LinkComponent } from './Link.component'

@Component({
  selector: 'host',
  standalone: true,
  imports: [LinkComponent],
  template: '<c-link href="https://example.com"><strong>Go</strong></c-link>',
})
class HostComponent {}

describe('Link', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkComponent, HostComponent],
    }).compileComponents()
  })

  function render(
    props: {
      href?: string
      label?: string
      disabled?: boolean
      target?: string
      rel?: string
      openInNewTab?: boolean
    } = {},
  ) {
    const fixture = TestBed.createComponent(LinkComponent)
    fixture.componentRef.setInput('href', props.href ?? 'https://example.com')
    if (props.label !== undefined) fixture.componentRef.setInput('label', props.label)
    if (props.disabled !== undefined) fixture.componentRef.setInput('disabled', props.disabled)
    if (props.target !== undefined) fixture.componentRef.setInput('target', props.target)
    if (props.rel !== undefined) fixture.componentRef.setInput('rel', props.rel)
    if (props.openInNewTab !== undefined)
      fixture.componentRef.setInput('openInNewTab', props.openInNewTab)
    fixture.detectChanges()
    return fixture
  }

  function anchor(fixture: ReturnType<typeof render>): HTMLAnchorElement {
    return fixture.nativeElement.querySelector('a') as HTMLAnchorElement
  }

  it('renders the label', () => {
    expect(anchor(render({ label: 'Submit' })).textContent).toContain('Submit')
  })

  it('renders projected content', () => {
    const fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('strong').textContent).toBe('Go')
  })

  it('applies the c-link class', () => {
    expect(anchor(render({ label: 'Go' })).classList).toContain('c-link')
  })

  it('sets the href attribute', () => {
    expect(anchor(render({ href: '/docs', label: 'Go' })).getAttribute('href')).toBe('/docs')
  })

  it('emits click on click', () => {
    const fixture = render({ href: '#section', label: 'Go' })
    let clicked = 0
    fixture.componentInstance.click.subscribe(() => clicked++)
    anchor(fixture).click()
    expect(clicked).toBe(1)
  })

  it('does not emit click when disabled', () => {
    const fixture = render({ href: '#section', label: 'Go', disabled: true })
    let clicked = 0
    fixture.componentInstance.click.subscribe(() => clicked++)
    anchor(fixture).click()
    expect(clicked).toBe(0)
  })

  it('omits the href attribute when disabled', () => {
    expect(anchor(render({ label: 'Go', disabled: true })).getAttribute('href')).toBeNull()
  })

  it('sets aria-disabled when disabled', () => {
    expect(anchor(render({ label: 'Go', disabled: true })).getAttribute('aria-disabled')).toBe(
      'true',
    )
  })

  it('omits aria-disabled when not disabled', () => {
    expect(anchor(render({ label: 'Go' })).getAttribute('aria-disabled')).toBeNull()
  })

  it('opens in a new tab with noopener noreferrer rel', () => {
    const a = anchor(render({ label: 'Go', openInNewTab: true }))
    expect(a.getAttribute('target')).toBe('_blank')
    expect(a.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('auto-adds rel when target is _blank and merges existing rel', () => {
    const a = anchor(render({ label: 'Go', target: '_blank', rel: 'nofollow' }))
    expect(a.getAttribute('rel')).toBe('noopener noreferrer nofollow')
  })

  it('prevents default navigation when disabled', () => {
    const a = anchor(render({ label: 'Go', disabled: true }))
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    a.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('does not propagate clicks to ancestors when disabled', () => {
    const fixture = render({ label: 'Go', disabled: true })
    let bubbled = 0
    fixture.nativeElement.addEventListener('click', () => bubbled++)
    anchor(fixture).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(bubbled).toBe(0)
  })

  it('still propagates clicks to ancestors when enabled', () => {
    const fixture = render({ label: 'Go', href: '#section' })
    let bubbled = 0
    fixture.nativeElement.addEventListener('click', () => bubbled++)
    anchor(fixture).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(bubbled).toBe(1)
  })

  it('treats target "_BLANK" like "_blank" for rel protection', () => {
    const a = anchor(render({ label: 'Go', target: '_BLANK' }))
    expect(a.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
