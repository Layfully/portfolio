import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { StoryblokService } from './storyblok.service';

describe('StoryblokService', () => {
  let service: StoryblokService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
  service = TestBed.inject(StoryblokService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
