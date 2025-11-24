import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, PLATFORM_ID, ChangeDetectionStrategy, inject, input, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { ContactService } from '../../services/contact.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  imports: [RichTextPipe, ReactiveFormsModule, SectionWrapper],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact implements OnInit, AfterViewInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private contactService = inject(ContactService);
  private platformId = inject<Object>(PLATFORM_ID);

  readonly blok = input<any>();
  public contactForm!: FormGroup;
  public submissionStatus: SubmissionStatus = 'idle';

  private initialRevealAnim?: gsap.core.Tween;
  private resultTimeoutId?: number;

  private readonly contactWrapper = viewChild.required('contactWrapper', { read: ElementRef });
  private readonly contactTitle = viewChild.required('contactTitle', { read: ElementRef });
  private readonly contactPrompt = viewChild.required('contactPrompt', { read: ElementRef });
  private readonly formElement = viewChild.required('formElement', { read: ElementRef });

  private successMessageRef?: ElementRef<HTMLDivElement>;
  @ViewChild('successMessageContainer') set successMessageContainer(el: ElementRef<HTMLDivElement> | undefined) {
    if (el && isPlatformBrowser(this.platformId)) {
      this.successMessageRef = el;
      this.animateResultIn(el.nativeElement);
    }
  }

  private errorMessageRef?: ElementRef<HTMLDivElement>;
  @ViewChild('errorMessageContainer') set errorMessageContainer(el: ElementRef<HTMLDivElement> | undefined) {
    if (el && isPlatformBrowser(this.platformId)) {
      this.errorMessageRef = el;
      this.animateResultIn(el.nativeElement);
    }
  }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(5000)]]
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollAnimation();
    }
  }

  public onSubmit(): void {
    if (!this.contactForm.valid || this.submissionStatus === 'submitting') {
      return;
    }
    this.submissionStatus = 'submitting';
    this.contactService.sendEmail(this.contactForm.value)
      .subscribe({
        next: () => {
          this.handleSubmissionResult('success');
        },
        error: () => {
          this.handleSubmissionResult('error');
        }
      });
  }

  public ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initialRevealAnim?.kill();
      gsap.killTweensOf([
        this.successMessageRef?.nativeElement,
        this.errorMessageRef?.nativeElement
      ]);
      if (this.resultTimeoutId) {
        clearTimeout(this.resultTimeoutId);
      }
    }
  }

  private initScrollAnimation(): void {
    gsap.registerPlugin(ScrollTrigger);

    const contactWrapper = this.contactWrapper();
    const formElement = this.formElement();
    if (!contactWrapper || !formElement) return;

    const elementsToAnimate = [
      this.contactTitle().nativeElement,
      this.contactPrompt().nativeElement,
      ...gsap.utils.toArray(formElement.nativeElement.querySelectorAll('.form-input')),
      formElement.nativeElement.querySelector('.btn-submit')
    ];

    this.initialRevealAnim = gsap.from(elementsToAnimate, {
      opacity: 0,
      y: 15,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.05,
      scrollTrigger: {
        trigger: contactWrapper.nativeElement,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
  }

  private handleSubmissionResult(result: 'success' | 'error'): void {
    this.submissionStatus = result;

    this.resultTimeoutId = window.setTimeout(() => {
      const elementToAnimate = result === 'success'
        ? this.successMessageRef?.nativeElement
        : this.errorMessageRef?.nativeElement;

      if (elementToAnimate) {
        this.animateResultOut(elementToAnimate, () => {
          this.submissionStatus = 'idle';
          if (result === 'success') {
            this.contactForm.reset();
          }
        });
      }
    }, 4000);
  }

  private animateResultIn(element: HTMLElement): void {
    gsap.from(element, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
  }

  private animateResultOut(element: HTMLElement, onComplete: () => void): void {
    gsap.to(element, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: onComplete
    });
  }
}
