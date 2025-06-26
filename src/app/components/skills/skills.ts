import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills {
  @Input() blok: any;

}
