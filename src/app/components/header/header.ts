import { Component, Input, AfterViewInit, OnDestroy, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header implements AfterViewInit, OnDestroy {
  @Input() blok: any;

  @ViewChild('headerNav') headerNav!: ElementRef<HTMLElement>;

  activeSection: string = 'Home';

  private intersectionObserver?: IntersectionObserver;
  private mutationObserver?: MutationObserver;
  private lastScrollY: number = 0;
  private animation?: gsap.core.Tween;

  protected readonly sections = ['Home', 'About', 'Projects', 'Skills', 'Experience', 'Contact'];

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize scroll position
      this.lastScrollY = window.scrollY;

      Promise.resolve().then(() => {
        this.initAnimation();
        this.setupIntersectionObserver();
        this.setupMutationObserver();
      });
    }
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.animation?.kill();
  }

  private initAnimation(): void {
    if (!this.headerNav?.nativeElement) return;

    this.animation = gsap.from(this.headerNav.nativeElement, {
      y: -100,
      opacity: 0,
      duration: 0.4,
      ease: 'power4.out',
      delay: 0.1,
    });
  }

  private setupIntersectionObserver(): void {
    const options = {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0.7
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      const currentY = window.scrollY;
      const scrollingDown = currentY >= this.lastScrollY;
      this.lastScrollY = currentY;

      const visible = entries.filter(e => e.isIntersecting);
      if (!visible.length) return;

      const sorted = visible.sort((a, b) => {
        const ay = a.boundingClientRect.y;
        const by = b.boundingClientRect.y;
        return !scrollingDown ? ay - by : by - ay;
      });

      const target = sorted[0].target as HTMLElement;
      window.requestAnimationFrame(() => {
        this.activeSection = target.id;
        this.updateHighlight();
      });
    }, options);

    this.observeAllSections();
  }

  private setupMutationObserver(): void {
    const config = { childList: true, subtree: true };

    this.mutationObserver = new MutationObserver(() => {
      this.observeAllSections();
    });

    this.mutationObserver.observe(document.body, config);
  }

  private observeAllSections(): void {
    this.sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        this.intersectionObserver!.observe(element);
      }
    });
  }

  private updateHighlight(): void {
    const activeLink = this.elementRef.nativeElement.querySelector(`a[href="#${this.activeSection}"]`);
    const highlight = this.elementRef.nativeElement.querySelector('.nav-highlight');
    const nav = this.elementRef.nativeElement.querySelector('ul');

    if (activeLink && highlight && nav) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      highlight.style.width = `${linkRect.width + 35}px`;
      highlight.style.transform = `translateX(${linkRect.left - 17.5 - navRect.left}px)`;
    }
  }

  onLinkClick(sectionId: string): void {
    this.activeSection = sectionId;
    this.updateHighlight();
  }
}
