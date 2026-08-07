import { describe, it, expect, beforeEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { PageComponent } from './Page.component'

@Component({
  selector: 'host',
  standalone: true,
  imports: [PageComponent],
  template: `<l-page [title]="title" [subtitle]="subtitle" [centered]="centered" [narrow]="narrow">
    <p>Hello</p>
    <div slot="footer">© 2026</div>
  </l-page>`,
})
class HostComponent {
  title?: string
  subtitle?: string
  centered = false
  narrow = false
}

describe('Page', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageComponent, HostComponent],
    }).compileComponents()
  })

  function render(
    props: { title?: string; subtitle?: string; centered?: boolean; narrow?: boolean } = {},
  ) {
    const fixture = TestBed.createComponent(HostComponent)
    const host = fixture.componentInstance
    if (props.title !== undefined) host.title = props.title
    if (props.subtitle !== undefined) host.subtitle = props.subtitle
    if (props.centered !== undefined) host.centered = props.centered
    if (props.narrow !== undefined) host.narrow = props.narrow
    fixture.detectChanges()
    return fixture
  }

  it('renders default slot content', () => {
    const fixture = render()
    expect(fixture.nativeElement.querySelector('main').textContent).toContain('Hello')
  })

  it('renders title and subtitle in h1 and header p', () => {
    const fixture = render({ title: 'Home', subtitle: 'Welcome' })
    const h1 = fixture.nativeElement.querySelector('h1.title')
    const sub = fixture.nativeElement.querySelector('header p.subtitle')
    expect(h1.textContent).toBe('Home')
    expect(sub.textContent).toBe('Welcome')
  })

  it('renders the header when title or subtitle is provided', () => {
    const fixture = render({ title: 'Home' })
    expect(fixture.nativeElement.querySelector('header')).toBeTruthy()
  })

  it('renders footer slot content inside the footer', () => {
    const fixture = render()
    const footer = fixture.nativeElement.querySelector('footer')
    expect(footer).toBeTruthy()
    expect(footer.textContent).toContain('© 2026')
  })

  it('applies the centered class to main', () => {
    const fixture = render({ centered: true })
    expect(fixture.nativeElement.querySelector('main').classList).toContain('centered')
  })

  it('applies the narrow class to main', () => {
    const fixture = render({ narrow: true })
    expect(fixture.nativeElement.querySelector('main').classList).toContain('narrow')
  })
})
