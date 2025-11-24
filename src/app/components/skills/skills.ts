import { Component, input, AfterViewInit, ElementRef, OnDestroy, PLATFORM_ID, ChangeDetectionStrategy, inject, viewChild, viewChildren } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-skills',
  imports: [
    SectionWrapper
  ],
  templateUrl: './skills.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Skills implements AfterViewInit, OnDestroy {
  private platformId = inject<Object>(PLATFORM_ID);

  blok = input.required<any>();
  readonly skillsWrapper = viewChild.required('skillsWrapper', { read: ElementRef });
  readonly skillTags = viewChildren<ElementRef<HTMLLIElement>>('skillTag');

  private tl?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    const skillsWrapper = this.skillsWrapper();
    const skillTags = this.skillTags();
    if (!skillsWrapper?.nativeElement || skillTags.length === 0) {
      return;
    }

    const wrapperElement = skillsWrapper.nativeElement;
    const titleElement = wrapperElement.querySelector('h1');
    const tagElements = skillTags.map(tagRef => tagRef.nativeElement);

    if (!titleElement) return;

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    this.tl.to(titleElement, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power4.out'
    });

    this.tl.to(tagElements, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power4.inOut',
      stagger: 0.05,
    }, "-=0.3");
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }
}
