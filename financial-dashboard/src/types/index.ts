// Account types supported in the dashboard
export type AccountType = 
  | 'checking'
  | 'savings'
  | 'credit_card'
  | 'revolving_credit'
  | 'loan'
  | 'investment';

// ESPP Loan for "Hey Sparty" tracking
export interface ESPPLoan {
  id: string;
  pullDate: string;
  pullAmount: number;
  interestRate: number; // Annual percentage rate
  interestAmount: number; // Total interest charged for this pull
  quarter: string; // e.g., "Q1 2024"
  purchaseDate: string; // When stocks are purchased
  sharesPurchased: number;
  purchasePrice: number;
  salePrice?: number; // Optional: if sold immediately
  fees: number; // Transaction fees
  profit: number; // Net profit after interest and fees
  status: 'pending' | 'purchased' | 'sold' | 'paid_off';
  notes?: string;
}

// ESPP Offering Period
export interface ESPPOffering {
  id: string;
  companyName: string;
  tickerSymbol: string;
  discountPercent: number; // Employee discount percentage
  lookbackPeriod: boolean; // Whether it has lookback provision
  offeringStartDate: string;
  offeringEndDate: string;
  purchaseDate: string;
  maxContributionPercent: number; // Maximum % of salary that can be contributed
  totalContributed: number; // Total amount contributed this period
  estimatedShares: number;
  estimatedProfit: number;
}

// Account interface
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution: string;
  lastUpdated: string;
  color?: string;
}

// Investment transaction for history tracking
export interface InvestmentTransaction {
  id: string;
  accountId: string;
  date: string;
  type: 'buy' | 'sell' | 'dividend' | 'transfer';
  symbol: string;
  quantity: number;
  price: number;
  totalValue: number;
  fees?: number;
  notes?: string;
}

// Portfolio holding
export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

// Dashboard summary data
export interface DashboardSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  accountsByType: Record<AccountType, number>;
  recentTransactions: InvestmentTransaction[];
}

// Google Sheets row data structure
export interface SheetRowData {
  timestamp: string;
  accountName: string;
  accountType: string;
  balance: number;
  institution: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
