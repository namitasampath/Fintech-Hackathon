import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'loan' | 'repayment' | 'interest';
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  sender?: string;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch transaction history
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        // Mock data - replace with actual API call
        const mockTransactions: Transaction[] = [
          {
            id: 'TRX123456',
            date: '2025-03-28T14:30:00Z',
            description: 'Loan disbursement',
            amount: 5000,
            type: 'loan',
            status: 'completed',
            sender: 'LenderID-12345'
          },
          {
            id: 'TRX123457',
            date: '2025-03-15T09:45:00Z',
            description: 'Monthly loan repayment',
            amount: -350,
            type: 'repayment',
            status: 'completed',
            recipient: 'LenderID-12345'
          },
          {
            id: 'TRX123458',
            date: '2025-03-01T12:00:00Z',
            description: 'Interest payment',
            amount: -37.50,
            type: 'interest',
            status: 'completed',
            recipient: 'LenderID-12345'
          },
          {
            id: 'TRX123459',
            date: '2025-02-28T16:15:00Z',
            description: 'Deposit to account',
            amount: 1000,
            type: 'deposit',
            status: 'completed'
          },
          {
            id: 'TRX123460',
            date: '2025-02-15T11:30:00Z',
            description: 'Monthly loan repayment',
            amount: -350,
            type: 'repayment',
            status: 'completed',
            recipient: 'LenderID-12345'
          },
          {
            id: 'TRX123461',
            date: '2025-04-01T10:00:00Z',
            description: 'Upcoming loan repayment',
            amount: -350,
            type: 'repayment',
            status: 'pending',
            recipient: 'LenderID-12345'
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setTransactions(mockTransactions);
          setIsLoading(false);
        }, 800);

        // Uncomment for real API implementation
        // const response = await fetch('/api/transactions');
        // if (!response.ok) throw new Error('Failed to fetch transactions');
        // const data = await response.json();
        // setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIconClass = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-green-500';
      case 'withdrawal':
        return 'text-red-500';
      case 'loan':
        return 'text-blue-500';
      case 'repayment':
        return 'text-purple-500';
      case 'interest':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back to Profile
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Type
              </label>
              <select
                id="filter"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="all">All Transactions</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="loan">Loans</option>
                <option value="repayment">Repayments</option>
                <option value="interest">Interest</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <button
                onClick={toggleSortOrder}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                Date: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Loans</h3>
                <div className="text-xl font-bold text-blue-600">$5,000.00</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Repayments</h3>
                <div className="text-xl font-bold text-purple-600">$1,087.50</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Current Balance</h3>
                <div className="text-xl font-bold text-gray-800">$4,912.50</div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : sortedTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found for the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Transaction ID</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4">
                        {transaction.description}
                      </td>
                      <td className={`px-6 py-4 font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`capitalize ${getTypeIconClass(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          className="font-medium text-blue-600 hover:underline"
                          onClick={() => alert(`View details for ${transaction.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4">
          <p className="text-sm text-gray-500">
            Showing {sortedTransactions.length} of {transactions.length} transactions
          </p>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Payments</h2>
        {transactions.filter(t => t.status === 'pending').length === 0 ? (
          <p className="text-gray-500">No upcoming payments scheduled.</p>
        ) : (
          <div className="space-y-4">
            {transactions
              .filter(t => t.status === 'pending')
              .map(payment => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{payment.description}</h3>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">${Math.abs(payment.amount).toFixed(2)}</p>
                      <button className="mt-2 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;