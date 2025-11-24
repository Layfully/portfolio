import { Component, input, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, ChangeDetectionStrategy, inject, viewChild } from '@angular/core';
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
  private platformId = inject<Object>(PLATFORM_ID);

  blok = input.required<any>();

  readonly profileImage = viewChild.required<ElementRef<HTMLDivElement>>('profileImageContainer');
  readonly wavingHand = viewChild.required<ElementRef<HTMLSpanElement>>('wavingHand');
  readonly introText = viewChild.required<ElementRef<HTMLHeadingElement>>('introText');
  readonly buttonGroup = viewChild.required<ElementRef<HTMLDivElement>>('buttonGroup');

  private tl?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimation();
    }
  }

  initAnimation(): void {
    const profileImage = this.profileImage();
    const wavingHand = this.wavingHand();
    const introText = this.introText();
    const buttonGroup = this.buttonGroup();
    if (!profileImage || !wavingHand || !introText || !buttonGroup) {
      return;
    }

    this.tl = gsap.timeline({
      delay: 0.3
    });

    this.tl
      .to(profileImage.nativeElement, { scale: 1, opacity:1, duration: .3, ease: 'power3.out'})
      .to(introText.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'back.inOut'
      }, '-=0.7')
      .to(buttonGroup.nativeElement, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'back.inOut'
      }, '-=0.6')
      .to(wavingHand.nativeElement, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      }, '-=0.5')
      .to(wavingHand.nativeElement, {
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
