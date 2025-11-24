import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ContactService } from './contact.service';

describe('Contact', () => {
  let service: ContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });  service = TestBed.inject(ContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
