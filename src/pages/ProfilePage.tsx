import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Phone, Calendar } from 'lucide-react';

function ProfilePage() {
  const { t } = useTranslation();

  // Mock user data - in a real app, this would come from an API or context
  const userData = {
    id: 'USER123456',
    name: 'John Doe',
    phone: '+91 9876543210',
    address: '123 Main Street, City, State',
    age: 30,
    userType: 'borrower',
    trustScore: 95,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
              <User size={40} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{userData.name}</h1>
              <p className="text-zinc-600 dark:text-zinc-400">{t('borrower')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="text-zinc-500 dark:text-zinc-400" />
              <span className="text-zinc-900 dark:text-zinc-100">{userData.id}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-zinc-500 dark:text-zinc-400" />
              <span className="text-zinc-900 dark:text-zinc-100">{userData.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-zinc-500 dark:text-zinc-400" />
              <span className="text-zinc-900 dark:text-zinc-100">{userData.address}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="text-zinc-500 dark:text-zinc-400" />
              <span className="text-zinc-900 dark:text-zinc-100">{userData.age} {t('years')}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{t('trustScore')}</h2>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2.5">
              <div 
                className="bg-emerald-600 h-2.5 rounded-full" 
                style={{ width: `${userData.trustScore}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {userData.trustScore}% {t('trustScore')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 