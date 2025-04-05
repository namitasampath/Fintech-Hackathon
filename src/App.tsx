import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import BorrowerDashboard from './pages/BorrowerDashboard';
import LenderDashboard from './pages/LenderDashboard';
import Profile from './pages/Profile';
import TransactionHistory from './pages/TransactionHistory';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/borrower" element={<BorrowerDashboard />} />
        <Route path="/dashboard/lender" element={<LenderDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;