import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/api/send_email';
  constructor(private http: HttpClient) { }
  /**
   * Sends the contact form data to the backend API.
   * @param formData The email and message from the user.
   * @returns An Observable that completes on success or errors out.
   */
  sendEmail(formData: ContactFormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
