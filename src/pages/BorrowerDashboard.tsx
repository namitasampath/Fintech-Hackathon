import React, { useState } from 'react';
import { Menu, Bell, User, History, LogOut } from 'lucide-react';

const mockProposals = [
  {
    id: '1',
    lenderName: 'John Smith',
    trustScore: 95,
    interestRate: 1.5,
    amount: 50000,
    tenure: 12,
  },
  {
    id: '2',
    lenderName: 'Sarah Johnson',
    trustScore: 98,
    interestRate: 1.2,
    amount: 75000,
    tenure: 24,
  },
];

function BorrowerDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <Menu size={24} />
              </button>
              <span className="ml-4 text-xl font-semibold text-gray-900">
                Borrower Dashboard
              </span>
            </div>
            <div className="flex items-center">
              <button className="p-2">
                <Bell size={24} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-50">
            <div className="p-6">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-purple-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">John Doe</h2>
                  <p className="text-sm text-gray-500">Borrower</p>
                </div>
              </div>
              <nav className="space-y-2">
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-md">
                  <User size={20} className="mr-3" />
                  Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-md">
                  <History size={20} className="mr-3" />
                  Transaction History
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-md">
                  <LogOut size={20} className="mr-3" />
                  Logout
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6">
            {mockProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {proposal.lenderName}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        Trust Score: {proposal.trustScore}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Interest Rate: {proposal.interestRate}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Amount: ${proposal.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tenure: {proposal.tenure} months
                      </p>
                    </div>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    Accept Proposal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BorrowerDashboard;