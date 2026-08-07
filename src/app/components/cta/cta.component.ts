import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'studio-cta',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
 templateUrl: './cta.component.html',
 styleUrls: ['./cta.component.scss'],
})
export class CtaComponent {}
