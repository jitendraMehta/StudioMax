/**
 * Homepage Core Collections carousel — edit this file only.
 * Images live in /public (paths start with /).
 */
export interface CoreCollectionItem {
  /** Stable id for carousel trackBy */
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
  /** Optional catalog filter when the card is clicked (`/catalog?category=…`) */
  catalogCategory?: string;
}

export const CORE_COLLECTIONS: CoreCollectionItem[] = [
  {
    id: 'core-dj-speakers',
    title: 'DJ Speakers',
    subtitle: 'Club & event ready output',
    image: '/speakers.png',
    catalogCategory: 'dj-speakers',
  },
  {
    id: 'core-pa-speakers',
    title: 'PA Speakers',
    subtitle: 'Live sound & installations',
    image: '/pa-speaker.png',
    catalogCategory: 'pa-speakers',
  },
  {
    id: 'core-mic-stands',
    title: 'Microphone stands',
    subtitle: 'Stage & studio positioning',
    image: '/microphone-stands.png',
    catalogCategory: 'microphone-stands',
  },
  {
    id: 'core-trumpet',
    title: 'Trumpet & Reflex Horn',
    subtitle: 'Focused high-frequency projection',
    image: '/trumpet.png',
    catalogCategory: 'trumpet',
  },
  {
    id: 'core-hf-tweeter',
    title: 'HF Tweeter',
    subtitle: 'Extended HF clarity',
    image: '/HF-tweeter.png',
    catalogCategory: 'hf-tweeter',
  },
];
