import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { ToastComponent, ToastVariant } from './Toast.component'

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [ToastComponent],
  template: '<c-toast>Changes saved</c-toast>',
})
class HostComponent {}

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [ToastComponent],
  template:
    '<c-toast id="toast-host" aria-label="Saved changes" role="status" aria-live="polite">Changes saved</c-toast>',
})
class AccessibleHostComponent {}

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [ToastComponent],
  template: '<c-toast open>Changes saved</c-toast>',
})
class OpenAttrHostComponent {}

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [ToastComponent],
  template: '<c-toast [attr.data-test]="dataTest">Changes saved</c-toast>',
})
class DynamicAttrHostComponent {
  dataTest: string | undefined = undefined
}

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [ToastComponent],
  template:
    '<c-toast id="keep-me" title="host only" tabindex="-1" data-test="forwarded">Changes saved</c-toast>',
})
class AllowlistHostComponent {}

@Component({
  selector: 'test-host',
  standalone: true,
  imports: [ToastComponent],
  template: '<c-toast data-variant="nonsense">Changes saved</c-toast>',
})
class VariantAttrHostComponent {}

/**
 * jsdom does not implement `showModal`/`close` on HTMLDialogElement,
 * so the Toast tests install local mocks: `showModal` flips `open`
 * to true, `close` flips it back and dispatches the native `close`
 * event (mimicking browser behavior).
 */
function installDialogMocks() {
  const prototype = HTMLDialogElement.prototype
  const originalShow = Object.getOwnPropertyDescriptor(prototype, 'showModal')
  const originalClose = Object.getOwnPropertyDescriptor(prototype, 'close')

  const showModal = vi.fn().mockImplementation(function (this: HTMLDialogElement) {
    this.open = true
  })
  const close = vi.fn().mockImplementation(function (this: HTMLDialogElement) {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event('close'))
  })

  Object.defineProperty(prototype, 'showModal', { value: showModal, configurable: true })
  Object.defineProperty(prototype, 'close', { value: close, configurable: true })

  return {
    showModal,
    close,
    restore() {
      if (originalShow) {
        Object.defineProperty(prototype, 'showModal', originalShow)
      } else {
        Reflect.deleteProperty(prototype, 'showModal')
      }
      if (originalClose) {
        Object.defineProperty(prototype, 'close', originalClose)
      } else {
        Reflect.deleteProperty(prototype, 'close')
      }
    },
  }
}

