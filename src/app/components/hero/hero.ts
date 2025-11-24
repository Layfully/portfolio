import {
  Component,
  input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { SectionWrapper } from '../section-wrapper/section-wrapper';

import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  imports: [RichTextPipe, SectionWrapper, NgOptimizedImage],
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hero implements AfterViewInit, OnDestroy {
  blok = input.required<any>();

  @ViewChild('profileImageContainer') profileImage!: ElementRef<HTMLDivElement>;
  @ViewChild('wavingHand') wavingHand!: ElementRef<HTMLSpanElement>;
  @ViewChild('introText') introText!: ElementRef<HTMLHeadingElement>;
  @ViewChild('buttonGroup') buttonGroup!: ElementRef<HTMLDivElement>;

  private tl?: gsap.core.Timeline;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimation();
    }
  }

  initAnimation(): void {
    if (!this.profileImage || !this.wavingHand || !this.introText || !this.buttonGroup) {
      return;
    }

    this.tl = gsap.timeline({
      delay: 0.3
    });

    this.tl
      .to(this.profileImage.nativeElement, { scale: 1, opacity:1, duration: .3, ease: 'power3.out'})
      .to(this.introText.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'back.inOut'
      }, '-=0.7')
      .to(this.buttonGroup.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'back.inOut'
      }, '-=0.6')
      .to(this.wavingHand.nativeElement, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '-=0.5')
      .to(this.wavingHand.nativeElement, {
        keyframes: {
          '0%': { rotate: 0 },
          '25%': { rotate: -20 },
          '50%': { rotate: 20 },
          '75%': { rotate: -20 },
          '100%': { rotate: 0 }
        },
        transformOrigin: '75% 75%',
        repeat: -1,
        repeatDelay: 1,
        duration: 0.4,
        ease: 'power1.inOut'
      });
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }
}
