import { Account } from '../../types';

interface NetWorthSummaryProps {
  accounts: Account[];
}

export function NetWorthSummary({ accounts }: NetWorthSummaryProps) {
  const totalAssets = accounts
    .filter(a => a.balance >= 0)
    .reduce((sum, account) => sum + account.balance, 0);

  const totalLiabilities = Math.abs(
    accounts
      .filter(a => a.balance < 0)
      .reduce((sum, account) => sum + account.balance, 0)
  );

  const netWorth = totalAssets - totalLiabilities;

  const formattedNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Assets */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-sm font-medium opacity-90 mb-2">Total Assets</h3>
        <p className="text-3xl font-bold">{formattedNumber(totalAssets)}</p>
        <div className="mt-4 flex items-center text-sm opacity-75">
          <span>{accounts.filter(a => a.balance >= 0).length} accounts</span>
        </div>
      </div>

      {/* Total Liabilities */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-sm font-medium opacity-90 mb-2">Total Liabilities</h3>
        <p className="text-3xl font-bold">{formattedNumber(totalLiabilities)}</p>
        <div className="mt-4 flex items-center text-sm opacity-75">
          <span>{accounts.filter(a => a.balance < 0).length} accounts</span>
        </div>
      </div>

      {/* Net Worth */}
      <div className={`bg-gradient-to-br rounded-lg shadow-lg p-6 text-white ${
        netWorth >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'
      }`}>
        <h3 className="text-sm font-medium opacity-90 mb-2">Net Worth</h3>
        <p className="text-3xl font-bold">{formattedNumber(netWorth)}</p>
        <div className="mt-4 flex items-center text-sm opacity-75">
          <span>{accounts.length} total accounts</span>
        </div>
      </div>
    </div>
  );
}
