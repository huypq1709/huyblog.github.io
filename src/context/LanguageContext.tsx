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
    en: `I'm Chip Huyen, a writer and computer scientist. I grew up chasing grasshoppers in a small rice-farming village in Vietnam.

My focus is on ML/AI systems in production. I'm currently exploring creative use cases of AI in education and entertainment.

Previously, I worked on ML tooling at NVIDIA (core dev of NeMo), Snorkel AI, and Netflix. I also founded and sold an AI infra startup.

Running a startup taught me that being a founder is incredibly hard, so I try to support founders in any way I can. Some startups I've worked with included Convai, OctoAI, and Photoroom.

I graduated from Stanford, where I taught ML Systems. The lectures became the foundation for the book Designing Machine Learning Systems, which is an Amazon #1 bestseller in AI and has been translated into 10+ languages (very proud)!

My new book AI Engineering (2025) is currently the most read book on the O'Reilly platform. It's also available on Amazon and Kindle.

I'm active on GitHub and aspire to become a Goodreads influencer. You can also find me on Google Scholar. I frequently speak at and occasionally host events.

I enjoy learning about fun technical challenges and collaborating with great teams. Reach out if you want to find a way to work together!`,
    vi: `Tôi là Chip Huyen, một nhà văn và nhà khoa học máy tính. Tôi lớn lên với việc đuổi bắt châu chấu tại một ngôi làng trồng lúa nhỏ ở Việt Nam.

Trọng tâm của tôi là các hệ thống ML/AI trong sản xuất. Hiện tôi đang khám phá các trường hợp sử dụng sáng tạo của AI trong giáo dục và giải trí.

Trước đây, tôi làm việc về công cụ ML tại NVIDIA (nhà phát triển cốt lõi của NeMo), Snorkel AI và Netflix. Tôi cũng đã thành lập và bán một công ty khởi nghiệp về hạ tầng AI.

Việc điều hành một công ty khởi nghiệp đã dạy tôi rằng làm người sáng lập cực kỳ khó khăn, vì vậy tôi cố gắng hỗ trợ các nhà sáng lập bằng mọi cách có thể. Một số startup tôi đã làm việc cùng bao gồm Convai, OctoAI và Photoroom.

Tôi tốt nghiệp Stanford, nơi tôi đã dạy Hệ thống ML. Các bài giảng đã trở thành nền tảng cho cuốn sách Thiết kế Hệ thống Học máy, là cuốn sách bán chạy số 1 trên Amazon về AI và đã được dịch sang hơn 10 ngôn ngữ (rất tự hào)!

Cuốn sách mới của tôi Kỹ thuật AI (2025) hiện là cuốn sách được đọc nhiều nhất trên nền tảng O'Reilly. Nó cũng có sẵn trên Amazon và Kindle.

Tôi hoạt động tích cực trên GitHub và khao khát trở thành người có ảnh hưởng trên Goodreads. Bạn cũng có thể tìm thấy tôi trên Google Scholar. Tôi thường xuyên phát biểu tại và thỉnh thoảng tổ chức các sự kiện.

Tôi thích tìm hiểu về những thách thức kỹ thuật thú vị và hợp tác với các đội ngũ tuyệt vời. Hãy liên hệ nếu bạn muốn tìm cách làm việc cùng nhau!`
  }
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