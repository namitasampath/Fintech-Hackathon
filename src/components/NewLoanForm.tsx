import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { generateLoanRequestId } from '../utils/idGenerator';

interface NewLoanFormProps {
  type: 'lender' | 'borrower';
  onSubmit: (data: any) => void;
}

export function NewLoanForm({ type, onSubmit }: NewLoanFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    amount: '',
    tenure: '',
    purpose: '',
    interestRate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      id: generateLoanRequestId(),
      dateCreated: new Date(),
      status: 'pending',
    };
    onSubmit(data);
    toast.success(t('loanRequestSubmitted'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('amount')}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₹</span>
          </div>
          <input
            type="number"
            required
            min={1000}
            className="pl-7 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('tenure')} ({t('months')})
        </label>
        <input
          type="number"
          required
          min={1}
          max={60}
          className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          value={formData.tenure}
          onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
        />
      </div>

      {type === 'borrower' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('purpose')}
          </label>
          <textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            rows={3}
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          />
        </div>
      )}

      {type === 'lender' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('interestRate')} (%)
          </label>
          <input
            type="number"
            required
            step="0.1"
            min={1}
            max={2}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            value={formData.interestRate}
            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        {t('submit')}
      </button>
    </form>
  );
}