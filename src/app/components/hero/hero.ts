// src/app/components/hero/hero.ts

import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { SectionWrapper } from '../section-wrapper/section-wrapper';

import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true, // Assuming standalone
  imports: [RichTextPipe, SectionWrapper],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements AfterViewInit, OnDestroy {
  @Input() blok: any;

  @ViewChild('profileImageContainer') profileImage!: ElementRef<HTMLDivElement>;
  @ViewChild('wavingHand') wavingHand!: ElementRef<HTMLSpanElement>;
  @ViewChild('introText') introText!: ElementRef<HTMLHeadingElement>;
  @ViewChild('buttonGroup') buttonGroup!: ElementRef<HTMLDivElement>;

  private tl?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    this.initAnimation();
  }

  initAnimation(): void {
    this.tl = gsap.timeline({
      delay: 0.3
    });

    this.tl
      .from(this.profileImage.nativeElement, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .from(this.introText.nativeElement, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.7')
      .from(this.buttonGroup.nativeElement, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6')
      .from(this.wavingHand.nativeElement, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, '-=0.5')
      .to(this.wavingHand.nativeElement, {
        keyframes: {
          '0%': { rotate: 0 },
          '25%': { rotate: -15 },
          '50%': { rotate: 15 },
          '75%': { rotate: -15 },
          '100%': { rotate: 0 }
        },
        repeat: -1,
        repeatDelay: 1.5,
        duration: 0.7,
        ease: 'power1.inOut'
      });
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }
}
