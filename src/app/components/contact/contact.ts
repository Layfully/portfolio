import { Component, Input, OnInit } from '@angular/core';
import { RichTextPipe } from '../../pipes/rich-text-pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [RichTextPipe, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit {
  @Input() blok: any;
  contactForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // For demonstration, we'll log the form value.
      // In a real application, you would send this data to a server.
      console.log('Form Submitted!', this.contactForm.value);
    }
  }

}
