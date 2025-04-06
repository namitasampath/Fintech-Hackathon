import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Bubbles from '../components/Bubbles';

// Mock phone service for testing
const mockPhoneService = {
  sendOtp: async (phone: string) => {
    console.log(`Sending OTP to ${phone}`);
    return { success: true };
  },
  verifyOtp: async (phone: string, otp: string) => {
    return otp === '123456'; // Mock verification
  },
};

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    userType: 'borrower' as 'borrower' | 'lender',
  });
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      toast.error(t('phoneRequired'));
      return;
    }

    setLoading(true);
    try {
      await mockPhoneService.sendOtp(formData.phone);
      setStep('otp');
      toast.success(t('otpSentMessage') + ' ' + formData.phone);
    } catch (error) {
      toast.error(t('otpSendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error(t('otpRequired'));
      return;
    }

    setLoading(true);
    try {
      const isValid = await mockPhoneService.verifyOtp(formData.phone, formData.otp);
      if (isValid) {
        toast.success(t('loginSuccess'));
        // Redirect based on user type
        navigate(`/dashboard/${formData.userType}`);
      } else {
        toast.error(t('invalidOtp'));
      }
    } catch (error) {
      toast.error(t('verificationError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Bubbles />
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg relative z-10">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
            {t('login')}
          </h2>
        </div>

        {step === 'credentials' ? (
          <form className="mt-8 space-y-6" onSubmit={handleCredentialsSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t('phoneNumber')}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:text-zinc-100"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 1234567890"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    formData.userType === 'borrower'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'borrower' }))}
                >
                  {t('borrower')}
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    formData.userType === 'lender'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'lender' }))}
                >
                  {t('lender')}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? t('sendingOtp') : t('getOtp')}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('enterOtp')}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-zinc-700 dark:text-zinc-100"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                {t('back')}
              </button>
              <button
                type="button"
                onClick={handleCredentialsSubmit}
                className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                {t('regenerateOtp')}
              </button>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? t('verifying') : t('verifyOtp')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;