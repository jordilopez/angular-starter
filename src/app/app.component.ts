import { Component } from '@angular/core'
import { PageComponent } from './components/Page/Page.component'
import { ButtonComponent } from './components/Button/Button.component'
import { LinkComponent } from './components/Link/Link.component'
import { AccordionComponent, AccordionItem } from './components/Accordion/Accordion.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PageComponent, ButtonComponent, LinkComponent, AccordionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
/**
 * Root application component.
 *
 * Composes the `l-page` layout shell with `c-button`, `c-link`, and
 * `c-accordion` samples. Components are headless — their styles come from
 * the shared `css-starter` design system via the `.c-button`/`.c-link`
 * class hooks.
 */
export class AppComponent {
  readonly accordionItems: AccordionItem[] = [
    {
      title: 'What is this?',
      content:
        'An Angular 19 starter with TypeScript, Storybook, and headless components styled by css-starter.',
    },
    {
      title: 'Component pattern',
      content:
        'Components live in folders named after the component, each with .component.ts, .component.html, .component.css, .spec.ts, and .stories.ts files.',
    },
    {
      title: 'Headless styling',
      content:
        'Components carry no local CSS — they apply css-starter classes like .c-button and inherit tokens from the design system.',
    },
  ]

  /** Placeholder action for the hero buttons — wire up navigation or a toast here. */
  handleClick(): void {
    // placeholder — wire up navigation or toast here
  }
}
