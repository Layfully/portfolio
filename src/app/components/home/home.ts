import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoryblokService } from '../../services/storyblok.service';
import { Subscription } from 'rxjs';
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
  imports: [
    Hero,
    About,
    Header,
    Footer,
    Experience,
    Contact,
    Skills,
    Projects],
  templateUrl: './home.html'
})
export class Home implements OnInit, OnDestroy {
  story: any = {};
  blokMap: Record<string, any> = {};
  storySubscription: Subscription | undefined;

  constructor(private storyblokService: StoryblokService) {}

  ngOnInit() {
    this.storySubscription = this.storyblokService
      .getStory('portfolio')
      .subscribe(data => {
        this.story = data;
        this.buildBlokMap();
      });  }

  ngOnDestroy(): void {
    this.storySubscription?.unsubscribe();
  }

  private buildBlokMap(): void {
    this.blokMap = {};
    if (this.story?.content?.body) {
      for (const b of this.story.content.body) {
        this.blokMap[b.component] = b;
      }
    }
  }
}
