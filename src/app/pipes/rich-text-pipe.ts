import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { renderRichText } from '@storyblok/js';

@Pipe({
  name: 'richText'
})
export class RichTextPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);


  transform = (value: any): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(renderRichText(value) ?? '');
}
