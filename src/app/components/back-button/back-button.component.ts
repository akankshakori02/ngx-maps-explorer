import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: false,
  template: ` <button class="back-button" (click)="goBackToHome()">
    <span class="visually-hidden">Go Back</span>
  </button>`,
  styleUrl: './back-button.component.css',
})
export class BackButtonComponent {
  constructor(private router: Router) {}

  goBackToHome(): void {
    this.router.navigate(['/']);
  }
}
