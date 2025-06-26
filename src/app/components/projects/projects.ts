import { Component, Input } from '@angular/core';
import { RichTextPipe } from '../../pipes/rich-text-pipe';

@Component({
  selector: 'app-projects',
  imports: [RichTextPipe],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  @Input() blok: any;
}
