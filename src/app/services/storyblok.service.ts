import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

interface Story {
  full_slug: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class StoryblokService {
  private storiesCache = new Map<string, Observable<Story[]>>();

  constructor(private http: HttpClient) {}

  /**
   * Gets all stories for a specific language.
   * It fetches the corresponding JSON file and caches the result.
   * @param lang The language code (e.g., 'en', 'pl')
   */
  private getAllStories(lang: string): Observable<Story[]> {
    if (this.storiesCache.has(lang)) {
      return this.storiesCache.get(lang)!;
    }

    const stories$ = this.http.get<Story[]>(`/assets/data/stories.${lang}.json`).pipe(
      shareReplay(1)
    );

    this.storiesCache.set(lang, stories$);
    return stories$;
  }

  /**
   * Gets a SINGLE story by its slug for a given language.
   * @param slug The full slug of the story (e.g., 'portfolio')
   * @param lang The language code (e.g., 'en', 'pl')
   */
  getStory(slug: string, lang: string): Observable<Story | undefined> {
    return this.getAllStories(lang).pipe(
      map(stories => stories.find(story => story.full_slug === slug || story.full_slug === `${lang}/${slug}`))
    );
  }
}
