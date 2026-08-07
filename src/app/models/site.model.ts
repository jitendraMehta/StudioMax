export interface Category {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  alt?: string;
}

export interface Feature {
  id: string;
  title: string;
  icon?: string;
  description: string;
}
