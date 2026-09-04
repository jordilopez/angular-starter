import { Component, ElementRef, inject, input, output, signal } from '@angular/core'

/** A single collapsible panel inside `c-accordion`. */
export interface AccordionItem {
  /** Header text visible in the collapsed state. */
  title: string
  /** Body content revealed when the panel is open. */
  content: string
}

/**
 * Accessible accordion component.
 *
 * Each panel header is a `<button>` that toggles visibility of its body.
 * Supports single-panel (default) and multi-panel (`allowMultiple`) modes;
 * headers implement a roving tabindex with arrow-key navigation.
 */
@Component({
  selector: 'c-accordion',
  standalone: true,
  templateUrl: './Accordion.component.html',
  styleUrl: './Accordion.component.css',
})
export class AccordionComponent {
  /** Ordered list of panels to render. */
  readonly items = input<AccordionItem[]>([])
  /** When `true`, multiple panels can stay open simultaneously. */
  readonly allowMultiple = input(false)
  /** Fires whenever the set of open indexes changes. */
  readonly updateOpen = output<number[]>()

  private readonly host = inject(ElementRef<HTMLElement>)
  private readonly openIndexes = signal<number[]>([])

  isOpen(index: number): boolean {
    return this.openIndexes().includes(index)
  }

  /**
   * Opens the panel at `index`, closing the currently open panel in
   * single-panel mode. Emits the new open-index list via `updateOpen`.
   */
  toggle(index: number): void {
    if (this.isOpen(index)) {
      this.openIndexes.set(this.openIndexes().filter((i) => i !== index))
    } else if (this.allowMultiple()) {
      this.openIndexes.set([...this.openIndexes(), index])
    } else {
      this.openIndexes.set([index])
    }
    this.updateOpen.emit(this.openIndexes())
  }

  /**
   * Implements the roving-tabindex pattern: the first open header (or the
   * first header when nothing is open) stays in the tab order; the rest are
   * reachable via the arrow-key handlers only.
   */
  headerTabIndex(index: number): number {
    if (this.isOpen(index)) return 0
    const firstOpen = this.openIndexes()[0]
    if (firstOpen === undefined) return index === 0 ? 0 : -1
    return -1
  }

  /**
   * Keyboard handler for the panel headers: ArrowUp/ArrowDown move focus
   * between headers (wrapping), Home/End jump to the first/last header.
   */
  onKeyDown(index: number, event: KeyboardEvent): void {
    const headers = Array.from(
      this.host.nativeElement.querySelectorAll('.header') as NodeListOf<HTMLElement>,
    )
    if (headers.length === 0) return

    let targetIndex = -1
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        targetIndex = index === 0 ? headers.length - 1 : index - 1
        break
      case 'ArrowDown':
        event.preventDefault()
        targetIndex = index === headers.length - 1 ? 0 : index + 1
        break
      case 'Home':
        event.preventDefault()
        targetIndex = 0
        break
      case 'End':
        event.preventDefault()
        targetIndex = headers.length - 1
        break
    }

    if (targetIndex >= 0) {
      headers[targetIndex]?.focus()
    }
  }
}
