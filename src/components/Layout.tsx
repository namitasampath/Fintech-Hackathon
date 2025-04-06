import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <nav className="bg-white dark:bg-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                LendConnect
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/"
                  className="nav-link px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('home')}
                </Link>
                <Link
                  to="/signup"
                  className="nav-link px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('signUp')}
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 