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
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements AfterViewInit, OnDestroy {
  @Input() blok: any;

  @ViewChild('aboutWrapper', { read: ElementRef }) wrapper!: ElementRef<HTMLElement>;
  @ViewChild('aboutTitle') title!: ElementRef<HTMLHeadingElement>;
  @ViewChildren('aboutContent') contentBlocks!: QueryList<ElementRef<HTMLDivElement>>;

  private timeline?: gsap.core.Timeline;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    if (!this.wrapper?.nativeElement || !this.title?.nativeElement || this.contentBlocks.length === 0) {
      console.warn("GSAP animation in AboutComponent aborted: target elements not found.");
      return;
    }

    const wrapperEl = this.wrapper.nativeElement;
    const titleEl = this.title.nativeElement;
    const contentEls = this.contentBlocks.map(ref => ref.nativeElement);

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperEl,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    this.timeline
      .from(titleEl, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from(contentEls, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2
      }, '-=0.5');
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.timeline?.kill();
    }
  }
}
