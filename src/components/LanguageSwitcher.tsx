import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative group">
        <button
          className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
        >
          <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
              {i18n.language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguageSwitcher; 