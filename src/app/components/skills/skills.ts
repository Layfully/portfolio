import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  OnDestroy
} from '@angular/core';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    SectionWrapper
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills implements AfterViewInit, OnDestroy {
  @Input() blok: any;

  @ViewChild('skillsWrapper', { read: ElementRef }) skillsWrapper!: ElementRef<HTMLElement>;

  @ViewChildren('skillTag') skillTags!: QueryList<ElementRef<HTMLLIElement>>;

  private tl?: gsap.core.Timeline;

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.initAnimation());
  }

  initAnimation(): void {
    if (!this.skillsWrapper?.nativeElement || this.skillTags.length === 0) {
      console.warn("GSAP animation in SkillsComponent aborted: target elements not found.");
      return;
    }

    const wrapperElement = this.skillsWrapper.nativeElement;
    const titleElement = wrapperElement.querySelector('h2');
    const tagElements = this.skillTags.map(tagRef => tagRef.nativeElement);

    if (!titleElement) return; // Another guard clause

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperElement,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    this.tl.from(titleElement, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out'
    });

    this.tl.from(tagElements, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.08,
    }, "-=0.3");
  }

  ngOnDestroy(): void {
    this.tl?.kill();
  }
}
