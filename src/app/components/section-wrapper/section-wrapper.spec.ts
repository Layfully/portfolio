import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { SectionWrapper } from './section-wrapper';

describe('SectionWrapper', () => {
  let component: SectionWrapper;
  let fixture: ComponentFixture<SectionWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionWrapper],
      providers: [provideZonelessChangeDetection()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
