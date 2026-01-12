import { BlogPost, SocialLink } from '../types/blog';

// API Service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Posts API
export const postsAPI = {
  getAll: async (): Promise<BlogPost[]> => apiRequest<BlogPost[]>('/posts'),
  getById: async (id: string): Promise<BlogPost> => apiRequest<BlogPost>(`/posts/${id}`),
  create: async (postData: Omit<BlogPost, 'id'>): Promise<BlogPost> => apiRequest<BlogPost>('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  }),
  update: async (id: string, postData: Partial<BlogPost>): Promise<BlogPost> => apiRequest<BlogPost>(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  }),
  delete: async (id: string): Promise<void> => apiRequest<void>(`/posts/${id}`, {
    method: 'DELETE',
  }),
};

// Social Links API
export const socialLinksAPI = {
  getAll: async (): Promise<SocialLink[]> => apiRequest<SocialLink[]>('/social-links'),
  getById: async (id: string): Promise<SocialLink> => apiRequest<SocialLink>(`/social-links/${id}`),
  create: async (linkData: Omit<SocialLink, 'id'>): Promise<SocialLink> => apiRequest<SocialLink>('/social-links', {
    method: 'POST',
    body: JSON.stringify(linkData),
  }),
  update: async (id: string, linkData: Partial<SocialLink>): Promise<SocialLink> => apiRequest<SocialLink>(`/social-links/${id}`, {
    method: 'PUT',
    body: JSON.stringify(linkData),
  }),
  delete: async (id: string): Promise<void> => apiRequest<void>(`/social-links/${id}`, {
    method: 'DELETE',
  }),
};

