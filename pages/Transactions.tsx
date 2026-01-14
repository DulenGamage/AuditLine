
import React, { useState } from 'react';
import { Section, Card, EmptyState } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { TransactionType, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES } from '../constants';
import { 
  Search, 
  Filter, 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Edit2,
  Trash2,
  Activity,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { TransactionForm } from '../components/TransactionForm';

export const Transactions: React.FC = () => {
  const { transactions, accounts, deleteTransaction, settings, openTransactionModal } = useApp();
  
  const [viewingTx, setViewingTx] = useState<Transaction | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    accountId: '',
    categoryId: '',
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month'
  });

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(filters.search.toLowerCase()) || 
                         tx.category.toLowerCase().includes(filters.search.toLowerCase());
    const matchesAccount = !filters.accountId || tx.fromAccountId === filters.accountId || tx.toAccountId === filters.accountId;
    const matchesCategory = !filters.categoryId || tx.category === filters.categoryId;
    
    let matchesDate = true;
    const txDate = new Date(tx.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filters.dateRange === 'today') {
      matchesDate = txDate >= today;
    } else if (filters.dateRange === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      matchesDate = txDate >= weekAgo;
    } else if (filters.dateRange === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDate = txDate >= monthAgo;
    }

    return matchesSearch && matchesAccount && matchesCategory && matchesDate;
  });

  const handleDelete = () => {
    if (confirmDeleteId) {
      deleteTransaction(confirmDeleteId);
      setConfirmDeleteId(null);
      setViewingTx(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <EmptyState 
        icon={<Activity />}
        title="Ledger History Empty"
        description="No financial events recorded yet. Start logging your cash movements to build a comprehensive audit trail."
        actionLabel="Log Transaction"
        onAction={() => openTransactionModal(TransactionType.EXPENSE)}
        accentColor="rose"
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-36">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-black tracking-tighter text-black dark:text-white">Ledger</h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${showFilters ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/5 shadow-sm active:scale-90 text-black dark:text-white'}`}
        >
          <Filter className="w-6 h-6" />
        </button>
      </header>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black dark:text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search digital records..."
            className="w-full bg-white dark:bg-zinc-900 rounded-2xl py-4 pl-12 pr-4 outline-none border border-zinc-300 dark:border-white/5 shadow-sm text-sm text-black dark:text-white placeholder-zinc-500"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>

        {showFilters && (
          <Card className="p-6 space-y-4 animate-in slide-in-from-top-4 duration-300 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-white/10">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black dark:text-zinc-400 uppercase tracking-widest ml-1">Account Pivot</label>
                <select 
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-white/5 rounded-xl p-3 text-xs font-bold outline-none text-black dark:text-white"
                  value={filters.accountId}
                  onChange={(e) => setFilters({...filters, accountId: e.target.value})}
                >
                  <option value="">Full Portfolio</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? filteredTransactions.map(tx => {
          const fromAcc = accounts.find(a => a.id === tx.fromAccountId);
          const toAcc = accounts.find(a => a.id === tx.toAccountId);
          const category = CATEGORIES.find(c => c.id === tx.category);
          
          let amountColor = '';
          switch(tx.type) {
            case TransactionType.INCOME: amountColor = 'text-emerald-500'; break;
            case TransactionType.TRANSFER: amountColor = 'text-blue-500'; break;
            default: amountColor = 'text-rose-500'; break;
          }

          return (
            <Card 
              key={tx.id} 
              onClick={() => setViewingTx(tx)}
              className="flex justify-between items-center hover:scale-[1.01] active:scale-100 transition-all cursor-pointer group p-5 bg-white dark:bg-zinc-900 border-none shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${tx.type === TransactionType.TRANSFER ? 'bg-blue-500/10 text-blue-500' : (category ? `${category.bgClass} ${category.textClass}` : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400')}`}>
                  {tx.type === TransactionType.TRANSFER ? <ArrowLeftRight className="w-5 h-5" /> : 
                   (category && React.isValidElement(category.icon) ? React.cloneElement(category.icon as React.ReactElement<any>, { className: "w-6 h-6" }) : <MoreHorizontal className="w-5 h-5" />)}
                </div>
                <div>
                  <p className="font-black text-[15px] text-black dark:text-white group-hover:text-blue-600 transition-colors">
                    {tx.description || (tx.type === TransactionType.TRANSFER ? 'Intra-Wallet Transfer' : tx.category)}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                    {tx.type === TransactionType.INCOME ? `Inflow: ${toAcc?.name || 'Wallet'}` : 
                     tx.type === TransactionType.EXPENSE ? `Outflow: ${fromAcc?.name || 'Wallet'}` :
                     `${fromAcc?.name || 'Wallet'} → ${toAcc?.name || 'Wallet'}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black ${amountColor}`}>
                  {tx.type === TransactionType.INCOME ? '+' : tx.type === TransactionType.TRANSFER ? '' : '-'}{formatCurrency(tx.amount, settings.currency)}
                </p>
                <p className="text-[10px] text-zinc-400 font-black mt-1 uppercase tracking-widest">
                  {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </Card>
          );
        }) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-60 grayscale text-zinc-800 dark:text-zinc-500">
             <Activity className="w-12 h-12 mb-4" />
             <p className="font-bold">Filtered history is clear.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewingTx && !editingTx && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative overflow-hidden border-none">
            <button 
              onClick={() => setViewingTx(null)}
              className="absolute top-6 right-6 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-transform active:scale-90 text-black dark:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col items-center space-y-2 pt-4">
              <h2 className="text-xl font-black text-black dark:text-white">{viewingTx.description || viewingTx.category}</h2>
              <p className={`text-2xl font-black ${
                viewingTx.type === TransactionType.INCOME ? 'text-emerald-500' : 
                viewingTx.type === TransactionType.TRANSFER ? 'text-blue-500' : 'text-rose-500'
              }`}>
                {viewingTx.type === TransactionType.INCOME ? '+' : viewingTx.type === TransactionType.TRANSFER ? '' : '-'}{formatCurrency(viewingTx.amount, settings.currency)}
              </p>
            </div>

            <div className="space-y-4 border-t border-zinc-200 dark:border-white/5 pt-6">
              <DetailRow label="Type" value={viewingTx.type} />
              <DetailRow label="Date" value={new Date(viewingTx.date).toLocaleDateString(undefined, { dateStyle: 'long' })} />
            </div>

            <div className="grid grid-cols-1 gap-3 pt-4">
              <button 
                onClick={() => setEditingTx(viewingTx)}
                className="w-full py-4 text-blue-600 font-bold bg-blue-500/10 rounded-2xl active:scale-95 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Modify Entry</span>
              </button>
              <button 
                onClick={() => setConfirmDeleteId(viewingTx.id)}
                className="w-full py-4 text-rose-500 font-bold bg-rose-500/10 rounded-2xl active:scale-95 transition-all text-sm flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Purge Record</span>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-xs bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl text-center border-none">
            <h3 className="text-xl font-black text-black dark:text-white">Permanent Purge?</h3>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed">This event will be wiped from your audit line. Balances will be reverted.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="py-4 bg-zinc-200 dark:bg-zinc-800 rounded-2xl font-bold text-sm text-black dark:text-white">Cancel</button>
              <button onClick={handleDelete} className="py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-500/20">Purge</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const DetailRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
    <span className="text-xs font-black text-black dark:text-white">{value}</span>
  </div>
);
