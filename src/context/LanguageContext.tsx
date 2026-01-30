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
  // Bio Section
  bio1: {
    en: "I'm Chip Huyen, a writer and computer scientist. I grew up chasing grasshoppers in a small rice-farming village in Vietnam.",
    vi: 'Tôi là Chip Huyen, một nhà văn và nhà khoa học máy tính. Tôi lớn lên với việc đuổi bắt châu chấu tại một ngôi làng trồng lúa nhỏ ở Việt Nam.'
  },
  bio2: {
    en: "My focus is on ML/AI systems in production. I'm currently exploring creative use cases of AI in education and entertainment.",
    vi: 'Trọng tâm của tôi là các hệ thống ML/AI trong sản xuất. Hiện tôi đang khám phá các trường hợp sử dụng sáng tạo của AI trong giáo dục và giải trí.'
  },
  // Bio 3
  bio3_1: {
    en: 'Previously, I worked on ML tooling at NVIDIA (core dev of ',
    vi: 'Trước đây, tôi làm việc về công cụ ML tại NVIDIA (nhà phát triển cốt lõi của '
  },
  bio3_2: {
    en: '), Snorkel AI, and Netflix. I also founded and sold an AI infra startup.',
    vi: '), Snorkel AI và Netflix. Tôi cũng đã thành lập và bán một công ty khởi nghiệp về hạ tầng AI.'
  },
  // Bio 4
  bio4_1: {
    en: "Running a startup taught me that being a founder is incredibly hard, so I try to support founders in any way I can. Some startups I've worked with included ",
    vi: 'Việc điều hành một công ty khởi nghiệp đã dạy tôi rằng làm người sáng lập cực kỳ khó khăn, vì vậy tôi cố gắng hỗ trợ các nhà sáng lập bằng mọi cách có thể. Một số startup tôi đã làm việc cùng bao gồm '
  },
  bio4_comma: {
    en: ', ',
    vi: ', '
  },
  bio4_and: {
    en: ', and ',
    vi: ' và '
  },
  bio4_end: {
    en: '.',
    vi: '.'
  },
  // Bio 5
  bio5_1: {
    en: 'I graduated from Stanford, where I taught ',
    vi: 'Tôi tốt nghiệp Stanford, nơi tôi đã dạy '
  },
  bio5_link1: {
    en: 'ML Systems',
    vi: 'Hệ thống ML'
  },
  bio5_2: {
    en: '. The lectures became the foundation for the book ',
    vi: '. Các bài giảng đã trở thành nền tảng cho cuốn sách '
  },
  bio5_link2: {
    en: 'Designing Machine Learning Systems',
    vi: 'Thiết kế Hệ thống Học máy'
  },
  bio5_3: {
    en: ', which is an Amazon #1 bestseller in AI and has been translated into 10+ languages (very proud)!',
    vi: ', là cuốn sách bán chạy số 1 trên Amazon về AI và đã được dịch sang hơn 10 ngôn ngữ (rất tự hào)!'
  },
  // Bio 6
  bio6_1: {
    en: 'My new book ',
    vi: 'Cuốn sách mới của tôi '
  },
  bio6_strong: {
    en: 'AI Engineering',
    vi: 'Kỹ thuật AI'
  },
  bio6_2: {
    en: ' (2025) is currently the most read book on the ',
    vi: ' (2025) hiện là cuốn sách được đọc nhiều nhất trên nền tảng '
  },
  bio6_3: {
    en: " platform. It's also available on ",
    vi: '. Nó cũng có sẵn trên '
  },
  bio6_4: {
    en: ' and ',
    vi: ' và '
  },
  bio6_5: {
    en: '.',
    vi: '.'
  },
  // Bio 7
  bio7_1: {
    en: "I'm active on ",
    vi: 'Tôi hoạt động tích cực trên '
  },
  bio7_2: {
    en: ' and aspire to become a ',
    vi: ' và khao khát trở thành một người có ảnh hưởng trên '
  },
  bio7_3: {
    en: ' influencer. You can also find me on ',
    vi: '. Bạn cũng có thể tìm thấy tôi trên '
  },
  bio7_4: {
    en: '. I frequently speak at and occasionally host ',
    vi: '. Tôi thường xuyên phát biểu tại và thỉnh thoảng tổ chức các '
  },
  bio7_link_events: {
    en: 'events',
    vi: 'sự kiện'
  },
  bio7_5: {
    en: '.',
    vi: '.'
  },
  // Bio 8
  bio8_1: {
    en: 'I enjoy learning about fun technical challenges and collaborating with great teams. ',
    vi: 'Tôi thích tìm hiểu về những thách thức kỹ thuật thú vị và hợp tác với các đội ngũ tuyệt vời. '
  },
  bio8_link: {
    en: 'Reach out',
    vi: 'Hãy liên hệ'
  },
  bio8_2: {
    en: ' if you want to find a way to work together!',
    vi: ' nếu bạn muốn tìm cách làm việc cùng nhau!'
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
    setTranslations(newTranslations);
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