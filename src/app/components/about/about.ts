import { Component, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, ChangeDetectionStrategy, inject, input, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-about',
  imports: [RichTextPipe, SectionWrapper],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements AfterViewInit, OnDestroy {
  private platformId = inject<Object>(PLATFORM_ID);

  readonly blok = input<any>();

  readonly title = viewChild.required<ElementRef<HTMLHeadingElement>>('aboutTitle');
  readonly contentBlock = viewChild.required<ElementRef<HTMLDivElement>>('aboutContent');

  private tl?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.initAnimation());
    }
  }

  initAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    const title = this.title();
    const contentBlock = this.contentBlock();
    if (!title?.nativeElement || !contentBlock?.nativeElement) {
      return;
    }

    const titleEl = title.nativeElement;
    const contentEl = contentBlock.nativeElement;

    this.tl = gsap.timeline({
      delay: 0.2
    });

    this.tl
      .to(titleEl, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out'
      })
      .to(contentEl, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'back.out',
      }, '<');
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }
}
