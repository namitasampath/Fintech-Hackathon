import React from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/idGenerator';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t('date')}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t('type')}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t('amount')}
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {t('status')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {t(transaction.type)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatCurrency(transaction.amount)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  transaction.type === 'disbursement' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {t('completed')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}