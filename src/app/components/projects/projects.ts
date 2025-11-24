import { Component, input, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, ChangeDetectionStrategy, inject, viewChild, viewChildren } from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-projects',
  imports: [SectionWrapper, RichTextPipe, NgOptimizedImage],
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects implements AfterViewInit, OnDestroy {
  private platformId = inject<Object>(PLATFORM_ID);

  blok = input.required<any>();

  readonly wrapper = viewChild.required('projectsWrapper', { read: ElementRef });
  readonly title = viewChild.required<ElementRef<HTMLHeadingElement>>('projectsTitle');
  readonly projectCards = viewChildren<ElementRef<HTMLElement>>('projectCard');

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = this.wrapper();
    const title = this.title();
    const projectCards = this.projectCards();
    if (!wrapper?.nativeElement || !title?.nativeElement || projectCards.length === 0) {
      return;
    }

    gsap.to(title.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: wrapper.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    projectCards.forEach(cardRef => {
      const cardEl = cardRef.nativeElement;

      const tween = gsap.to(cardEl, {
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'power4 .inOut',
        scrollTrigger: {
          trigger: cardEl,
          start: 'top 90%',
          end: 'top 40%',
          scrub: true,
        }
      });

      if (tween.scrollTrigger) {
        this.triggers.push(tween.scrollTrigger);
      }
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.triggers.forEach(trigger => trigger.kill());
      const title = this.title();
      if (title?.nativeElement) {
        gsap.getTweensOf(title.nativeElement).forEach(tween => {
          tween.kill();
        });
      }
    }
  }
}
