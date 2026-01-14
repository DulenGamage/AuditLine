
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, Card } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { TransactionType, AccountType, Account } from '../types';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Share2, Calendar, FileText, Download, BarChart3, Plus, ArrowRight } from 'lucide-react';

type Period = 'this_month' | 'last_3_months' | 'this_year' | 'all';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, accounts, settings, user } = useApp();
  const [activeTab, setActiveTab] = useState<'pnl' | 'balance'>('balance');
  const [period, setPeriod] = useState<Period>('all');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      if (period === 'this_month') return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      if (period === 'last_3_months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        return tDate >= threeMonthsAgo;
      }
      if (period === 'this_year') return tDate.getFullYear() === now.getFullYear();
      return true;
    });
  }, [transactions, period]);

  // PnL Calculation
  const income = filteredTransactions
    .filter(t => t.type === TransactionType.INCOME || t.type === TransactionType.INTEREST_EARNED)
    .reduce((s, t) => s + t.amount, 0);

  const expenses = filteredTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((s, t) => s + t.amount, 0);

  const netIncome = income - expenses;

  // Dynamic Balance Sheet Grouping
  const nca = accounts.filter(a => [AccountType.ASSET, AccountType.INVESTMENT, AccountType.FIXED_DEPOSIT].includes(a.type));
  const ca = accounts.filter(a => [AccountType.SAVINGS, AccountType.CURRENT, AccountType.DEBIT_CARD, AccountType.LOAN_RECEIVABLE].includes(a.type));
  const ncl = accounts.filter(a => a.type === AccountType.LOAN_PAYABLE && (a.loanPeriodMonths || 0) > 12);
  const cl = accounts.filter(a => [AccountType.CREDIT_CARD, AccountType.LIABILITY].includes(a.type) || (a.type === AccountType.LOAN_PAYABLE && (a.loanPeriodMonths || 0) <= 12));

  const totalNCA = nca.reduce((s, a) => s + a.balance, 0);
  const totalCA = ca.reduce((s, a) => s + a.balance, 0);
  const totalAssets = totalNCA + totalCA;

  const totalNCL = ncl.reduce((s, a) => s + Math.abs(a.balance), 0);
  const totalCL = cl.reduce((s, a) => s + Math.abs(a.balance), 0);
  const totalLiabilities = totalNCL + totalCL;
  const equity = totalAssets - totalLiabilities;

  const handleShare = () => {
    window.print();
  };

  // ONBOARDING FOR NO ACCOUNTS
  if (accounts.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-tr from-indigo-400 to-blue-600 rounded-full blur-3xl opacity-20"></div>
          <div className="relative w-40 h-40 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl flex items-center justify-center border border-zinc-200 dark:border-white/5">
            <BarChart3 className="w-16 h-16 text-indigo-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-3 px-6">
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">Financial Insights</h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium max-w-xs mx-auto text-sm">
            Analysis requires data. Create your first account to see generated balance sheets and profit & loss statements.
          </p>
        </div>
        <button 
          onClick={() => navigate('/accounts')}
          className="w-full h-16 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all group max-w-xs"
        >
          <ArrowRight className="w-6 h-6" />
          <span className="font-black text-lg">Go to Portfolio</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-40 animate-in fade-in duration-500">
      <header className="py-6 flex flex-col space-y-4 print:hidden">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">Analytics</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">Financial performance summary</p>
          </div>
          <button 
            onClick={handleShare}
            className="w-12 h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl flex items-center justify-center shadow-sm text-blue-600 active:scale-90 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        
        {/* Period Selector */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar py-2">
          <PeriodBtn label="Month" active={period === 'this_month'} onClick={() => setPeriod('this_month')} />
          <PeriodBtn label="Quarter" active={period === 'last_3_months'} onClick={() => setPeriod('last_3_months')} />
          <PeriodBtn label="Year" active={period === 'this_year'} onClick={() => setPeriod('this_year')} />
          <PeriodBtn label="All Time" active={period === 'all'} onClick={() => setPeriod('all')} />
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] p-1 border border-zinc-200 dark:border-white/5">
           <button 
             onClick={() => setActiveTab('balance')}
             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'balance' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'}`}
           >
             Balance Sheet
           </button>
           <button 
             onClick={() => setActiveTab('pnl')}
             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'pnl' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'}`}
           >
             Profit & Loss
           </button>
        </div>
      </header>

      {activeTab === 'balance' ? (
        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 print:m-0 print:p-0">
           <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-zinc-100 dark:border-white/5 print:shadow-none print:border-none">
              <div className="p-8 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-800/50 text-center">
                 <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{user.name || 'Personal'} Asset Ledger</h2>
                 <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] mt-1">Status as at {new Date().toLocaleDateString()}</p>
              </div>

              <div className="p-6 space-y-8">
                {/* PARTICULARS HEADER */}
                <div className="flex justify-between text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4 px-2">
                   <span>Particulars</span>
                   <span>Value ({settings.currency})</span>
                </div>

                {/* ASSETS SECTION */}
                <div>
                  <ReportSectionTitle title="Assets" italic />
                  
                  <ReportSubGroup title="Non-Current Assets:">
                    {nca.length > 0 ? nca.map(a => (
                      <ReportLine key={a.id} label={a.name} amount={a.balance} />
                    )) : <p className="text-[10px] italic text-zinc-500 dark:text-zinc-400 pl-3">No fixed assets recorded.</p>}
                    <div className="border-t border-zinc-100 dark:border-white/5 mt-2 pt-2 pr-3 text-right">
                       <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 mr-4">Total NCA</span>
                       <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">{formatNumber(totalNCA)}</span>
                    </div>
                  </ReportSubGroup>

                  <ReportSubGroup title="Current Assets:">
                    {ca.length > 0 ? ca.map(a => (
                      <ReportLine key={a.id} label={a.name} amount={a.balance} />
                    )) : <p className="text-[10px] italic text-zinc-500 dark:text-zinc-400 pl-3">No current assets recorded.</p>}
                    <div className="border-t border-zinc-100 dark:border-white/5 mt-2 pt-2 pr-3 text-right">
                       <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 mr-4">Total CA</span>
                       <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">{formatNumber(totalCA)}</span>
                    </div>
                  </ReportSubGroup>

                  <div className="flex justify-between items-center py-4 px-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-50 dark:border-blue-900/20">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">Total Assets</span>
                    <span className="text-lg font-black text-blue-600 underline decoration-double decoration-2 underline-offset-4">{formatCurrency(totalAssets, settings.currency)}</span>
                  </div>
                </div>

                {/* EQUITY AND LIABILITIES SECTION */}
                <div>
                  <ReportSectionTitle title="Equity And Liabilities" italic underline />
                  
                  <ReportSubGroup title="Equity:">
                    <ReportLine label="Retained Earnings / Net Worth" amount={equity} />
                  </ReportSubGroup>

                  <ReportSubGroup title="Non-Current Liabilities:">
                    {ncl.length > 0 ? ncl.map(a => (
                      <ReportLine key={a.id} label={a.name} amount={Math.abs(a.balance)} />
                    )) : <p className="text-[10px] italic text-zinc-500 dark:text-zinc-400 pl-3">No long-term debt.</p>}
                  </ReportSubGroup>

                  <ReportSubGroup title="Current Liabilities:">
                    {cl.length > 0 ? cl.map(a => (
                      <ReportLine key={a.id} label={a.name} amount={Math.abs(a.balance)} />
                    )) : <p className="text-[10px] italic text-zinc-500 dark:text-zinc-400 pl-3">No current liabilities.</p>}
                  </ReportSubGroup>

                  <div className="flex justify-between items-center py-4 px-4 bg-zinc-900 dark:bg-white rounded-2xl mt-4">
                    <span className="text-xs font-black uppercase tracking-widest text-white dark:text-black">Total Equity & Liab</span>
                    <span className="text-lg font-black text-white dark:text-black">{formatCurrency(totalAssets, settings.currency)}</span>
                  </div>
                </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
           <Card className="bg-zinc-900 text-white p-10 flex flex-col items-center justify-center space-y-4 rounded-[3rem] shadow-2xl relative overflow-hidden border-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Period Net Profit</p>
              <h3 className={`text-5xl font-black ${netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(netIncome, settings.currency)}
              </h3>
              <div className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {period.replace('_', ' ').toUpperCase()}
              </div>
           </Card>

           <div className="grid grid-cols-2 gap-4">
             <Card className="flex flex-col space-y-4 p-6 border-none shadow-sm bg-white dark:bg-zinc-900">
               <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
               <div>
                 <p className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-widest">Inflow</p>
                 <p className="text-xl font-black text-emerald-600">{formatCurrency(income, settings.currency)}</p>
               </div>
             </Card>
             <Card className="flex flex-col space-y-4 p-6 border-none shadow-sm bg-white dark:bg-zinc-900">
               <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center"><TrendingDown className="w-6 h-6" /></div>
               <div>
                 <p className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-widest">Outflow</p>
                 <p className="text-xl font-black text-rose-600">{formatCurrency(expenses, settings.currency)}</p>
               </div>
             </Card>
           </div>
        </div>
      )}

      {/* Floating Generation Button */}
      <div className="fixed bottom-32 left-6 right-6 z-40 print:hidden">
        <button 
          onClick={handleShare}
          className="w-full h-16 bg-blue-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all border border-blue-500/20"
        >
          <Download className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">Generate Full Statement</span>
        </button>
      </div>
    </div>
  );
};

const PeriodBtn: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${active ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/5'}`}
  >
    {label}
  </button>
);

const ReportSectionTitle: React.FC<{ title: string; italic?: boolean; underline?: boolean }> = ({ title, italic, underline }) => (
  <div className="py-3 border-b border-zinc-100 dark:border-white/5 mb-4 px-1">
    <h3 className={`text-base font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 ${italic ? 'italic' : ''} ${underline ? 'underline decoration-1 underline-offset-4' : ''}`}>
      {title}
    </h3>
  </div>
);

const ReportSubGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h4 className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 mb-3 pl-1 uppercase tracking-wider">{title}</h4>
    <div className="space-y-1 text-zinc-900 dark:text-zinc-100">
      {children}
    </div>
  </div>
);

const ReportLine: React.FC<{ label: string; amount: number }> = ({ label, amount }) => (
  <div className="flex justify-between items-center py-2 px-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{label}</span>
    <span className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100">{amount !== 0 ? formatNumber(amount) : '-'}</span>
  </div>
);

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2 }).format(num);
};
