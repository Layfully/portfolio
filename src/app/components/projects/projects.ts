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
  blok = input.required<any>();

  @ViewChild('projectsWrapper', { read: ElementRef }) wrapper!: ElementRef<HTMLElement>;
  @ViewChild('projectsTitle') title!: ElementRef<HTMLHeadingElement>;
  @ViewChildren('projectCard') projectCards!: QueryList<ElementRef<HTMLElement>>;

  private triggers: ScrollTrigger[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    if (!this.wrapper?.nativeElement || !this.title?.nativeElement || this.projectCards.length === 0) {
      return;
    }

    gsap.to(this.title.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: this.wrapper.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    this.projectCards.forEach(cardRef => {
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
      if (this.title?.nativeElement) {
        gsap.getTweensOf(this.title.nativeElement).forEach(tween => {
          tween.kill();
        });
      }
    }
  }
}
