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
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { SectionWrapper } from '../section-wrapper/section-wrapper';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.initAnimation());
  }

  initAnimation(): void {
    const wrapperEl = this.wrapper.nativeElement;
    const titleEl = this.title.nativeElement;
    const contentEls = this.contentBlocks.map(ref => ref.nativeElement);

    if (!titleEl || contentEls.length === 0) return;

    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperEl,
        start: 'top 80%',
        toggleActions: 'play none none none' // Animate once and don't reverse
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
      }, '-=0.5'); // Start this animation 0.5s before the previous one ends for a smooth overlap
  }

  ngOnDestroy(): void {
    this.timeline?.kill();
  }
}
