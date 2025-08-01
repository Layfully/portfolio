import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  OnDestroy,
  PLATFORM_ID,
  Inject
} from '@angular/core';
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
})
export class Skills implements AfterViewInit, OnDestroy {
  @Input() blok: any;
  @ViewChild('skillsWrapper', { read: ElementRef }) skillsWrapper!: ElementRef<HTMLElement>;
  @ViewChildren('skillTag') skillTags!: QueryList<ElementRef<HTMLLIElement>>;

  private tl?: gsap.core.Timeline;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    if (!this.skillsWrapper?.nativeElement || this.skillTags.length === 0) {
      return;
    }

    const wrapperElement = this.skillsWrapper.nativeElement;
    const titleElement = wrapperElement.querySelector('h2');
    const tagElements = this.skillTags.map(tagRef => tagRef.nativeElement);

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
      duration: 0.6,
      ease: 'power3.out'
    });

    this.tl.to(tagElements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.08,
    }, "-=0.3");
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }
}
