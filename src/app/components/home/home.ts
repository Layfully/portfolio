import { Component, OnInit } from '@angular/core';
import { BlokComponent } from '../blok-component/blok-component';
import { StoryblokService } from '../../services/storyblok.service';

@Component({
  selector: 'app-home',
  imports: [BlokComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  story: any = { content: null };

  constructor(private storyblokService: StoryblokService) {}

  ngOnInit() {
    this.storyblokService.getStory('portfolio', { version: 'draft' })
      .then(data => {
        this.story = data.data.story;
      });
  }
}
