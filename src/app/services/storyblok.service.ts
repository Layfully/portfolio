import { Injectable } from '@angular/core';
import StoryblokClient from 'storyblok-js-client';

@Injectable({
  providedIn: 'root'
})
export class StoryblokService {
  private sbClient = new StoryblokClient({
    accessToken: 'roqpAYkQ80QCYnhE7hxUcwtt'
  });

  constructor() { }

  getStory(slug: string, params?: object): Promise<any> {
    return this.sbClient.getStory(slug, params);
  }
}

