import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList
} from '@angular/core';
import { SectionWrapper } from '../section-wrapper/section-wrapper';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-experience',
  standalone: true, // Assuming standalone
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

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.initAnimation());
  }

  initAnimation(): void {
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
          start: 'top 85%', // Trigger when the item is 85% from the top of the viewport
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
      const cardX = isOdd ? -100 : 100; // Odd items (left card) slide from left, even items from right
      const timeX = isOdd ? 100 : -100;  // Time is on the opposite side

      itemTl
        .from(card, { xPercent: cardX, opacity: 0, duration: 0.7, ease: 'power3.out' }, '<')
        .from(time, { xPercent: timeX, opacity: 0, duration: 0.7, ease: 'power3.out' }, '<');

      this.timelines.push(itemTl);
    });
  }

  ngOnDestroy(): void {
    this.timelines.forEach(tl => tl.kill());
  }
}
