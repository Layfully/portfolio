import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [SectionWrapper],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience implements AfterViewInit, OnDestroy {
  @Input() blok: any;

  @ViewChild('experienceWrapper', { read: ElementRef }) wrapper!: ElementRef<HTMLElement>;
  @ViewChild('experienceTitle') title!: ElementRef<HTMLHeadingElement>;
  @ViewChild('timelineBar') timelineBar!: ElementRef<HTMLDivElement>;
  @ViewChildren('experienceItem') items!: QueryList<ElementRef<HTMLLIElement>>;

  private timelines: gsap.core.Timeline[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    if (!this.wrapper?.nativeElement || !this.title?.nativeElement || !this.timelineBar?.nativeElement || this.items.length === 0) {
      console.warn("GSAP animation in ExperienceComponent aborted: target elements not found.");
      return;
    }

    const wrapperEl = this.wrapper.nativeElement;

    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperEl,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });

    mainTl
      .from(this.title.nativeElement, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
      .from(this.timelineBar.nativeElement, { scaleY: 0, duration: 1, ease: 'power3.inOut' }, '-=0.5');

    this.timelines.push(mainTl);

    this.items.forEach((itemRef, index) => {
      const itemEl = itemRef.nativeElement;
      const card = itemEl.querySelector('.timeline-card');
      const time = itemEl.querySelector('time');
      const marker = itemEl.querySelector('.timeline-marker');

      if (!card || !time || !marker) return;

      const itemTl = gsap.timeline({
        scrollTrigger: {
          trigger: itemEl,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      itemTl.fromTo(marker,
        { scale: 0, opacity: 0 },
        { scale: 1.5, opacity: 1, duration: 0.4, ease: 'power2.out' }
      ).to(marker,
        { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.75)' }
      );

      const isOdd = index % 2 === 0;
      const cardX = isOdd ? -100 : 100;
      const timeX = isOdd ? 100 : -100;

      itemTl
        .from(card, { xPercent: cardX, opacity: 0, duration: 0.7, ease: 'power3.out' }, '<')
        .from(time, { xPercent: timeX, opacity: 0, duration: 0.7, ease: 'power3.out' }, '<');

      this.timelines.push(itemTl);
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.timelines.forEach(tl => tl.kill());
    }
  }
}
