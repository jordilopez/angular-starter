import { Component, computed, input } from '@angular/core'

/** Callout tone. Drives the `.callout--<tone>` modifier and accent icon. */
export type CalloutTone = 'info' | 'success' | 'warning' | 'error'

/** Icon identifiers rendered inside the callout (one per tone). */
export type CalloutIconName = 'info' | 'success' | 'warning' | 'error'

/**
 * Exhaustive tone → icon-name mapping (mirrors `Toast`'s `getToastIcon`).
 *
 * The `never` guard makes the compiler fail the build whenever a
 * `CalloutTone` is added without a matching case here.
 */
export function getCalloutIcon(tone: CalloutTone): CalloutIconName {
  switch (tone) {
    case 'info':
      return 'info'
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}

/**
 * Headless advisory block styled by `css-starter`'s `.callout` component.
 *
 * No local styles — the visual comes from css-starter (border, tint, radius);
 * the `tone` modifier + accent icon follow the `tone` input. The icon is
 * component-owned (inline Lucide path per tone, like `Toast`); the glyph is
 * rendered here so css-starter stays free of any icon dependency. A polite
 * live region by default (`role="status"`); set `role="alert"` for assertive
 * errors. Optional `title` renders a `.callout__title`; projected content is
 * the `.callout__body`.
 */
@Component({
  selector: 'c-callout',
  standalone: true,
  templateUrl: './Callout.component.html',
})
export class CalloutComponent {
  /** Visual tone. Defaults to `'info'`. */
  readonly tone = input<CalloutTone>('info')
  /**
   * ARIA role. `status` (default) exposes a polite live region; use `alert`
   * for assertive errors.
   */
  readonly role = input<'status' | 'alert'>('status')
  /** Optional bold title row. Omit (and it won't render). */
  readonly title = input<string>()

  /** Icon name for the current tone (exhaustively mapped). */
  readonly icon = computed(() => getCalloutIcon(this.tone()))
}
