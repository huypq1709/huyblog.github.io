export type Language = 'en' | 'vi';
export interface BilingualText {
  en: string;
  vi: string;
}
export interface BlogPost {
  id: string;
  title: BilingualText;
  excerpt: BilingualText;
  content: BilingualText;
  date: string;
  readTime: number;
  imageUrl?: string;
  categories: string[];
}
export type SocialPlatform = 'Facebook' | 'Instagram' | 'Github' | 'Twitter' | 'LinkedIn' | 'Youtube' | 'Other';
export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  username: string;
  url: string;
}
export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Record<string, {
    en: string;
    vi: string;
  }>;
  updateTranslations: (newTranslations: Record<string, {
    en: string;
    vi: string;
  }>) => void;
}