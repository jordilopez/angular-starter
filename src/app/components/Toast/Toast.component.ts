import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core'

/** Toast severity variants. Drives the accent icon and colouring. */
export type ToastVariant = 'info' | 'success' | 'error' | 'warning'

/** Icon identifiers rendered inside the toast (variant icon + close). */
export type ToastIconName = 'info' | 'success' | 'error' | 'warning'

/**
 * Exhaustive variant → icon-name mapping.
 *
 * The `never` guard makes the compiler fail the build whenever a
 * `ToastVariant` is added without a matching case here.
 */
export function getToastIcon(variant: ToastVariant): ToastIconName {
  switch (variant) {
    case 'info':
      return 'info'
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    default: {
      // Exhaustiveness guard: compiles only when every variant is handled.
      const _exhaustive: never = variant
      return _exhaustive
    }
  }
}

/**
 * Headless toast component backed by the native `<dialog>` element.
 *
 * Opens with `showModal()` after view init (the rest of the page becomes
 * inert while the toast is visible — intentional modal behavior) and
 * auto-dismisses after `autoCloseSeconds` (default 5; `0` or a non-finite
 * value disables auto-close; the value is reactive). An accessible close
 * button dismisses it early. The visual comes from the co-located
 * `Toast.component.css` (token-driven); `.c-toast` is applied as an
 * unscoped design-system hook. Native dialog attributes (`aria-*`,
 * `role`, `id`, …) are forwarded from the host to the `<dialog>` —
 * except `open`, `variant`, `autoCloseSeconds`, `data-variant` and
 * `class`, which the component owns. Reopen by re-mounting.
 *
 * The native `close` event is the single path to cleanup: the close
 * button, the Escape key (cancel → close) and the auto-close timer all
 * funnel through `dialog.close()`, and the `close` output reflects the
 * native event.
 *
 * **Accessibility ownership — the `<dialog>` is the single owner.**
 * Dialog semantics come from the `role` (default `status`, a polite live
 * region; use `alert` for errors) and `ariaLabel` inputs. Additional
 * dialog attributes are forwarded from the host element via an explicit
 * allowlist — `aria-*` (except `aria-label`, owned by the `ariaLabel`
 * input), `data-*` (except the component-owned `data-variant`), `role`
 * and `tabindex`. Attributes present at init are consumed: removed from
 * the host so semantics are never exposed on both elements; later host
 * changes are mirrored without consumption. `id`, `class` and
 * implementation attributes (`ng-*`, `_nghost-*`, `_ngcontent-*`) are
 * never forwarded — the host keeps its own `id` and the dialog carries
 * none.
 *
 * The native `close` event is the single path to cleanup: the close
 * button, the Escape key (cancel → close) and the auto-close timer all
 * funnel through `dialog.close()`, and the `close` output reflects the
 * native event.
 *
 * **Accessibility — required:** the dialog must be given an accessible
 * name by the consumer, because its content is arbitrary projected text.
 * Pass `ariaLabel` (or forward `aria-labelledby` pointing at visible
 * text):
 *
 * ```html
 * <c-toast variant="success" ariaLabel="Changes saved">Changes saved</c-toast>
 * <c-toast variant="error" role="alert" [autoCloseSeconds]="0" ariaLabel="Error">Something went wrong</c-toast>
 * ```
 */
@Component({
  selector: 'c-toast',
  standalone: true,
  templateUrl: './Toast.component.html',
  styleUrl: './Toast.component.css',
})
export class ToastComponent implements AfterViewInit {
  /** Visual severity. Defaults to `'info'`. */
  readonly variant = input<ToastVariant>('info')
  /** Seconds before the toast auto-dismisses. `0` disables auto-close. */
  readonly autoCloseSeconds = input(5)
  /**
   * ARIA role for the dialog. `status` (the default) exposes the toast
   * as a polite live region; `alert` makes it assertive (use for errors).
   */
  readonly role = input<'status' | 'alert'>('status')
  /**
   * Accessible name for the dialog, forwarded as `aria-label`. Required
   * for accessibility unless an `aria-labelledby` target is forwarded.
   */
  readonly ariaLabel = input<string>()
  /** Fired when the toast closes (close button, Escape, or auto-dismiss). */
  // Output intentionally named `close` for Vue parity (CToast emits `close`).
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly close = output<Event>()

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly destroyRef = inject(DestroyRef)
  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialog')

