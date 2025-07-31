import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlokComponent } from '../blok-component/blok-component';
import { StoryblokService } from '../../services/storyblok.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [BlokComponent],
  templateUrl: './home.html'
})
export class Home implements OnInit, OnDestroy {
  story: any = {};
  storySubscription: Subscription | undefined;

  constructor(private storyblokService: StoryblokService) {}

  ngOnInit() {
    this.storySubscription = this.storyblokService.getStory('portfolio').subscribe(data => this.story = data);
  }

  ngOnDestroy(): void {
    this.storySubscription?.unsubscribe();
  }
}
