import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  History, 
  Plus, 
  ArrowRight, 
  Star, 
  Check, 
  XCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Clock,
  AlertCircle,
  Users,
  DollarSign,
  Percent,
  User
} from 'lucide-react';
import { Transaction } from '../types';
import toast from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Mock borrower requests data with emergency status
const mockBorrowerRequests = [
  {
    id: '1',
    borrowerName: 'Rahul Sharma',
    trustScore: 85,
    requestedAmount: 50000,
    requestedTenure: 12,
    purpose: 'Medical Emergency',
    status: 'pending',
    monthlyIncome: 75000,
    employmentType: 'Self-employed',
    isEmergency: true
  },
  {
    id: '2',
    borrowerName: 'Priya Patel',
    trustScore: 92,
    requestedAmount: 30000,
    requestedTenure: 6,
    purpose: 'Education',
    status: 'pending',
    monthlyIncome: 45000,
    employmentType: 'Salaried',
    isEmergency: false
  }
];

function LenderDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showActiveLoans, setShowActiveLoans] = useState(false);
  const [trustScore] = useState(92);
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
      borrowerName: 'Rahul Sharma',
      amount: 50000,
      interestRate: 1.5,
      tenure: 12,
      startDate: '2024-01-15',
      nextPayment: '2024-04-15',
      status: 'active'
    },
    {
      id: '2',
      borrowerName: 'Priya Patel',
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

  const handleAcceptRequest = (requestId: string) => {
    toast.success(t('requestAccepted'));
  };

  const handleRejectRequest = (requestId: string) => {
    toast.success(t('requestRejected'));
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
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('lenderDashboard')}</h1>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {t('trustScore')}: {trustScore}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('totalEarnings')}</h3>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{t('totalEarningsDescription')}</p>
            <button
              onClick={() => setShowTransactionHistory(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('viewEarnings')}
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

        {/* Borrower Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('borrowerRequests')}</h2>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">{t('pendingRequests')}</span>
            </div>
          </div>

          {/* Emergency Requests Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {t('emergencyRequests')}
            </h3>
            <div className="space-y-4">
              {mockBorrowerRequests
                .filter(request => request.isEmergency)
                .map((request) => (
                  <div
                    key={request.id}
                    className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 border border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{request.borrowerName}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{t('trustScore')}:</span>
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                              {request.trustScore}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          ₹{request.requestedAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.requestedTenure} {t('months')}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-400">
                          {request.purpose}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Regular Requests Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('regularRequests')}</h3>
            <div className="space-y-4">
              {mockBorrowerRequests
                .filter(request => !request.isEmergency)
                .map((request) => (
                  <div
                    key={request.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{request.borrowerName}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{t('trustScore')}:</span>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {request.trustScore}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          ₹{request.requestedAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.requestedTenure} {t('months')}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {request.purpose}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
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
                        {transaction.type === 'disbursement' ? t('loanDisbursed') : t('repaymentReceived')}
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
                      {transaction.type === 'disbursement' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
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
                          {transaction.type === 'disbursement' ? t('loanDisbursed') : t('repaymentReceived')}
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
                        {transaction.type === 'disbursement' ? '-' : '+'}₹{transaction.amount.toLocaleString()}
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
                        <h3 className="font-medium text-gray-900 dark:text-white">{loan.borrowerName}</h3>
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

export default LenderDashboard;