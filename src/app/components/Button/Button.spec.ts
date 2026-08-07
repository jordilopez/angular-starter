import { describe, it, expect, beforeEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { ButtonComponent } from './Button.component'

@Component({
  selector: 'host',
  standalone: true,
  imports: [ButtonComponent],
  template: '<c-button><strong>Go</strong></c-button>',
})
class HostComponent {}

describe('Button', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, HostComponent],
    }).compileComponents()
  })

  function render(props: { label?: string; disabled?: boolean } = {}) {
    const fixture = TestBed.createComponent(ButtonComponent)
    if (props.label !== undefined) fixture.componentRef.setInput('label', props.label)
    if (props.disabled !== undefined) fixture.componentRef.setInput('disabled', props.disabled)
    fixture.detectChanges()
    return fixture
  }

  it('renders the label', () => {
    expect(render({ label: 'Submit' }).nativeElement.querySelector('button').textContent).toContain(
      'Submit',
    )
  })

  it('renders projected content', () => {
    const fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('strong').textContent).toBe('Go')
  })

  it('applies the c-button class', () => {
    expect(render({ label: 'Go' }).nativeElement.querySelector('button').classList).toContain(
      'c-button',
    )
  })

  it('emits click on click', () => {
    const fixture = render({ label: 'Go' })
    let clicked = 0
    fixture.componentInstance.click.subscribe(() => clicked++)
    fixture.nativeElement.querySelector('button').click()
    expect(clicked).toBe(1)
  })

  it('does not emit click when disabled', () => {
    const fixture = render({ label: 'Go', disabled: true })
    let clicked = 0
    fixture.componentInstance.click.subscribe(() => clicked++)
    fixture.nativeElement.querySelector('button').click()
    expect(clicked).toBe(0)
  })

  it('sets the disabled attribute when disabled', () => {
    expect(
      render({ label: 'Go', disabled: true }).nativeElement.querySelector('button').disabled,
    ).toBe(true)
  })

  it('omits the disabled attribute when not disabled', () => {
    expect(render({ label: 'Go' }).nativeElement.querySelector('button').disabled).toBe(false)
  })
})
