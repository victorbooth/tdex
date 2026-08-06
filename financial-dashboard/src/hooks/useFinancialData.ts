import { useState, useEffect } from 'react';
import googleSheetsService from '../services/googleSheets';
import { Account, InvestmentTransaction, ESPPLoan, ESPPOffering } from '../types';

export function useFinancialData() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [investmentHistory, setInvestmentHistory] = useState<InvestmentTransaction[]>([]);
  const [esppLoans, setEsppLoans] = useState<ESPPLoan[]>([]);
  const [esppOfferings, setEsppOfferings] = useState<ESPPOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [accountsData, investmentData, esppLoansData, esppOfferingsData] = await Promise.all([
        googleSheetsService.getAccounts(),
        googleSheetsService.getInvestmentHistory(),
        googleSheetsService.getESPPData(),
        googleSheetsService.getESPPOfferings()
      ]);
      
      setAccounts(accountsData);
      setInvestmentHistory(investmentData);
      setEsppLoans(esppLoansData);
      setEsppOfferings(esppOfferingsData);
    } catch (err) {
      setError('Failed to load financial data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchAllData();
  };

  return {
    accounts,
    investmentHistory,
    esppLoans,
    esppOfferings,
    loading,
    error,
    refreshData
  };
}
