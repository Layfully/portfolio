import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class Experience {
  @Input() blok: any;
}
