import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    // Determine the current language, default to 'ar' if undefined or starting with 'ar'
    const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'ar';
    const newLang = currentLang === 'ar' ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const isAr = !i18n.language?.startsWith('fr');

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100/80 rounded-full hover:bg-slate-200 transition-all shadow-sm ring-1 ring-slate-200 hover:scale-105"
      aria-label="Toggle language"
    >
      <Globe size={18} className="text-primary" />
      <span>{isAr ? 'FR' : 'عربي'}</span>
    </button>
  );
};
