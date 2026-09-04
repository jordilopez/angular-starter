import { Component, input, output } from '@angular/core'

@Component({
  selector: 'c-link',
  standalone: true,
  templateUrl: './Link.component.html',
})
/**
 * Headless link component.
 *
 * The default visual comes from `css-starter`'s native anchor styles;
 * `.c-link` is applied as a class hook. New-tab protection merges
 * `noopener noreferrer` (case-insensitive `target` matching), and
 * disabled links swallow activation and propagation.
 */
export class LinkComponent {
  /** Destination URL. Required. */
  readonly href = input.required<string>()
  /**
   * Visible label text inside the link. Rendered additively with projected
   * content (mirrors `Button`); Vue's `Link` uses a true slot fallback
   * instead. Pass either `label` or projected content in practice.
   */
  readonly label = input<string>()
  /** When `true`, prevents navigation and dims the link. */
  readonly disabled = input(false)
  /** Native target, e.g. `'_self' | '_blank'`. */
  readonly target = input<string>()
  /** Native rel. Merged with `noopener noreferrer` when opening in a new tab. */
  readonly rel = input<string>()
  /** When `true`, opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`). */
  readonly openInNewTab = input(false)
  /** Fired on click when `disabled` is `false`. */
  // Output intentionally named `click` for Vue parity (CLink emits `click`).
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly click = output<Event>()

  /** True when the link should open in a new tab. Target is matched
   * case-insensitively so `target="_BLANK"` is protected too. */
  get isNewTab(): boolean {
    return this.openInNewTab() || (this.target() ?? '').toLowerCase() === '_blank'
  }

  /** Resolved `target` — `_blank` when `openInNewTab` is set. */
  get effectiveTarget(): string | undefined {
    return this.openInNewTab() ? '_blank' : this.target()
  }

  /** Resolved `rel` — merged with `noopener noreferrer` for new tabs. */
  get effectiveRel(): string | undefined {
    return this.isNewTab
      ? ['noopener', 'noreferrer', this.rel()].filter(Boolean).join(' ')
      : this.rel()
  }

  onClick(event: Event): void {
    if (this.disabled()) {
      // Suppress activation AND propagation so disabled links never
      // bubble click events to ancestor handlers.
      event.preventDefault()
      event.stopPropagation()
      return
    }
    this.click.emit(event)
  }
}
