import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/Button';
export function LanguageToggle() {
  const {
    language,
    setLanguage
  } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };
  return <Button variant="ghost" size="sm" onClick={toggleLanguage} className="flex items-center gap-2" aria-label="Switch language">
      <Globe className="h-4 w-4" />
      <span className="font-semibold uppercase">{language}</span>
    </Button>;
}