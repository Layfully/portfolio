import { Component, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  @Input() blok: any;

  activeSection: string = 'home';
  private observer?: IntersectionObserver;
  sections: string[] = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    setTimeout(() => this.setupObserver(), 100);
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

    this.updateHighlight();
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
