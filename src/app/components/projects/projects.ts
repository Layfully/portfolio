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
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [SectionWrapper, RichTextPipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements AfterViewInit, OnDestroy {
  @Input() blok: any;

  @ViewChild('projectsWrapper', { read: ElementRef }) wrapper!: ElementRef<HTMLElement>;
  @ViewChild('projectsTitle') title!: ElementRef<HTMLHeadingElement>;
  @ViewChildren('projectCard') projectCards!: QueryList<ElementRef<HTMLElement>>;

  private triggers: ScrollTrigger[] = [];

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.initAnimation());
  }

  initAnimation(): void {
    gsap.from(this.title.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.wrapper.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    this.projectCards.forEach(cardRef => {
      const cardEl = cardRef.nativeElement;

      const tween = gsap.from(cardEl, {
        opacity: 0,
        scale: 0.9,
        y: 50,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: cardEl,
          start: 'top 90%',
          end: 'top 40%',
          scrub: true,
        }
      });

      if (tween.scrollTrigger) {
        this.triggers.push(tween.scrollTrigger);
      }
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach(trigger => trigger.kill());
    gsap.getTweensOf(this.title.nativeElement).forEach(tween => {
      tween.kill();
    });
  }
}
