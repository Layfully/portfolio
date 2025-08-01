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

  @ViewChild('aboutTitle') title!: ElementRef<HTMLHeadingElement>;
  @ViewChild('aboutContent') contentBlock!: ElementRef<HTMLDivElement>;

  private tl?: gsap.core.Timeline;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    if (!this.title?.nativeElement || !this.contentBlock?.nativeElement) {
      return;
    }

    const titleEl = this.title.nativeElement;
    const contentEl = this.contentBlock.nativeElement;

    this.tl = gsap.timeline({
      delay: 0.3
    });

    this.tl
      .to(titleEl, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .to(contentEl, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '<');
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }
}
