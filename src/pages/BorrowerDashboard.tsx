import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, History, LogOut, Plus, Menu, X, Star, Check, XCircle, TrendingUp, ArrowRight, ChevronRight, ChevronDown, ArrowUpRight, ArrowDownRight, Wallet, Clock, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';
import toast from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Mock lender requests data
const mockLenderRequests = [
  {
    id: '1',
    lenderName: 'John Smith',
    trustScore: 95,
    interestRate: 1.5,
    amount: 50000,
    tenure: 12,
    status: 'pending',
  },
  {
    id: '2',
    lenderName: 'Sarah Johnson',
    trustScore: 98,
    interestRate: 1.2,
    amount: 75000,
    tenure: 24,
    status: 'pending',
  },
];

function BorrowerDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showActiveLoans, setShowActiveLoans] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [trustScore] = useState(85); // Mock trust score
  const [activeTab, setActiveTab] = useState('overview');

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      loanId: 'L001',
      lenderId: 'L123',
      borrowerId: 'B456',
      amount: 10000,
      type: 'disbursement',
      date: new Date('2024-01-15T10:00:00'),
    },
    {
      id: '2',
      loanId: 'L001',
      lenderId: 'L123',
      borrowerId: 'B456',
      amount: 2000,
      type: 'repayment',
      date: new Date('2024-02-01T15:30:00'),
    },
  ];

  // Mock active loans data
  const activeLoans = [
    {
      id: '1',
      lenderName: 'John Smith',
      amount: 50000,
      interestRate: 1.5,
      tenure: 12,
      startDate: '2024-01-15',
      nextPayment: '2024-04-15',
      status: 'active'
    },
    {
      id: '2',
      lenderName: 'Sarah Johnson',
      amount: 75000,
      interestRate: 1.2,
      tenure: 24,
      startDate: '2024-02-01',
      nextPayment: '2024-05-01',
      status: 'active'
    }
  ];

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleTransactionClick = () => {
    setShowTransactionHistory(true);
    setShowMenu(false);
  };

  const handleLogout = () => {
    toast.success(t('logoutSuccess'));
    navigate('/');
  };

  const handleNewLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle new loan request logic here
    toast.success(t('loanRequestSubmitted'));
    setShowNewLoanModal(false);
    setIsEmergency(false); // Reset emergency state after submission
  };

  const handleAcceptProposal = (proposalId: string) => {
    // Handle accept proposal logic here
    toast.success(t('proposalAccepted'));
  };

  const handleRejectProposal = (proposalId: string) => {
    // Handle reject proposal logic here
    toast.success(t('proposalRejected'));
  };

  const handleActiveLoansClick = () => {
    setShowActiveLoans(true);
    setActiveTab('loans');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-xl">
                <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('borrowerDashboard')}</h1>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('trustScore')}: {trustScore}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Emergency Button */}
              <button
                onClick={() => setIsEmergency(!isEmergency)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  isEmergency 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-400'
                }`}
              >
                <AlertCircle className="h-5 w-5" />
                <span>{isEmergency ? t('emergencyActive') : t('emergencyButton')}</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 animate-fadeIn">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-5 w-5 mr-2" />
                      {t('profile')}
                    </button>
                    <button
                      onClick={handleTransactionClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <History className="h-5 w-5 mr-2" />
                      {t('transactionHistory')}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('requestNewLoan')}</h3>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t('requestNewLoanDescription')}</p>
            <button
              onClick={() => setShowNewLoanModal(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('requestNewLoan')}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('activeLoans')}</h3>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t('activeLoansDescription')}</p>
            <button
              onClick={handleActiveLoansClick}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('viewLoans')}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('transactionHistory')}</h3>
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <History className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t('transactionHistoryDescription')}</p>
            <button
              onClick={() => setShowTransactionHistory(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('viewHistory')}
            </button>
          </div>
        </div>

        {/* Lender Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('lenderRequests')}</h2>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">{t('pendingRequests')}</span>
            </div>
          </div>
          <div className="space-y-4">
            {mockLenderRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                      <Star className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{request.lenderName}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{t('trustScore')}:</span>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                          {request.trustScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₹{request.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {request.interestRate}% {t('interestRate')}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {request.tenure} {t('months')}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptProposal(request.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRejectProposal(request.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('recentActivity')}</h2>
          <div className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'disbursement' 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-blue-100 dark:bg-blue-900'
                    }`}>
                      {transaction.type === 'disbursement' ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600 dark:text-green-300" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {transaction.type === 'disbursement' ? t('loanDisbursed') : t('repaymentMade')}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {transaction.date.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${
                      transaction.type === 'disbursement' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {transaction.type === 'disbursement' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {t('loanId')}: {transaction.loanId}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* New Loan Modal */}
      {showNewLoanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-95 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEmergency ? t('emergencyLoanRequest') : t('requestNewLoan')}
              </h2>
              <button
                onClick={() => setShowNewLoanModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            {isEmergency && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{t('emergencyNotice')}</span>
                </div>
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {t('emergencyDescription')}
                </p>
              </div>
            )}
            <form onSubmit={handleNewLoanSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('loanAmount')}
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={t('enterAmount')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('tenure')}
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="3">3 {t('months')}</option>
                  <option value="6">6 {t('months')}</option>
                  <option value="12">12 {t('months')}</option>
                  <option value="24">24 {t('months')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('purpose')}
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder={t('enterPurpose')}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('submitRequest')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {showTransactionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-6 transform transition-all duration-300 scale-95 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('transactionHistory')}</h2>
              <button
                onClick={() => setShowTransactionHistory(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'disbursement' 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        {transaction.type === 'disbursement' ? (
                          <ArrowDownRight className="h-5 w-5 text-green-600 dark:text-green-300" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {transaction.type === 'disbursement' ? t('loanDisbursed') : t('repaymentMade')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {transaction.date.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        transaction.type === 'disbursement' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {transaction.type === 'disbursement' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('loanId')}: {transaction.loanId}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Loans Modal */}
      {showActiveLoans && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-6 transform transition-all duration-300 scale-95 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('activeLoans')}</h2>
              <button
                onClick={() => setShowActiveLoans(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{loan.lenderName}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{t('interestRate')}:</span>
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {loan.interestRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₹{loan.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('nextPayment')}: {new Date(loan.nextPayment).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {t('startDate')}: {new Date(loan.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {t('status')}: {loan.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BorrowerDashboard;