import { BlogPost, SocialLink } from '../types/blog';

const POSTS_STORAGE_KEY = 'blog_posts';
const SOCIAL_LINKS_STORAGE_KEY = 'social_links';

// Posts Storage
export const postsStorage = {
  get: (): BlogPost[] => {
    try {
      const stored = localStorage.getItem(POSTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error reading posts from localStorage:', error);
      return [];
    }
  },

  set: (posts: BlogPost[]): void => {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  },

  clear: (): void => {
    localStorage.removeItem(POSTS_STORAGE_KEY);
  }
};

// Social Links Storage
export const socialLinksStorage = {
  get: (): SocialLink[] => {
    try {
      const stored = localStorage.getItem(SOCIAL_LINKS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error reading social links from localStorage:', error);
      return [];
    }
  },

  set: (links: SocialLink[]): void => {
    try {
      localStorage.setItem(SOCIAL_LINKS_STORAGE_KEY, JSON.stringify(links));
    } catch (error) {
      console.error('Error saving social links to localStorage:', error);
    }
  },

  clear: (): void => {
    localStorage.removeItem(SOCIAL_LINKS_STORAGE_KEY);
  }
};

