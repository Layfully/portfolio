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
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about',
  imports: [RichTextPipe, SectionWrapper],
  templateUrl: './about.html'
})
export class About implements AfterViewInit, OnDestroy {
  @Input() blok: any;

  @ViewChild('aboutWrapper', { read: ElementRef }) wrapper!: ElementRef<HTMLElement>;
  @ViewChild('aboutTitle') title!: ElementRef<HTMLHeadingElement>;
  @ViewChildren('aboutContent') contentBlocks!: QueryList<ElementRef<HTMLDivElement>>;

  private tl?: gsap.core.Timeline;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    if (!this.wrapper?.nativeElement || !this.title?.nativeElement || this.contentBlocks.length === 0) {
      return;
    }

    const wrapperEl = this.wrapper.nativeElement;
    const titleEl = this.title.nativeElement;
    const contentEls = this.contentBlocks.map(ref => ref.nativeElement);

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperEl,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    this.tl
      .to(titleEl, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .to(contentEls, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2
      }, '-=0.5');
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }
}
