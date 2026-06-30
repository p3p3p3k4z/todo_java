import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-banner" *ngIf="message">
      {{ message }}
    </div>
  `,
  styles: [`
    .error-banner {
      background-color: #fee2e2;
      color: var(--color-brand-magenta, #D81B60);
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
      border: 1px solid var(--color-brand-magenta);
    }
  `]
})
export class ErrorBannerComponent {
  @Input() message: string = '';
}
