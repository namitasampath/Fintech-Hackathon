import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Phone, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserType } from '../types';
import { generateUserId } from '../utils/idGenerator';
import { LanguageSelector } from '../components/LanguageSelector';
import toast from 'react-hot-toast';

function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userType, setUserType] = useState<UserType>('borrower');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    age: '',
    proofOfAddress: null as File | null,
    ageProof: null as File | null,
    panCard: null as File | null,
  });
  const [previewUrls, setPreviewUrls] = useState({
    proofOfAddress: '',
    ageProof: '',
  });
  const [loading, setLoading] = useState(false);

  const fileInputRefs = {
    proofOfAddress: useRef<HTMLInputElement>(null),
    ageProof: useRef<HTMLInputElement>(null),
    panCard: useRef<HTMLInputElement>(null),
  };

  const handleFileChange = (field: 'proofOfAddress' | 'ageProof' | 'panCard', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, [field]: file }));

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrls(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (field: 'proofOfAddress' | 'ageProof' | 'panCard') => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setPreviewUrls(prev => ({ ...prev, [field]: '' }));
    if (fileInputRefs[field].current) {
      fileInputRefs[field].current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('signupSuccess'));
      navigate('/login');
    } catch (error) {
      toast.error(t('signupError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg">
        <div className="space-y-4">
          <h2 className="text-center text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t('signUp')}
          </h2>
          <div className="mt-6">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
              {t('language')}
            </label>
            <LanguageSelector />
          </div>
        </div>
        
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 py-3 px-4 rounded-lg text-base font-medium tracking-wide transition-all duration-200 ${
                  userType === 'borrower'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                }`}
                onClick={() => setUserType('borrower')}
              >
                {t('borrower')}
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 rounded-lg text-base font-medium tracking-wide transition-all duration-200 ${
                  userType === 'lender'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                }`}
                onClick={() => setUserType('lender')}
              >
                {t('lender')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
                  {t('firstName')}
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:text-zinc-100 text-base tracking-wide"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
                  {t('lastName')}
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:text-zinc-100 text-base tracking-wide"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
                {t('phoneNumber')}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="tel"
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:text-zinc-100 text-base tracking-wide"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 1234567890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
                {t('address')}
              </label>
              <textarea
                required
                className="mt-1 block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:text-zinc-100 text-base tracking-wide"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
                {t('age')}
              </label>
              <input
                type="number"
                required
                min="18"
                className="mt-1 block w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:text-zinc-100 text-base tracking-wide"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
                {t('panCard')}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRefs.panCard}
                  onChange={(e) => handleFileChange('panCard', e)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.panCard.current?.click()}
                  className="btn-outline flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium tracking-wide"
                >
                  <Upload className="h-5 w-5" />
                  <span>{t('uploadFile')}</span>
                </button>
                {formData.panCard && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                      {formData.panCard.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile('panCard')}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 tracking-wide">
                {t('ageProof')}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRefs.ageProof}
                  onChange={(e) => handleFileChange('ageProof', e)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRefs.ageProof.current?.click()}
                  className="btn-outline flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium tracking-wide"
                >
                  <Upload className="h-5 w-5" />
                  <span>{t('uploadFile')}</span>
                </button>
                {formData.ageProof && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                      {formData.ageProof.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile('ageProof')}
                      className="text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-base tracking-wide"
            disabled={loading}
          >
            {loading ? t('signingUp') : t('submit')}
          </button>

          {/* Already have an account link */}
          <div className="text-center pt-6">
            <p className="text-zinc-600 dark:text-zinc-300 text-base tracking-wide">
              {t('alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold inline-flex items-center transition-colors duration-200"
              >
                {t('login')} <ArrowRight className="h-5 w-5 ml-1" />
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;