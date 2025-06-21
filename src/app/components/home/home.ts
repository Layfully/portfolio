import { Component } from '@angular/core';
import { About } from '../about/about';
import { Hero } from '../hero/hero';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Experience } from '../experience/experience';
import { Contact } from '../contact/contact';
import { Skills } from '../skills/skills';
import { Projects } from '../projects/projects';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Header, Footer, Experience, Contact, Skills, Projects],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
