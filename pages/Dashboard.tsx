
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Card, EmptyState } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { formatCurrency } from '../utils/formatters';
import { AccountType, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { 
  ArrowRightLeft, 
  Send, 
  MoreHorizontal,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, transactions, settings, receivables, processReceivable, openTransactionModal } = useApp();
  const [showBalance, setShowBalance] = useState(true);

  const totalAssets = accounts
    .filter(a => [AccountType.SAVINGS, AccountType.CURRENT, AccountType.ASSET, AccountType.FIXED_DEPOSIT, AccountType.INVESTMENT, AccountType.LOAN_RECEIVABLE].includes(a.type))
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter(a => [AccountType.LOAN_PAYABLE, AccountType.LIABILITY, AccountType.CREDIT_CARD].includes(a.type))
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const netWorth = totalAssets - totalLiabilities;

  const chartData = [
    { name: 'M1', value: netWorth * 0.8 },
    { name: 'M2', value: netWorth * 0.85 },
    { name: 'M3', value: netWorth * 0.92 },
    { name: 'M4', value: netWorth * 0.88 },
    { name: 'M5', value: netWorth * 0.95 },
    { name: 'Current', value: netWorth },
  ];

  const upcomingExpenses = transactions
    .filter(t => t.isRecurring && t.type === TransactionType.EXPENSE)
    .slice(0, 3);

  const pendingReceivables = receivables.filter(r => r.status === 'PENDING');

  if (accounts.length === 0) {
    return (
      <EmptyState 
        icon={<Sparkles />}
        title="Audit Matrix Initialization"
        description="Establish your financial foundation by adding your first wallet or card to the AuditLine system."
        actionLabel="Build Portfolio"
        onAction={() => navigate('/accounts')}
        accentColor="blue"
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 lg:pb-10 pb-36">
      
      {/* KPI Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-400">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Capital Overview</span>
            <button onClick={() => setShowBalance(!showBalance)} className="hover:text-blue-600 transition-colors">
              {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <h1 className="lg:text-5xl text-4xl font-black tracking-tighter text-black dark:text-white">
            {showBalance ? formatCurrency(netWorth, settings.currency) : '••••••••'}
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button onClick={() => openTransactionModal(TransactionType.INCOME)} className="flex-1 lg:flex-none flex items-center justify-center space-x-3 px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            <TrendingUp className="w-4 h-4" />
            <span>Injection</span>
          </button>
          <button onClick={() => openTransactionModal(TransactionType.EXPENSE)} className="flex-1 lg:flex-none flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 text-black dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 transition-all">
            <Send className="w-4 h-4" />
            <span>Outflow</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Cockpit */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8 border-none shadow-md overflow-hidden bg-white dark:bg-zinc-900">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-xl font-black tracking-tight">Wealth Momentum</h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">NAV Trajectory</p>
              </div>
            </div>
            <div className="h-64 -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888810" />
                  <XAxis dataKey="name" hide />
                  <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', fontWeight: '800' }} formatter={(val: number) => formatCurrency(val, settings.currency)} />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="Recurring Subscriptions">
              <div className="space-y-4">
                {upcomingExpenses.map(tx => (
                  <Card key={tx.id} className="p-5 flex justify-between items-center shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                         <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold truncate max-w-[120px]">{tx.description}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase">{tx.recurrencePeriod}</p>
                      </div>
                    </div>
                    <p className="font-black text-rose-600">-{formatCurrency(tx.amount, settings.currency)}</p>
                  </Card>
                ))}
              </div>
            </Section>

            <Section title="Recent Ledger">
              <div className="space-y-4">
                {transactions.slice(0, 4).map(tx => {
                   const category = CATEGORIES.find(c => c.id === tx.category);
                   return (
                    <div key={tx.id} className="flex justify-between items-center group cursor-pointer" onClick={() => navigate('/transactions')}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${category ? `${category.bgClass} ${category.textClass}` : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                          {React.isValidElement(category?.icon) ? React.cloneElement(category.icon as React.ReactElement<any>, { className: "w-5 h-5" }) : <MoreHorizontal className="w-4 h-4" />}
                        </div>
                        <p className="text-sm font-bold truncate max-w-[100px]">{tx.description || tx.category}</p>
                      </div>
                      <p className={`text-sm font-black ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-black dark:text-white'}`}>
                        {tx.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Section>
          </div>
        </div>

        {/* Portfolio Status */}
        <div className="lg:col-span-4 space-y-8">
          <Section title="Active Wallets" rightElement={<button onClick={() => navigate('/accounts')} className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"><ChevronRight className="w-4 h-4"/></button>}>
            <div className="space-y-4">
              {accounts.slice(0, 4).map(acc => (
                <Card key={acc.id} className="p-5 border-none shadow-sm group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => navigate('/accounts')}>
                   <div className="flex justify-between items-center">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-500" style={{ color: acc.customColors?.start }}>
                           <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{acc.type.replace('_', ' ')}</p>
                          <h4 className="font-black text-sm">{acc.name}</h4>
                        </div>
                     </div>
                     <p className="font-black text-sm">{formatCurrency(acc.balance, settings.currency)}</p>
                   </div>
                </Card>
              ))}
            </div>
          </Section>

          {pendingReceivables.length > 0 && (
            <Section title="Expected Inflow">
               <div className="space-y-3">
                  {pendingReceivables.slice(0, 2).map(r => (
                    <Card key={r.id} className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 border shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                              <TrendingUp className="w-4 h-4" />
                           </div>
                           <span className="text-xs font-bold truncate max-w-[100px]">{r.description}</span>
                        </div>
                        <button onClick={() => processReceivable(r.id)} className="text-[10px] font-black text-emerald-600 uppercase underline decoration-2 underline-offset-4 active:scale-95 transition-all">Collect</button>
                      </div>
                    </Card>
                  ))}
               </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};
