import { Component, Input, OnInit, OnDestroy, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.html'
})
export class Header implements OnInit, OnDestroy {
  @Input() blok: any;

  activeSection: string = 'Home';
  private observer?: IntersectionObserver;
  protected readonly sections = ['Home', 'About', 'Projects', 'Skills', 'Experience', 'Contact'];
  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this.setupObserver());
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private setupObserver(): void {
    const options = {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0.75
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
          this.updateHighlight();
        }
      });
    }, options);

    this.sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        this.observer!.observe(element);
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
