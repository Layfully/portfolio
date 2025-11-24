import { Component, input, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, signal, ChangeDetectionStrategy, inject, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private platformId = inject<Object>(PLATFORM_ID);

  blok = input.required<any>();

  readonly headerNav = viewChild.required<ElementRef<HTMLElement>>('headerNav');

  activeSection = signal('Home');

  private intersectionObserver?: IntersectionObserver;
  private mutationObserver?: MutationObserver;
  private lastScrollY: number = 0;
  private animation?: gsap.core.Tween;
  private isNavigating = false;
  private scrollEndTimer: any;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.lastScrollY = window.scrollY;

      Promise.resolve().then(() => {
        this.initAnimation();
        this.setupIntersectionObserver();
        this.setupMutationObserver();
        window.addEventListener('scroll', this.onWindowScroll);
      });
    }
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
    this.mutationObserver?.disconnect();
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onWindowScroll);
    }
    this.animation?.kill();
  }

  private initAnimation(): void {
    const headerNav = this.headerNav();
    if (!headerNav?.nativeElement) return;

    this.animation = gsap.to(headerNav.nativeElement, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power4.out',
      delay: 0.1,
    });
  }

  private onWindowScroll = (): void => {
    clearTimeout(this.scrollEndTimer);

    this.scrollEndTimer = setTimeout(() => {
      this.isNavigating = false;
    }, 150)
  };

  private setupIntersectionObserver(): void {
    const options = {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0.7
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (this.isNavigating)
      {
        return;
      }

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
        if (this.activeSection() !== target.id) {
          this.activeSection.set(target.id);
          this.updateHighlight();
        }
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
    this.blok().links.forEach((link: any) => {
      const element = document.getElementById(link.section_id);
      if (element) {
        this.intersectionObserver!.observe(element);
      }
    });
  }

  private updateHighlight(): void {
    const activeLink = this.elementRef.nativeElement.querySelector(`a[href="#${this.activeSection()}"]`);
    const highlight = this.elementRef.nativeElement.querySelector('.nav-highlight') as HTMLElement;
    const nav = this.elementRef.nativeElement.querySelector('ul');

    if (activeLink && highlight && nav) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      const xOffset = linkRect.left - navRect.left - 17.5;
      const yOffset = linkRect.top - navRect.top - 15;

      highlight.style.width = `${linkRect.width + 35}px`;
      highlight.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }
  }

  onLinkClick(sectionId: string): void {
    this.isNavigating = true;
    this.activeSection.set(sectionId);
    this.updateHighlight();
  }
}
