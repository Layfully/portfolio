import {
  Component,
  input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  PLATFORM_ID,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-experience',
  imports: [SectionWrapper],
  templateUrl: './experience.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Experience implements AfterViewInit, OnDestroy {
  blok = input.required<any>();
  @ViewChild('experienceWrapper', { read: ElementRef }) wrapper!: ElementRef<HTMLElement>;
  @ViewChild('experienceTitle') title!: ElementRef<HTMLHeadingElement>;
  @ViewChild('timelineBar') timelineBar!: ElementRef<HTMLDivElement>;
  @ViewChildren('experienceItem') items!: QueryList<ElementRef<HTMLLIElement>>;

  private mm!: gsap.MatchMedia;
  private mainTl!: gsap.core.Timeline;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    if (!this.wrapper?.nativeElement || !this.title?.nativeElement || !this.timelineBar?.nativeElement || this.items.length === 0) {
      return;
    }

    const wrapperEl = this.wrapper.nativeElement;

    this.mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperEl,
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    });

    this.mainTl
      .from(this.title.nativeElement, { opacity: 0, y: 30, duration: 0.4, ease: 'power4.out' })
      .from(this.timelineBar.nativeElement, { scaleY: 0, duration: 1, ease: 'power4.inOut' }, '-=0.5');

    this.mm = gsap.matchMedia();

    this.mm.add('(min-width: 1024px)', () => {
      this.items.forEach((itemRef, index) => {
        const itemEl = itemRef.nativeElement;
        const card = itemEl.querySelector('.timeline-card');
        const time = itemEl.querySelector('time');
        const marker = itemEl.querySelector('.timeline-marker');

        if (!card || !time || !marker) return;

        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: itemEl,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        });

        itemTl
          .fromTo(marker, { scale: 0, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.3, ease: 'power2.out' })
          .to(marker, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.75)' });

        const isOdd = index % 2 === 0;
        const cardX = isOdd ? -100 : 100;
        const timeX = isOdd ? 100 : -100;

        itemTl
          .from(card, { xPercent: cardX, opacity: 0, duration: 0.45, ease: 'power4.inOut' }, '<')
          .from(time, { xPercent: timeX, opacity: 0, duration: 0.45, ease: 'power4.inOut' }, '<');
      });
    });

    this.mm.add('(max-width: 1023px)', () => {
      this.items.forEach(itemRef => {
        const itemEl = itemRef.nativeElement;
        const card = itemEl.querySelector('.timeline-card');
        const marker = itemEl.querySelector('.timeline-marker');

        if (!card || !marker) return;

        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: itemEl,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        itemTl
          .fromTo(marker, { scale: 0, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.3, ease: 'power2.out' })
          .to(marker, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.75)' });

        itemTl.from(card, { y: 40, opacity: 0, duration: 0.5, ease: 'power2.out' }, '<');
      });
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mainTl?.kill();
      this.mm?.revert();
    }
  }
}
