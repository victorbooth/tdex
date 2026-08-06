import { Account } from '../../types';

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const isLiability = account.balance < 0;
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: account.currency,
  }).format(Math.abs(account.balance));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checking': return '🏦';
      case 'savings': return '💰';
      case 'credit_card': return '💳';
      case 'revolving_credit': return '🔄';
      case 'loan': return '📋';
      case 'investment': return '📈';
      default: return '💵';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4"
      style={{ borderLeftColor: account.color || '#3b82f6' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTypeIcon(account.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{account.name}</h3>
            <p className="text-sm text-gray-500">{account.institution}</p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-600 capitalize">
          {account.type.replace('_', ' ')}
        </span>
      </div>
      
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">
          {isLiability ? '-' : '+'}{formattedBalance}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Updated: {new Date(account.lastUpdated).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
