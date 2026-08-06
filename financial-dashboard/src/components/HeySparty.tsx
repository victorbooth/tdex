import { ESPPLoan, ESPPOffering } from '../types';

interface HeySpartyProps {
  loans: ESPPLoan[];
  offerings: ESPPOffering[];
}

export function HeySparty({ loans, offerings }: HeySpartyProps) {
  // Calculate totals
  const totalPulled = loans.reduce((sum, loan) => sum + loan.pullAmount, 0);
  const totalInterest = loans.reduce((sum, loan) => sum + loan.interestAmount, 0);
  const totalProfit = loans.reduce((sum, loan) => sum + loan.profit, 0);
  const activeLoans = loans.filter(loan => loan.status === 'pending' || loan.status === 'purchased');
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: ESPPLoan['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'purchased': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-green-100 text-green-800';
      case 'paid_off': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">🚀 Hey Sparty - ESPP Tracker</h2>
        <span className="text-sm text-gray-500">Powered by PLOC</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Pulled</p>
          <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalPulled)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
          <p className="text-sm text-red-600 font-medium">Total Interest</p>
          <p className="text-2xl font-bold text-red-800">{formatCurrency(totalInterest)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Net Profit</p>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
            {formatCurrency(totalProfit)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Active Loans</p>
          <p className="text-2xl font-bold text-purple-800">{activeLoans.length}</p>
        </div>
      </div>

      {/* Current Offerings */}
      {offerings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Current Offerings</h3>
          <div className="space-y-3">
            {offerings.map((offering) => (
              <div key={offering.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-800">{offering.companyName}</h4>
                    <p className="text-sm text-gray-600">{offering.tickerSymbol} • {offering.discountPercent}% Discount</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${offering.lookbackPeriod ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {offering.lookbackPeriod ? 'With Lookback' : 'No Lookback'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-gray-500">Offering Period</p>
                    <p className="font-medium">{new Date(offering.offeringStartDate).toLocaleDateString()} - {new Date(offering.offeringEndDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Purchase Date</p>
                    <p className="font-medium">{new Date(offering.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contributed</p>
                    <p className="font-medium">{formatCurrency(offering.totalContributed)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Est. Profit</p>
                    <p className="font-medium text-green-600">{formatCurrency(offering.estimatedProfit)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ESPP Loans Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Loan History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quarter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pull Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{loan.quarter}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {new Date(loan.pullDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(loan.pullAmount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">
                    {formatCurrency(loan.interestAmount)}
                    <span className="text-xs text-gray-500 ml-1">({loan.interestRate}%)</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {new Date(loan.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {loan.sharesPurchased.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${loan.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(loan.profit)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No ESPP loans recorded yet. Add your first pull to start tracking!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Summary */}
      {loans.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Return on Investment (ROI)</p>
              <p className="text-2xl font-bold text-gray-800">
                {((totalProfit / totalPulled) * 100).toFixed(2)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Fees Paid</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatCurrency(loans.reduce((sum, loan) => sum + loan.fees, 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
