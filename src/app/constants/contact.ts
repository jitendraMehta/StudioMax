/** Studio Max primary phone / WhatsApp (E.164 without +). */
export const STUDIO_PHONE_E164 = '919873838630';

export const STUDIO_PHONE_DISPLAY = '+91 98738 38630';

export const STUDIO_PHONE_TEL = `tel:+${STUDIO_PHONE_E164}`;

/** Pre-filled text when opening WhatsApp from site CTAs. */
export const STUDIO_WHATSAPP_MESSAGE =
  'Hello Studio Max, I would like to inquire about your professional audio products. Please share details and pricing.';

export const STUDIO_WHATSAPP_URL = `https://wa.me/${STUDIO_PHONE_E164}?text=${encodeURIComponent(STUDIO_WHATSAPP_MESSAGE)}`;
