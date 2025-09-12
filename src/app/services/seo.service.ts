import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly siteUrl = 'https://portfolio.adriangaborek.dev';

  constructor(
    private title: Title,
    private meta: Meta,
    private router: Router,
    @Inject(DOCUMENT) private doc: Document
  ) { }

  /**
   * Sets all the essential SEO meta tags for a page.
   * @param metaData The SEO data fetched from Storyblok.
   * @param lang The current language code ('en' or 'pl').
   */
  updateMetaTags(metaData: any, lang: string): void {
    const title = metaData.meta_title;
    const description = metaData.meta_description;
    const url = `${this.siteUrl}${this.router.url}`;

    this.title.setTitle(title);

    this.doc.documentElement.lang = lang;

    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:title', content: metaData.og_title || title });
    this.meta.updateTag({ property: 'og:description', content: metaData.og_description || description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.updateCanonicalLink(url);
    this.updateHreflangLinks();
  }

  /**
   * Updates or creates the canonical link tag.
   * @param url The canonical URL for the current page.
   */
  private updateCanonicalLink(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.doc.head.appendChild(link);
    }
  }

  private updateHreflangLinks(): void {
    const existingLinks: NodeListOf<HTMLLinkElement> = this.doc.querySelectorAll('link[rel="alternate"][hreflang]');
    existingLinks.forEach(link => this.doc.head.removeChild(link));

    const createHreflangLink = (langCode: string, path: string) => {
      const link: HTMLLinkElement = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', langCode);
      link.setAttribute('href', `${this.siteUrl}${path}`);
      this.doc.head.appendChild(link);
    };

    createHreflangLink('en', '/');
    createHreflangLink('pl', '/pl');
    createHreflangLink('x-default', '/');
  }
}
