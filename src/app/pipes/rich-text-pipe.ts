import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderRichText } from '@storyblok/js';

@Pipe({
  name: 'richText'
})
export class RichTextPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any): SafeHtml {
    if (!value) {
      return '';
    }
    const html = renderRichText(value) ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
