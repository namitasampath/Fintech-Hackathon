export type UserType = 'lender' | 'borrower';
export type Language = 'en' | 'hi' | 'kn' | 'ml' | 'ta' | 'bn';

export interface User {
  id: string;
  username: string;
  type: UserType;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  age: number;
  trustScore: number;
  dateJoined: Date;
}

export interface Borrower extends User {
  loanAmount: number;
  tenure: number;
  purpose: string;
  activeLoans: LoanRequest[];
  pastLoans: LoanRequest[];
}

export interface Lender extends User {
  interestRate: number;
  availableAmount: number;
  activeProposals: LoanProposal[];
  pastProposals: LoanProposal[];
}

export interface LoanRequest {
  id: string;
  borrowerId: string;
  amount: number;
  purpose: string;
  tenure: number;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  dateCreated: Date;
}

export interface LoanProposal {
  id: string;
  lenderId: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  tenure: number;
  status: 'pending' | 'accepted' | 'rejected';
  dateCreated: Date;
}

export interface Transaction {
  id: string;
  loanId: string;
  lenderId: string;
  borrowerId: string;
  amount: number;
  type: 'disbursement' | 'repayment';
  date: Date;
}