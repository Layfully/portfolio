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
  getStory(slug: string): Observable<Story | undefined> {
    return this.allStories$.pipe(
      map(stories => stories.find(story => story.full_slug === slug))
    );
  }

  /**
   * Gets ALL stories.
   * This is useful for list pages, like a blog index or a project portfolio overview.
   */
  getStories(params?: { starts_with: string }): Observable<Story[]> {
    return this.allStories$.pipe(
      map(stories => {
        if (params?.starts_with) {
          // If a 'starts_with' filter is provided, filter the stories.
          return stories.filter(story => story.full_slug.startsWith(params.starts_with));
        }
        // Otherwise, return all stories.
        return stories;
      })
    );
  }
}
