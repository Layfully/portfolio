import { Component, Input } from '@angular/core';
import { About } from '../about/about';
import { Hero } from '../hero/hero';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Experience } from '../experience/experience';
import { Contact } from '../contact/contact';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';

@Component({
  selector: 'app-blok',
  imports: [
    Hero,
    About,
    Header,
    Footer,
    Experience,
    Contact,
    Skills,
    Projects
  ],
  templateUrl: './blok-component.html',
})

export class BlokComponent {
  @Input() blok: any;
}
