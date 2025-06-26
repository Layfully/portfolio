import { Component, Input } from '@angular/core';
import { RichTextPipe } from '../../pipes/rich-text-pipe';

@Component({
  selector: 'app-hero',
  imports: [RichTextPipe],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero {
  @Input() blok: any;
}
