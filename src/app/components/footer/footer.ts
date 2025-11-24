import { Component, input, ElementRef, AfterViewInit, signal, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import gsap from 'gsap';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RichTextPipe],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer implements AfterViewInit {
  blok = input.required<any>();
  readonly contentEl = viewChild.required<ElementRef<HTMLDivElement>>('content');

  expanded = signal(false);
  contentHeight = 0;

  ngAfterViewInit() {
    this.contentHeight = this.contentEl().nativeElement.scrollHeight;
  }

  toggle() {
    const el = this.contentEl().nativeElement;
    const fullHeight = el.scrollHeight;

    if (!this.expanded()) {
      gsap.to(el, {
        height: fullHeight,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          el.style.height = 'auto';
        }
      });
    } else {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 16;
      const clampHeight = lineHeight * 2;

      gsap.to(el, {
        height: clampHeight,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    }

    this.expanded.set(!this.expanded());
  }
}
