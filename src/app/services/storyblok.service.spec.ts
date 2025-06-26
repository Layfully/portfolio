import { TestBed } from '@angular/core/testing';

import { StoryblokService } from './storyblok.service';

describe('StoryblokService', () => {
  let service: StoryblokService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoryblokService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
