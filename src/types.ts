// types.ts - Type definitions for P2P lending platform

export type UserType = 'lender' | 'borrower';

export type TransactionType = 'deposit' | 'withdrawal' | 'loan' | 'repayment' | 'interest';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface User {
  id: string;
  type: UserType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  trustScore: number;
  profilePicture?: string;
  accountCreated: string; // ISO date string
  accountBalance: number;
}

export interface Borrower extends User {
  loanAmount: number;
  tenure: number;
  purpose: string;
  creditScore: number;
  activeLoans: LoanAgreement[];
}

export interface Lender extends User {
  interestRate: number;
  availableAmount: number;
  totalLent: number;
  activeInvestments: LoanAgreement[];
}

export interface LoanProposal {
  id: string;
  lenderId: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  tenure: number; // in months
  purpose: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface LoanAgreement {
  id: string;
  proposalId: string;
  lenderId: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  tenure: number; // in months
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'active' | 'completed' | 'defaulted';
  remainingAmount: number;
  nextPaymentDue: string; // ISO date string
  nextPaymentAmount: number;
}

export interface Transaction {
  id: string;
  userId: string;
  date: string; // ISO date string
  description: string;
  amount: number; // Positive for incoming, negative for outgoing
  type: TransactionType;
  status: TransactionStatus;
  relatedLoanId?: string; // Reference to loan if applicable
  recipient?: string; // ID of recipient if applicable
  sender?: string; // ID of sender if applicable
}

export interface PaymentSchedule {
  id: string;
  loanId: string;
  dueDate: string; // ISO date string
  amount: number;
  status: 'upcoming' | 'paid' | 'overdue';
  paidDate?: string; // ISO date string
  transactionId?: string; // ID of transaction when paid
}

export interface UserProfile {
  user: User;
  stats: {
    totalLoansIssued?: number; // For lenders
    totalInterestEarned?: number; // For lenders
    totalLoansReceived?: number; // For borrowers
    totalInterestPaid?: number; // For borrowers
    onTimePaymentRate?: number; // For borrowers
    averageInterestRate?: number; // For both
  };
  kycVerified: boolean;
  bankAccountVerified: boolean;
}