import axios from 'axios';
import { Account, InvestmentTransaction, ESPPLoan, ESPPOffering, ApiResponse, SheetRowData } from '../types';

// Google Apps Script Web App URL - Replace with your deployed URL
const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

/**
 * Service for communicating with Google Sheets via Google Apps Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste the code from /google-apps-script/code.gs
 * 4. Deploy as Web App (Deploy > New Deployment > Web App)
 * 5. Set "Who has access" to "Anyone"
 * 6. Copy the Web App URL and add it to your .env file as VITE_GOOGLE_APPS_SCRIPT_URL
 */

class GoogleSheetsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = GOOGLE_APPS_SCRIPT_URL;
  }

  /**
   * Fetch all account data from Google Sheets
   */
  async getAccounts(): Promise<Account[]> {
    if (!this.baseUrl) {
      console.warn('Google Apps Script URL not configured. Using mock data.');
      return this.getMockAccounts();
    }

    try {
      const response = await axios.get<ApiResponse<Account[]>>(this.baseUrl, {
        params: { action: 'getAccounts' }
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.error || 'Failed to fetch accounts');
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return this.getMockAccounts();
    }
  }

  /**
   * Fetch investment transaction history
   */
  async getInvestmentHistory(): Promise<InvestmentTransaction[]> {
    if (!this.baseUrl) {
      console.warn('Google Apps Script URL not configured. Using mock data.');
      return this.getMockInvestmentHistory();
    }

    try {
      const response = await axios.get<ApiResponse<InvestmentTransaction[]>>(this.baseUrl, {
        params: { action: 'getInvestmentHistory' }
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.error || 'Failed to fetch investment history');
    } catch (error) {
      console.error('Error fetching investment history:', error);
      return this.getMockInvestmentHistory();
    }
  }

  /**
   * Fetch ESPP loan data from Google Sheets
   */
  async getESPPData(): Promise<ESPPLoan[]> {
    if (!this.baseUrl) {
      console.warn('Google Apps Script URL not configured. Using mock data.');
      return this.getMockESPPData();
    }

    try {
      const response = await axios.get<ApiResponse<ESPPLoan[]>>(this.baseUrl, {
        params: { action: 'getESPPData' }
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.error || 'Failed to fetch ESPP data');
    } catch (error) {
      console.error('Error fetching ESPP data:', error);
      return this.getMockESPPData();
    }
  }

  /**
   * Fetch ESPP offering periods
   */
  async getESPPOfferings(): Promise<ESPPOffering[]> {
    if (!this.baseUrl) {
      console.warn('Google Apps Script URL not configured. Using mock data.');
      return this.getMockESPPOfferings();
    }

    try {
      const response = await axios.get<ApiResponse<ESPPOffering[]>>(this.baseUrl, {
        params: { action: 'getESPPOfferings' }
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.error || 'Failed to fetch ESPP offerings');
    } catch (error) {
      console.error('Error fetching ESPP offerings:', error);
      return this.getMockESPPOfferings();
    }
  }

  /**
   * Update account balance in Google Sheets
   */
  async updateAccountBalance(accountId: string, balance: number): Promise<boolean> {
    if (!this.baseUrl) {
      console.warn('Google Apps Script URL not configured.');
      return false;
    }

    try {
      const response = await axios.post<ApiResponse<boolean>>(this.baseUrl, {
        action: 'updateAccountBalance',
        accountId,
        balance
      });
      
      return response.data.success || false;
    } catch (error) {
      console.error('Error updating account balance:', error);
      return false;
    }
  }

  /**
   * Add investment transaction to Google Sheets
   */
  async addInvestmentTransaction(transaction: Omit<InvestmentTransaction, 'id'>): Promise<boolean> {
    if (!this.baseUrl) {
      console.warn('Google Apps Script URL not configured.');
      return false;
    }

    try {
      const response = await axios.post<ApiResponse<boolean>>(this.baseUrl, {
        action: 'addInvestmentTransaction',
        ...transaction
      });
      
      return response.data.success || false;
    } catch (error) {
      console.error('Error adding investment transaction:', error);
      return false;
    }
  }

  /**
   * Mock data for development/testing
   */
  private getMockAccounts(): Account[] {
    return [
      {
        id: '1',
        name: 'Main Checking',
        type: 'checking',
        balance: 5420.50,
        currency: 'USD',
        institution: 'Chase Bank',
        lastUpdated: new Date().toISOString(),
        color: '#3b82f6'
      },
      {
        id: '2',
        name: 'Emergency Savings',
        type: 'savings',
        balance: 25000.00,
        currency: 'USD',
        institution: 'Ally Bank',
        lastUpdated: new Date().toISOString(),
        color: '#10b981'
      },
      {
        id: '3',
        name: 'Visa Credit Card',
        type: 'credit_card',
        balance: -1250.75,
        currency: 'USD',
        institution: 'Chase Bank',
        lastUpdated: new Date().toISOString(),
        color: '#ef4444'
      },
      {
        id: '4',
        name: 'Home Equity Line',
        type: 'revolving_credit',
        balance: -15000.00,
        currency: 'USD',
        institution: 'Wells Fargo',
        lastUpdated: new Date().toISOString(),
        color: '#f59e0b'
      },
      {
        id: '5',
        name: 'Auto Loan',
        type: 'loan',
        balance: -18500.00,
        currency: 'USD',
        institution: 'Toyota Financial',
        lastUpdated: new Date().toISOString(),
        color: '#8b5cf6'
      },
      {
        id: '6',
        name: 'Investment Portfolio',
        type: 'investment',
        balance: 125000.00,
        currency: 'USD',
        institution: 'Fidelity',
        lastUpdated: new Date().toISOString(),
        color: '#06b6d4'
      }
    ];
  }

  private getMockInvestmentHistory(): InvestmentTransaction[] {
    return [
      {
        id: '1',
        accountId: '6',
        date: '2024-01-15',
        type: 'buy',
        symbol: 'VTI',
        quantity: 50,
        price: 220.50,
        totalValue: 11025.00,
        fees: 0
      },
      {
        id: '2',
        accountId: '6',
        date: '2024-02-10',
        type: 'buy',
        symbol: 'VXUS',
        quantity: 100,
        price: 58.25,
        totalValue: 5825.00,
        fees: 0
      },
      {
        id: '3',
        accountId: '6',
        date: '2024-03-05',
        type: 'dividend',
        symbol: 'VTI',
        quantity: 0,
        price: 0,
        totalValue: 125.50,
        fees: 0
      },
      {
        id: '4',
        accountId: '6',
        date: '2024-03-20',
        type: 'buy',
        symbol: 'BND',
        quantity: 75,
        price: 72.80,
        totalValue: 5460.00,
        fees: 0
      }
    ];
  }

  private getMockESPPData(): ESPPLoan[] {
    return [
      {
        id: '1',
        pullDate: '2024-01-05',
        pullAmount: 5000.00,
        interestRate: 8.5,
        interestAmount: 106.25,
        quarter: 'Q1 2024',
        purchaseDate: '2024-03-15',
        sharesPurchased: 125,
        purchasePrice: 40.00,
        salePrice: 48.00,
        fees: 25.00,
        profit: 868.75,
        status: 'paid_off',
        notes: 'First ESPP with PLOC'
      },
      {
        id: '2',
        pullDate: '2024-04-05',
        pullAmount: 5500.00,
        interestRate: 8.5,
        interestAmount: 116.88,
        quarter: 'Q2 2024',
        purchaseDate: '2024-06-15',
        sharesPurchased: 130,
        purchasePrice: 42.31,
        salePrice: 46.50,
        fees: 25.00,
        profit: 443.12,
        status: 'paid_off',
        notes: ''
      },
      {
        id: '3',
        pullDate: '2024-07-05',
        pullAmount: 6000.00,
        interestRate: 8.5,
        interestAmount: 127.50,
        quarter: 'Q3 2024',
        purchaseDate: '2024-09-15',
        sharesPurchased: 140,
        purchasePrice: 42.86,
        fees: 25.00,
        profit: 0,
        status: 'purchased',
        notes: 'Holding shares'
      },
      {
        id: '4',
        pullDate: '2024-10-05',
        pullAmount: 6200.00,
        interestRate: 8.5,
        interestAmount: 131.75,
        quarter: 'Q4 2024',
        purchaseDate: '2024-12-15',
        sharesPurchased: 0,
        purchasePrice: 0,
        fees: 25.00,
        profit: 0,
        status: 'pending',
        notes: 'Awaiting purchase date'
      }
    ];
  }

  private getMockESPPOfferings(): ESPPOffering[] {
    return [
      {
        id: '1',
        companyName: 'Tech Corp Inc.',
        tickerSymbol: 'TECH',
        discountPercent: 15,
        lookbackPeriod: true,
        offeringStartDate: '2024-10-01',
        offeringEndDate: '2024-12-31',
        purchaseDate: '2024-12-15',
        maxContributionPercent: 10,
        totalContributed: 6200.00,
        estimatedShares: 145,
        estimatedProfit: 1250.00
      }
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;
