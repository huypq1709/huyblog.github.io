import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { Language, LanguageContextType } from '../types/blog';
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const initialTranslations: Record<string, {
  en: string;
  vi: string;
}> = {
  // General
  readMore: {
    en: 'Read more',
    vi: 'Đọc thêm'
  },
  backToHome: {
    en: 'Back to Home',
    vi: 'Quay lại trang chủ'
  },
  minRead: {
    en: 'min read',
    vi: 'phút đọc'
  },
  about: {
    en: 'About',
    vi: 'Giới thiệu'
  },
  blog: {
    en: 'Blog',
    vi: 'Blog'
  },
  latestPosts: {
    en: 'Latest Posts',
    vi: 'Bài viết mới nhất'
  },
  noPosts: {
    en: 'No posts found.',
    vi: 'Không tìm thấy bài viết nào.'
  },
  copyright: {
    en: 'All rights reserved.',
    vi: 'Đã đăng ký bản quyền.'
  },
  // Navigation
  nav_blog: {
    en: 'Blog',
    vi: 'Blog'
  },
  nav_books: {
    en: 'Books',
    vi: 'Sách'
  },
  nav_movies: {
    en: 'Movies',
    vi: 'Phim'
  },
  nav_study: {
    en: 'Study',
    vi: 'Học tập'
  },
  nav_ai: {
    en: 'AI',
    vi: 'AI'
  },
  nav_diary: {
    en: 'Daily Diary',
    vi: 'Nhật kí'
  },
  nav_finance: {
    en: 'Finance',
    vi: 'Tài chính'
  },
  // Bio Section – one block per language (paragraphs separated by double newline)
  bio: {
    en: '',
    vi: '',
  },
};
export function LanguageProvider({
  children,
  bioFromApi,
}: {
  children: ReactNode;
  bioFromApi?: Record<string, { en: string; vi: string }>;
}) {
  const [language, setLanguage] = useState<Language>('vi'); // Default to Vietnamese
  const [translations, setTranslations] = useState(initialTranslations);

  // Merge bio from API into translations when loaded
  useEffect(() => {
    if (bioFromApi && Object.keys(bioFromApi).length > 0) {
      setTranslations((prev) => ({ ...prev, ...bioFromApi }));
    }
  }, [bioFromApi]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };
  const updateTranslations = (newTranslations: Record<string, {
    en: string;
    vi: string;
  }>) => {
    setTranslations((prev) => ({ ...prev, ...newTranslations }));
  };
  return <LanguageContext.Provider value={{
    language,
    setLanguage,
    t,
    translations,
    updateTranslations
  }}>
      {children}
    </LanguageContext.Provider>;
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}