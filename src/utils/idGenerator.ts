import { v4 as uuidv4 } from 'uuid';

export const generateUserId = (): string => {
  return `USER${uuidv4().slice(0, 8)}`;
};

export const generateLoanRequestId = (): string => {
  return `LR${Date.now().toString(36).toUpperCase()}`;
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};