import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import gsap from 'gsap';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RichTextPipe],
  templateUrl: './footer.html'
})
export class Footer implements AfterViewInit {
  @Input() blok: any;
  @ViewChild('content') contentEl!: ElementRef<HTMLDivElement>;

  expanded = false;
  contentHeight = 0;

  ngAfterViewInit() {
    this.contentHeight = this.contentEl.nativeElement.scrollHeight;
  }

  toggle() {
    const el = this.contentEl.nativeElement;
    const fullHeight = el.scrollHeight;

    if (!this.expanded) {
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

    this.expanded = !this.expanded;
  }
}
