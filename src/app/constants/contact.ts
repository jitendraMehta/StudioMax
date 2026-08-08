/** Studio Max primary phone / WhatsApp (E.164 without +). */
export const STUDIO_PHONE_E164 = '919873838630';

export const STUDIO_PHONE_DISPLAY = '+91 98738 38630';

export const STUDIO_PHONE_TEL = `tel:+${STUDIO_PHONE_E164}`;

/** Pre-filled text when opening WhatsApp from site CTAs. */
export const STUDIO_WHATSAPP_MESSAGE =
  'Hello Studio Max, I would like to inquire about your professional audio products. Please share details and pricing.';

export const STUDIO_WHATSAPP_URL = `https://wa.me/${STUDIO_PHONE_E164}?text=${encodeURIComponent(STUDIO_WHATSAPP_MESSAGE)}`;

export interface ContactFormWhatsAppPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/** Pre-filled WhatsApp message from the contact page form. */
export function buildWhatsAppContactUrl(payload: ContactFormWhatsAppPayload): string {
  const lines = [
    STUDIO_WHATSAPP_MESSAGE,
    '',
    '— Contact form —',
    `Name: ${payload.name.trim()}`,
    `Email: ${payload.email.trim()}`,
  ];
  const phone = payload.phone.trim();
  if (phone) {
    lines.push(`Phone: ${phone}`);
  }
  lines.push(`Subject: ${payload.subject.trim()}`, '', payload.message.trim());
  return `https://wa.me/${STUDIO_PHONE_E164}?text=${encodeURIComponent(lines.join('\n'))}`;
}
