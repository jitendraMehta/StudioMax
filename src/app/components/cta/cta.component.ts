import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STUDIO_WHATSAPP_URL } from '../../constants/contact';

@Component({
  selector: 'studio-cta',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
 templateUrl: './cta.component.html',
 styleUrls: ['./cta.component.scss'],
})
export class CtaComponent {
  readonly whatsappUrl = STUDIO_WHATSAPP_URL;
}
