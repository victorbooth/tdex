import { Account } from '../../types';

interface AccountBreakdownProps {
  accounts: Account[];
}

export function AccountBreakdown({ accounts }: AccountBreakdownProps) {
  const groupedAccounts = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const typeLabels: Record<string, string> = {
    checking: 'Checking Accounts',
    savings: 'Savings Accounts',
    credit_card: 'Credit Cards',
    revolving_credit: 'Revolving Credit',
    loan: 'Loans',
    investment: 'Investments'
  };

  const formattedNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  };

  const getTypeTotal = (typeAccounts: Account[]) => {
    return typeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Account Breakdown</h2>
      
      <div className="space-y-6">
        {Object.entries(groupedAccounts).map(([type, typeAccounts]) => {
          const total = getTypeTotal(typeAccounts);
          const isLiability = total < 0;
          
          return (
            <div key={type}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600 capitalize">
                  {typeLabels[type] || type}
                </h3>
                <span className={`text-sm font-bold ${isLiability ? 'text-red-600' : 'text-emerald-600'}`}>
                  {formattedNumber(total)}
                </span>
              </div>
              
              <div className="space-y-2">
                {typeAccounts.map((account) => (
                  <div 
                    key={account.id}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account.color }}
                      />
                      <span className="text-sm text-gray-700">{account.name}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      account.balance < 0 ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {formattedNumber(account.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
