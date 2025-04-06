import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Coins, Shield, Clock, TrendingUp } from 'lucide-react';
import Bubbles from '../components/Bubbles';
import LanguageSwitcher from '../components/LanguageSwitcher';

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-zinc-50 to-emerald-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-emerald-900 relative overflow-hidden font-sans">
      {/* Animated background bubbles */}
      <Bubbles />

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Coins className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mr-4" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-zinc-900 dark:text-zinc-100 animate-fadeIn">
              LendConnect
            </h1>
          </div>
          <p className="text-xl text-zinc-600 dark:text-zinc-300 mb-12 max-w-3xl mx-auto animate-fadeInUp">
            {t('homeDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Borrower Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 animate-fadeInLeft hover:shadow-xl flex flex-col">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {t('borrower')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6 flex-grow">
              {t('borrowerDescription')}
            </p>
            <button
              onClick={() => navigate('/signup?type=borrower')}
              className="btn-primary w-full group flex items-center justify-center py-3 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Lender Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 animate-fadeInRight hover:shadow-xl flex flex-col">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              {t('lender')}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 mb-6 flex-grow">
              {t('lenderDescription')}
            </p>
            <button
              onClick={() => navigate('/signup?type=lender')}
              className="btn-primary w-full group flex items-center justify-center py-3 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fadeInUp delay-100 hover:shadow-xl">
            <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {t('fastProcessing')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              {t('fastProcessingDescription')}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fadeInUp delay-200 hover:shadow-xl">
            <div className="h-12 w-12 bg-violet-100 dark:bg-violet-900 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {t('secureTransactions')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              {t('secureTransactionsDescription')}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fadeInUp delay-300 hover:shadow-xl">
            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {t('trustScore')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300">
              {t('trustScoreDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;