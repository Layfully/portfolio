import { Component, Input } from '@angular/core';
import { RichTextPipe } from '../../pipes/rich-text-pipe';

@Component({
  selector: 'app-about',
  imports: [RichTextPipe],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  @Input() blok: any;
}