  /** Icon for the current variant (exhaustively mapped). */
  readonly icon = computed(() => getToastIcon(this.variant()))

  private timer?: ReturnType<typeof setTimeout>
  private observer?: MutationObserver

  constructor() {
    // Auto-close scheduling. The first run restarts the timer armed in
    // `ngAfterViewInit` (a no-op with the same value); subsequent runs
    // pick up runtime changes to `autoCloseSeconds`.
    effect(() => {
      const seconds = this.autoCloseSeconds()
      const dialog = this.dialogRef()?.nativeElement
      if (!dialog) return
      this.scheduleAutoClose(dialog, seconds)
    })

    this.destroyRef.onDestroy(() => {
      this.clearTimer()
      this.observer?.disconnect()
    })
  }

  ngAfterViewInit(): void {
    const dialog = this.dialogRef()?.nativeElement
    if (!dialog) return

    this.syncForwardedAttributes(dialog)
    if (!dialog.open) {
      dialog.showModal()
    }
    this.observeForwardedAttributes(dialog)
    this.scheduleAutoClose(dialog, this.autoCloseSeconds())
  }

  /**
   * Native `close` event: the single source of truth. Clears the pending
   * auto-close timer, then notifies consumers.
   */
  onDialogClose(event: Event): void {
    this.clearTimer()
    this.close.emit(event)
  }

  /** Close button: closes the dialog; the native event does the rest. */
  onCloseClick(): void {
    this.dialogRef()?.nativeElement.close()
  }

  private clearTimer(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }

  /** (Re)schedule auto-dismiss; a value of `0` (or non-finite) disables it. */
  private scheduleAutoClose(dialog: HTMLDialogElement, seconds: number): void {
    this.clearTimer()
    if (seconds > 0 && Number.isFinite(seconds)) {
      this.timer = setTimeout(() => {
        dialog.close()
      }, seconds * 1000)
    }
  }

  /**
   * Explicit allowlist of host attributes forwarded to the dialog:
   * `tabindex`, `role`, `aria-*` and `data-*` (minus the component-owned
   * `data-variant`). Input-owned and implementation attributes (`id`,
   * `class`, `style`, `ng-*`, `_nghost-*`, `_ngcontent-*`, …) never match.
   */
  private isForwardedAttribute(name: string): boolean {
    const attr = name.toLowerCase()
    if (attr === 'tabindex' || attr === 'role') return true
    if (attr.startsWith('aria-') || attr.startsWith('data-')) {
      return attr !== 'data-variant'
    }
    return false
  }

  /**
   * One-time copy of allowlisted host attributes onto the dialog. Each
   * forwarded attribute is consumed (removed from the host) so dialog
   * semantics live in exactly one place. Host-written `role` and
   * `aria-label` attributes natively feed the same-named inputs, so the
   * forwarded copy always agrees with the input binding.
   *
   * This runs before the observer starts, so the removals produce no
   * mutation records. Only later Angular-driven changes are mirrored
   * (without consumption — see `observeForwardedAttributes`).
   */
  private syncForwardedAttributes(dialog: HTMLDialogElement): void {
    for (const attr of Array.from(this.host.nativeElement.attributes)) {
      if (!this.isForwardedAttribute(attr.name)) continue
      dialog.setAttribute(attr.name, attr.value)
      this.host.nativeElement.removeAttribute(attr.name)
    }
  }

  /**
   * Mirror allowlisted host attribute changes onto the dialog for the
   * component's lifetime. Host attributes are mirrored, not consumed:
   * consuming would desync Angular's binding bookkeeping (a later
   * `null` write lands on an already-removed attribute and produces no
   * mutation record, leaving a stale value on the dialog).
   */
  private observeForwardedAttributes(dialog: HTMLDialogElement): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const name = (mutation.attributeName ?? '').toLowerCase()
        if (!this.isForwardedAttribute(name)) continue
        const value = this.host.nativeElement.getAttribute(name)
        if (value === null) {
          dialog.removeAttribute(name)
        } else {
          dialog.setAttribute(name, value)
        }
      }
    })
    this.observer.observe(this.host.nativeElement, { attributes: true })
  }
}
