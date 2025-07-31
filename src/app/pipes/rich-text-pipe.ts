import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderRichText } from '@storyblok/js';

@Pipe({
  name: 'richText'
})
export class RichTextPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform = (value: any): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(renderRichText(value) ?? '');
}
