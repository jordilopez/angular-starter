import { Component, input } from '@angular/core'

@Component({
  selector: 'l-page',
  standalone: true,
  templateUrl: './Page.component.html',
  styleUrl: './Page.component.css',
})
/**
 * Layout component for page-level structure.
 *
 * Renders an optional `<header>` (title / subtitle), a `<main>` content
 * area with `centered` and `narrow` modes, and an optional `<footer>`.
 */
export class PageComponent {
  /** Page-level heading rendered inside `<h1>`. */
  readonly title = input<string>()
  /** Smaller description rendered below the title. */
  readonly subtitle = input<string>()
  /** When `true`, vertically centres the main content area. */
  readonly centered = input(false)
  /** When `true`, constrains the main content to 720 px. */
  readonly narrow = input(false)
}
