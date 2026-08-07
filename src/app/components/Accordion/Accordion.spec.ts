import { describe, it, expect, beforeEach } from 'vitest'
import { TestBed } from '@angular/core/testing'
import { AccordionComponent, AccordionItem } from './Accordion.component'

const items: AccordionItem[] = [
  { title: 'One', content: 'First panel' },
  { title: 'Two', content: 'Second panel' },
]

describe('Accordion', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AccordionComponent] }).compileComponents()
  })

  function render(props: { items?: AccordionItem[]; allowMultiple?: boolean } = {}) {
    const fixture = TestBed.createComponent(AccordionComponent)
    if (props.items !== undefined) fixture.componentRef.setInput('items', props.items)
    if (props.allowMultiple !== undefined)
      fixture.componentRef.setInput('allowMultiple', props.allowMultiple)
    fixture.detectChanges()
    return fixture
  }

  it('renders all item titles', () => {
    const fixture = render({ items })
    const text = fixture.nativeElement.textContent
    expect(text).toContain('One')
    expect(text).toContain('Two')
  })

  it('opens a panel on header click', () => {
    const fixture = render({ items })
    expect(fixture.nativeElement.querySelectorAll('.panel[data-open]').length).toBe(0)

    const header = fixture.nativeElement.querySelectorAll('button.header')[0]
    header.click()
    fixture.detectChanges()

    const openPanels = fixture.nativeElement.querySelectorAll('.panel[data-open]')
    expect(openPanels.length).toBe(1)
    expect(openPanels[0].getAttribute('data-open')).toBe('true')
  })

  it('closes a panel on second click', () => {
    const fixture = render({ items })
    const header = fixture.nativeElement.querySelectorAll('button.header')[0]
    header.click()
    fixture.detectChanges()
    header.click()
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelectorAll('.panel[data-open]').length).toBe(0)
  })

  it('emits updateOpen with open indexes', () => {
    const fixture = render({ items })
    const emitted: number[][] = []
    fixture.componentInstance.updateOpen.subscribe((e) => emitted.push(e))
    fixture.nativeElement.querySelectorAll('button.header')[0].click()
    fixture.detectChanges()
    expect(emitted).toEqual([[0]])
  })

  it('sets aria-expanded on the active header', () => {
    const fixture = render({ items })
    const header = fixture.nativeElement.querySelectorAll('button.header')[0]

    expect(header.getAttribute('aria-expanded')).toBe('false')

    header.click()
    fixture.detectChanges()
    expect(header.getAttribute('aria-expanded')).toBe('true')
  })

  it('links header and body via aria-controls / aria-labelledby', () => {
    const fixture = render({ items })
    const header = fixture.nativeElement.querySelectorAll('button.header')[0]
    const body = fixture.nativeElement.querySelectorAll('[role="region"]')[0]

    expect(header.getAttribute('aria-controls')).toBe(body.getAttribute('id'))
    expect(body.getAttribute('aria-labelledby')).toBe(header.getAttribute('id'))
  })

  it('keeps multiple panels open when allowMultiple is true', () => {
    const fixture = render({ items, allowMultiple: true })
    const headers = fixture.nativeElement.querySelectorAll('button.header')
    headers[0].click()
    fixture.detectChanges()
    headers[1].click()
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelectorAll('.panel[data-open]').length).toBe(2)
  })

  it('replaces the open panel when allowMultiple is false', () => {
    const fixture = render({ items })
    const headers = fixture.nativeElement.querySelectorAll('button.header')
    headers[0].click()
    fixture.detectChanges()
    headers[1].click()
    fixture.detectChanges()

    const openPanels = fixture.nativeElement.querySelectorAll('.panel[data-open]')
    expect(openPanels.length).toBe(1)
    expect(openPanels[0].getAttribute('data-open')).toBe('true')
  })

  it('moves focus to the next header on ArrowDown', () => {
    const fixture = render({ items })
    const headers = fixture.nativeElement.querySelectorAll('button.header')
    headers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    fixture.detectChanges()
    expect(document.activeElement).toBe(headers[1])
  })

  it('moves focus to the first header on Home', () => {
    const fixture = render({ items })
    const headers = fixture.nativeElement.querySelectorAll('button.header')
    headers[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    fixture.detectChanges()
    expect(document.activeElement).toBe(headers[0])
  })

  it('hides collapsed bodies from assistive tech with inert', () => {
    const fixture = render({ items })
    const bodies = fixture.nativeElement.querySelectorAll('[role="region"]')
    expect(bodies[0].hasAttribute('inert')).toBe(true)

    ;(fixture.nativeElement.querySelectorAll('button.header')[0] as HTMLButtonElement).click()
    fixture.detectChanges()
    expect(bodies[0].hasAttribute('inert')).toBe(false)
  })

  it('keeps the active header in the tab order (roving tabindex)', () => {
    const fixture = render({ items })
    const headers = fixture.nativeElement.querySelectorAll('button.header')

    expect(headers[0].getAttribute('tabindex')).toBe('0')
    expect(headers[1].getAttribute('tabindex')).toBe('-1')

    ;(headers[1] as HTMLButtonElement).click()
    fixture.detectChanges()
    expect(headers[0].getAttribute('tabindex')).toBe('-1')
    expect(headers[1].getAttribute('tabindex')).toBe('0')
  })
})