describe('Toast', () => {
  let mocks: ReturnType<typeof installDialogMocks>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToastComponent] }).compileComponents()
    mocks = installDialogMocks()
  })

  afterEach(() => {
    mocks.restore()
    vi.useRealTimers()
  })

  function render(
    props: {
      variant?: ToastVariant
      autoCloseSeconds?: number
      role?: 'status' | 'alert'
      ariaLabel?: string
    } = {},
  ) {
    const fixture = TestBed.createComponent(ToastComponent)
    if (props.variant !== undefined) fixture.componentRef.setInput('variant', props.variant)
    if (props.autoCloseSeconds !== undefined) {
      fixture.componentRef.setInput('autoCloseSeconds', props.autoCloseSeconds)
    }
    if (props.role !== undefined) fixture.componentRef.setInput('role', props.role)
    if (props.ariaLabel !== undefined) fixture.componentRef.setInput('ariaLabel', props.ariaLabel)
    fixture.detectChanges()
    return fixture
  }

  function dialog(fixture: { nativeElement: HTMLElement }): HTMLDialogElement {
    return fixture.nativeElement.querySelector('dialog') as HTMLDialogElement
  }

  it('renders a native dialog with projected content', () => {
    const fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('dialog')).not.toBeNull()
    expect(dialog(fixture).textContent).toContain('Changes saved')
  })

  it('opens with showModal after init', () => {
    const fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    expect(mocks.showModal).toHaveBeenCalledTimes(1)
    expect(dialog(fixture).open).toBe(true)
  })

  it('does not throw when showModal runs twice (change detection cycles)', () => {
    const fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
    fixture.detectChanges()
    expect(mocks.showModal).toHaveBeenCalledTimes(1)
  })

  it('applies the c-toast class to the dialog', () => {
    const fixture = render()
    expect(dialog(fixture).classList).toContain('c-toast')
  })

  it('defaults to the info variant with its icon', () => {
    const fixture = render()
    expect(dialog(fixture).getAttribute('data-variant')).toBe('info')
    expect(dialog(fixture).querySelector('svg[data-icon="info"]')).not.toBeNull()
  })

  it.each([
    ['success', 'success'],
    ['error', 'error'],
    ['warning', 'warning'],
  ] as const)('renders the %s variant icon', (variant, iconName) => {
    const fixture = render({ variant })
    expect(dialog(fixture).getAttribute('data-variant')).toBe(variant)
    expect(dialog(fixture).querySelector(`svg[data-icon="${iconName}"]`)).not.toBeNull()
  })

  it('renders an accessible close button that closes the dialog and emits close', () => {
    const fixture = render()
    const closeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Close toast"]',
    ) as HTMLButtonElement
    expect(closeButton).not.toBeNull()

    const emitted: Event[] = []
    fixture.componentInstance.close.subscribe((e) => emitted.push(e))

    closeButton.click()
    fixture.detectChanges()
    expect(mocks.close).toHaveBeenCalledTimes(1)
    expect(emitted).toHaveLength(1)
  })

  it('auto-closes after the configured number of seconds', async () => {
    vi.useFakeTimers()
    const fixture = render({ autoCloseSeconds: 2 })
    expect(mocks.close).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1000)
    expect(mocks.close).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1000)
    expect(mocks.close).toHaveBeenCalledTimes(1)
    fixture.destroy()
  })

  it('clears the auto-close timer on destroy', async () => {
    vi.useFakeTimers()
    const fixture = render({ autoCloseSeconds: 2 })
    fixture.destroy()
    await vi.advanceTimersByTimeAsync(5000)
    expect(mocks.close).not.toHaveBeenCalled()
  })

  it('clears the pending timer after manual dismissal (no double close)', async () => {
    vi.useFakeTimers()
    const fixture = render({ autoCloseSeconds: 1 })
    const emitted: Event[] = []
    fixture.componentInstance.close.subscribe((e) => emitted.push(e))

    fixture.nativeElement.querySelector('button[aria-label="Close toast"]').click()
    fixture.detectChanges()
    expect(mocks.close).toHaveBeenCalledTimes(1)
    expect(emitted).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(10_000)
    expect(mocks.close).toHaveBeenCalledTimes(1)
    expect(emitted).toHaveLength(1)
    fixture.destroy()
  })

  it('does not schedule auto-close when autoCloseSeconds is 0', async () => {
    vi.useFakeTimers()
    const fixture = render({ autoCloseSeconds: 0 })
    await vi.advanceTimersByTimeAsync(60_000)
    expect(mocks.close).not.toHaveBeenCalled()
    fixture.destroy()
  })

  it('does not schedule auto-close when autoCloseSeconds is negative', async () => {
    vi.useFakeTimers()
    const fixture = render({ autoCloseSeconds: -3 })
    await vi.advanceTimersByTimeAsync(60_000)
    expect(mocks.close).not.toHaveBeenCalled()
    fixture.destroy()
  })

  it('reschedules auto-close when autoCloseSeconds changes from 0 to a positive value', async () => {
    vi.useFakeTimers()
    const fixture = render({ autoCloseSeconds: 0 })
    await vi.advanceTimersByTimeAsync(10_000)
    expect(mocks.close).not.toHaveBeenCalled()

    fixture.componentRef.setInput('autoCloseSeconds', 1)
    fixture.detectChanges()
    await vi.advanceTimersByTimeAsync(999)
    expect(mocks.close).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(mocks.close).toHaveBeenCalledTimes(1)
    fixture.destroy()
  })

  it('clears the pending auto-close timer when autoCloseSeconds changes to 0', async () => {
    vi.useFakeTimers()
    const fixture = render({ autoCloseSeconds: 2 })
    fixture.componentRef.setInput('autoCloseSeconds', 0)
    fixture.detectChanges()

    await vi.advanceTimersByTimeAsync(60_000)
    expect(mocks.close).not.toHaveBeenCalled()
    fixture.destroy()
  })

  it('emits close once and clears the timer when dismissed via the Escape/native cancel path', async () => {
    vi.useFakeTimers()
    const fixture = render({ autoCloseSeconds: 5 })
    const emitted: Event[] = []
    fixture.componentInstance.close.subscribe((e) => emitted.push(e))
    const dialogEl = dialog(fixture)

    // Native Escape flow: the browser dispatches `cancel`, then closes the
    // dialog (which fires `close`). jsdom implements neither, so both steps
    // are simulated with native dispatch + close().
    dialogEl.dispatchEvent(new Event('cancel'))
    dialogEl.close()

    expect(emitted).toHaveLength(1)

    await vi.advanceTimersByTimeAsync(60_000)
    expect(emitted).toHaveLength(1)
    fixture.destroy()
  })

  it('does not forward the host `open` attribute (dialog stays managed by showModal)', () => {
    const fixture = TestBed.createComponent(OpenAttrHostComponent)
    fixture.detectChanges()
    // Regression: an inherited `open` used to render the dialog already
    // open, making `showModal()` throw InvalidStateError on mount.
    expect(mocks.showModal).toHaveBeenCalledTimes(1)
    expect(dialog(fixture).open).toBe(true)
  })

  it('forwards allowlisted dialog attributes and consumes them from the host', () => {
    const fixture = TestBed.createComponent(AccessibleHostComponent)
    fixture.detectChanges()
    const hostEl = fixture.nativeElement.querySelector('c-toast') as HTMLElement
    const dialogEl = dialog(fixture)
    // Forwarded to the dialog…
    expect(dialogEl.getAttribute('aria-label')).toBe('Saved changes')
    expect(dialogEl.getAttribute('aria-live')).toBe('polite')
    // …and consumed: the host no longer exposes them.
    expect(hostEl.getAttribute('aria-label')).toBeNull()
    expect(hostEl.getAttribute('aria-live')).toBeNull()
    expect(hostEl.hasAttribute('role')).toBe(false)
  })

  it('defaults the dialog role to status (polite live region)', () => {
    const fixture = render()
    expect(dialog(fixture).getAttribute('role')).toBe('status')
  })

  it('reflects the role input on the dialog', () => {
    const fixture = render({ role: 'alert' })
    expect(dialog(fixture).getAttribute('role')).toBe('alert')
  })

  it('reflects the ariaLabel input on the dialog', () => {
    const fixture = render({ ariaLabel: 'Changes saved' })
    expect(dialog(fixture).getAttribute('aria-label')).toBe('Changes saved')
  })

  it('updates the dialog aria-label when the ariaLabel input changes', () => {
    const fixture = render({ ariaLabel: 'Initial name' })
    expect(dialog(fixture).getAttribute('aria-label')).toBe('Initial name')
    fixture.componentRef.setInput('ariaLabel', 'Renamed')
    fixture.detectChanges()
    expect(dialog(fixture).getAttribute('aria-label')).toBe('Renamed')
  })

  it('never forwards the host id — the dialog gets no duplicate id', () => {
    const fixture = TestBed.createComponent(AccessibleHostComponent)
    fixture.detectChanges()
    const hostEl = fixture.nativeElement.querySelector('c-toast') as HTMLElement
    expect(hostEl.id).toBe('toast-host')
    expect(dialog(fixture).id).toBe('')
  })

  it('only forwards allowlisted attributes (id / class / title stay on the host)', () => {
    const fixture = TestBed.createComponent(AllowlistHostComponent)
    fixture.detectChanges()
    const hostEl = fixture.nativeElement.querySelector('c-toast') as HTMLElement
    const dialogEl = dialog(fixture)
    expect(dialogEl.getAttribute('data-test')).toBe('forwarded')
    expect(dialogEl.getAttribute('tabindex')).toBe('-1')
    expect(dialogEl.getAttribute('title')).toBeNull()
    expect(dialogEl.id).toBe('')
    expect(hostEl.id).toBe('keep-me')
    expect(hostEl.getAttribute('title')).toBe('host only')
    // tabindex is consumed along with the other forwarded attributes.
    expect(hostEl.getAttribute('tabindex')).toBeNull()
  })

  it('ignores a consumer data-variant (component owns the variant attribute)', () => {
    const fixture = TestBed.createComponent(VariantAttrHostComponent)
    fixture.detectChanges()
    expect(dialog(fixture).getAttribute('data-variant')).toBe('info')
  })

  it('forwards attribute changes from the host to the dialog after init', async () => {
    const fixture = TestBed.createComponent(DynamicAttrHostComponent)
    fixture.detectChanges()
    const hostEl = fixture.nativeElement.querySelector('c-toast') as HTMLElement
    const dialogEl = dialog(fixture)

    expect(dialogEl.getAttribute('data-test')).toBeNull()

    fixture.componentInstance.dataTest = 'late'
    fixture.detectChanges()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(dialogEl.getAttribute('data-test')).toBe('late')
    // Runtime host changes are mirrored, not consumed (consuming would
    // desync Angular's binding bookkeeping).
    expect(hostEl.getAttribute('data-test')).toBe('late')

    fixture.componentInstance.dataTest = 'again'
    fixture.detectChanges()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(dialogEl.getAttribute('data-test')).toBe('again')

    // Clearing the host binding removes the forwarded attribute too.
    fixture.componentInstance.dataTest = undefined
    fixture.detectChanges()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(dialogEl.getAttribute('data-test')).toBeNull()
  })
})
