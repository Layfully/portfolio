import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface Story {
  full_slug: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class StoryblokService {
  private allStories$: Observable<Story[]>;

  constructor(private http: HttpClient) {
    this.allStories$ = this.http.get<Story[]>('/assets/data/stories.json').pipe(
      shareReplay(1)
    );
  }

  /**
   * Gets a SINGLE story by its slug.
   * Instead of calling an API, it searches the array of all stories.
   * @param slug The full slug of the story to find (e.g., 'about' or 'projects/my-first-project')
   */
  getStory = (slug: string): Observable<Story | undefined> => this.allStories$.pipe(map(stories => stories.find(story => story.full_slug == slug)));
}
