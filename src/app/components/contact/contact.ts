import { Component, Input, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { SectionWrapper } from '../section-wrapper/section-wrapper';
import { ContactService } from '../../services/contact.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RichTextPipe, ReactiveFormsModule, SectionWrapper],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit, AfterViewInit, OnDestroy {
  @Input() blok: any;
  public contactForm!: FormGroup;
  public submissionStatus: SubmissionStatus = 'idle';

  private initialRevealAnim?: gsap.core.Tween;
  private resultTimeoutId?: number;

  @ViewChild('contactWrapper', { read: ElementRef, static: true }) private contactWrapper!: ElementRef<HTMLElement>;
  @ViewChild('contactTitle', { read: ElementRef, static: true }) private contactTitle!: ElementRef<HTMLHeadingElement>;
  @ViewChild('contactPrompt', { read: ElementRef, static: true }) private contactPrompt!: ElementRef<HTMLDivElement>;
  @ViewChild('formElement', { read: ElementRef }) private formElement!: ElementRef<HTMLFormElement>;

  private successMessageRef?: ElementRef<HTMLDivElement>;
  @ViewChild('successMessageContainer') set successMessageContainer(el: ElementRef<HTMLDivElement> | undefined) {
    if (el) {
      this.successMessageRef = el;
      this.animateResultIn(el.nativeElement);
    }
  }

  private errorMessageRef?: ElementRef<HTMLDivElement>;
  @ViewChild('errorMessageContainer') set errorMessageContainer(el: ElementRef<HTMLDivElement> | undefined) {
    if (el) {
      this.errorMessageRef = el;
      this.animateResultIn(el.nativeElement);
    }
  }

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(5000)]]
    });
  }

  ngAfterViewInit(): void {
    this.initScrollAnimation();
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
        error: (err) => {
          console.error('Form submission failed:', err);
          this.handleSubmissionResult('error');
        }
      });
  }

  public ngOnDestroy(): void {
    this.initialRevealAnim?.kill();

    gsap.killTweensOf([
      this.successMessageRef?.nativeElement,
      this.errorMessageRef?.nativeElement
    ]);

    if (this.resultTimeoutId) {
      clearTimeout(this.resultTimeoutId);
    }
  }

  private initScrollAnimation(): void {
    const elementsToAnimate = [
      this.contactTitle.nativeElement,
      this.contactPrompt.nativeElement,
      ...gsap.utils.toArray(this.formElement.nativeElement.querySelectorAll('.form-input')),
      this.formElement.nativeElement.querySelector('.btn-submit') // More specific selector
    ];

    this.initialRevealAnim = gsap.from(elementsToAnimate, {
      opacity: 0,
      y: 15,
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.05,
      scrollTrigger: {
        trigger: this.contactWrapper.nativeElement,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }

  /**
   * Manages the "In -> Wait -> Out -> Reset" lifecycle for the submission result message.
   */
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
    gsap.from(element, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out'
    });
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
