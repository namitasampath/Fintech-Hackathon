import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    otp: '',
  });

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, verify credentials and send OTP
    setStep('otp');
    toast.success('OTP sent to your phone');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, verify OTP
    // For demo, navigate to borrower dashboard
    navigate('/dashboard/borrower');
  };

  const regenerateOtp = () => {
    toast.success('New OTP sent to your phone');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {step === 'credentials' ? (
          <>
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Log in to your account
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleCredentialsSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Get OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Enter OTP
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We've sent a one-time password to your phone
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
              <div>
                <label htmlFor="otp" className="sr-only">OTP Code</label>
                <input
                  id="otp"
                  type="text"
                  required
                  className="block w-full px-4 py-3 text-center text-2xl tracking-widest rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  placeholder="000000"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={regenerateOtp}
                  className="text-sm text-purple-600 hover:text-purple-500"
                >
                  Regenerate OTP
                </button>
                <span className="text-sm text-gray-500">Valid for 1 minute</span>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;