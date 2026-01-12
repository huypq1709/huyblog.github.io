import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/Button';
import { AdminLoginPopup } from './AdminLoginPopup';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
interface HeaderProps {
  onHomeClick: () => void;
  onBlogClick: () => void;
  onAdminClick: () => void;
  onCategoryClick: (category: 'books' | 'movies' | 'study' | 'ai' | 'diary' | 'finance') => void;
  currentView: 'home' | 'blog' | 'post' | 'admin' | 'books' | 'movies' | 'study' | 'ai' | 'diary' | 'finance';
}
export function Header({
  onHomeClick,
  onBlogClick,
  onAdminClick,
  onCategoryClick,
  currentView
}: HeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const {
    t
  } = useLanguage();
  const {
    isAuthenticated,
    logout
  } = useAuth();
  const handleLogout = () => {
    logout();
    onHomeClick();
  };
  return <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b border-border/40">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <button onClick={onHomeClick} className="text-3xl font-serif hover:underline decoration-1 underline-offset-4 hover:text-blue-600 transition-colors">
            Blog's Huy
          </button>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center justify-center gap-6 text-base font-serif flex-1">
              <button onClick={onBlogClick} className={`whitespace-nowrap hover:text-blue-600 hover:underline underline-offset-4 transition-colors ${currentView === 'blog' || currentView === 'post' ? 'text-blue-600 font-medium' : ''}`}>
                {t('nav_blog')}
              </button>
              {['nav_books', 'nav_movies', 'nav_study', 'nav_ai', 'nav_diary', 'nav_finance'].map(key => {
                const categoryMapping: Record<string, 'books' | 'movies' | 'study' | 'ai' | 'diary' | 'finance'> = {
                  'nav_books': 'books',
                  'nav_movies': 'movies',
                  'nav_study': 'study',
                  'nav_ai': 'ai',
                  'nav_diary': 'diary',
                  'nav_finance': 'finance'
                };
                const categoryView = categoryMapping[key];
                const isActive = currentView === categoryView;
                return (
                  <button
                    key={key}
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryClick(categoryView);
                    }}
                    className={`whitespace-nowrap hover:text-blue-600 hover:underline underline-offset-4 transition-colors ${isActive ? 'text-blue-600 font-medium' : ''}`}
                  >
                    {t(key)}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 border-l border-border pl-6">
              {isAuthenticated ? <>
                  <Button variant={currentView === 'admin' ? 'primary' : 'ghost'} size="sm" onClick={onAdminClick} className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                    <LogOut className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </> : <Button variant="ghost" size="icon" aria-label="Admin Access" onClick={() => setIsLoginOpen(true)}>
                  <ShieldCheck className="h-[1.2rem] w-[1.2rem]" />
                </Button>}
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <AdminLoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLoginSuccess={onAdminClick} />
    </>;
}