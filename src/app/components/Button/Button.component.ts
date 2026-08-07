import { Component, input, output } from '@angular/core'

@Component({
  selector: 'c-button',
  standalone: true,
  templateUrl: './Button.component.html',
})
export class ButtonComponent {
  /** Visible label text inside the button. */
  readonly label = input<string>()
  /** When `true`, prevents interaction and dims the button. */
  readonly disabled = input(false)
  /** Fired on click when `disabled` is `false`. */
  // Output intentionally named `click` for Vue parity (CButton emits `click`).
  // eslint-disable-next-line @angular-eslint/no-output-native
  readonly click = output<void>()

  onClick(): void {
    if (!this.disabled()) {
      this.click.emit()
    }
  }
}
