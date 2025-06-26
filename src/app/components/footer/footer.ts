import { Component, Input } from '@angular/core';
import { RichTextPipe } from '../../pipes/rich-text-pipe';

@Component({
  selector: 'app-footer',
  imports: [RichTextPipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  @Input() blok: any;
  year: number = new Date().getFullYear();
}
