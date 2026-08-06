import { useFinancialData } from './hooks/useFinancialData';
import { Header } from './components/Header';
import { NetWorthSummary } from './components/NetWorthSummary';
import { AccountCard } from './components/AccountCard';
import { AccountBreakdown } from './components/AccountBreakdown';
import { InvestmentHistory } from './components/InvestmentHistory';
import { HeySparty } from './components/HeySparty';

function App() {
  const { accounts, investmentHistory, esppLoans, esppOfferings, loading, error, refreshData } = useFinancialData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={refreshData} isLoading={loading} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Net Worth Summary */}
        <NetWorthSummary accounts={accounts} />
        
        {/* All Accounts Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </section>
        
        {/* Hey Sparty ESPP Tracker - Full Width Section */}
        <section className="mb-8">
          <HeySparty loans={esppLoans} offerings={esppOfferings} />
        </section>
        
        {/* Two Column Layout for Breakdown and History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AccountBreakdown accounts={accounts} />
          <InvestmentHistory transactions={investmentHistory} />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Financial Dashboard • Data synced with Google Sheets • Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
