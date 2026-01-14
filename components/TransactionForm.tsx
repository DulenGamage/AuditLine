
import React, { useState, useEffect } from 'react';
import { TransactionType, Transaction } from '../types';
import { useApp } from '../store/AppContext';
import { CATEGORIES } from '../constants';
import { Card } from './Layout';
import { Plus, Repeat, AlertCircle, ChevronDown } from 'lucide-react';

interface TransactionFormProps {
  editingTransaction?: Transaction | null;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ editingTransaction, onClose }) => {
  const { accounts, addTransaction, updateTransaction, transactionModalType } = useApp();
  
  const [activeCategory, setActiveCategory] = useState<'EXPENSE' | 'INCOME' | 'TRANSFER'>(() => {
    if (editingTransaction) {
      const isInc = [TransactionType.INCOME, TransactionType.SALARY, TransactionType.DIVIDEND, TransactionType.BONUS, TransactionType.INTEREST_EARNED, TransactionType.GIFT, TransactionType.RENTAL].includes(editingTransaction.type);
      if (editingTransaction.type === TransactionType.TRANSFER) return 'TRANSFER';
      return isInc ? 'INCOME' : 'EXPENSE';
    }
    if (transactionModalType === TransactionType.INCOME) return 'INCOME';
    if (transactionModalType === TransactionType.TRANSFER) return 'TRANSFER';
    return 'EXPENSE';
  });

  const [formData, setFormData] = useState({
    type: editingTransaction ? editingTransaction.type : transactionModalType,
    amount: '',
    description: '',
    selectedAccountId: '', 
    toAccountId: '',       
    category: 'food',
    isRecurring: false,
    recurrencePeriod: 'MONTHLY' as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        description: editingTransaction.description,
        selectedAccountId: [TransactionType.INCOME, TransactionType.SALARY, TransactionType.BONUS, TransactionType.DIVIDEND, TransactionType.INTEREST_EARNED, TransactionType.GIFT, TransactionType.RENTAL].includes(editingTransaction.type) 
          ? editingTransaction.toAccountId 
          : editingTransaction.fromAccountId,
        toAccountId: editingTransaction.toAccountId,
        category: editingTransaction.category,
        isRecurring: editingTransaction.isRecurring,
        recurrencePeriod: editingTransaction.recurrencePeriod || 'MONTHLY',
        date: editingTransaction.date,
      });
    } else {
      setFormData(prev => ({ 
        ...prev, 
        type: transactionModalType, 
        selectedAccountId: accounts.length > 0 ? accounts[0].id : '' 
      }));
    }
  }, [editingTransaction, transactionModalType, accounts]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (/^\d*\.?\d*$/.test(rawValue)) {
      setFormData({ ...formData, amount: rawValue });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount) || 0;
    
    if (amountNum <= 0) return;
    if (!formData.selectedAccountId) return;

    let fromAccId = '';
    let toAccId = '';

    const isIncomeType = [TransactionType.INCOME, TransactionType.SALARY, TransactionType.BONUS, TransactionType.DIVIDEND, TransactionType.INTEREST_EARNED, TransactionType.GIFT, TransactionType.RENTAL].includes(formData.type);

    if (activeCategory === 'TRANSFER') {
      fromAccId = formData.selectedAccountId;
      toAccId = formData.toAccountId;
    } else if (isIncomeType) {
      toAccId = formData.selectedAccountId;
    } else {
      fromAccId = formData.selectedAccountId;
    }

    const payload = {
      type: formData.type,
      amount: amountNum,
      description: formData.description,
      fromAccountId: fromAccId,
      toAccountId: toAccId,
      category: activeCategory === 'TRANSFER' ? 'transfer' : formData.category,
      isRecurring: formData.isRecurring,
      recurrencePeriod: formData.isRecurring ? formData.recurrencePeriod : undefined,
      date: formData.date,
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  const isTransfer = activeCategory === 'TRANSFER';

  const getThemeColors = () => {
    switch(activeCategory) {
      case 'INCOME': return { primary: 'text-emerald-500', bg: 'bg-emerald-500', ghost: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' };
      case 'TRANSFER': return { primary: 'text-blue-500', bg: 'bg-blue-500', ghost: 'bg-blue-50 dark:bg-blue-900/10 text-blue-600' };
      default: return { primary: 'text-rose-500', bg: 'bg-rose-500', ghost: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600' };
    }
  };

  const theme = getThemeColors();

  const subTypes = {
    INCOME: [
      { id: TransactionType.INCOME, label: 'General' },
      { id: TransactionType.SALARY, label: 'Salary' },
      { id: TransactionType.BONUS, label: 'Bonus' },
      { id: TransactionType.DIVIDEND, label: 'Dividend' },
      { id: TransactionType.RENTAL, label: 'Rental' },
      { id: TransactionType.GIFT, label: 'Gift' },
      { id: TransactionType.INTEREST_EARNED, label: 'Interest' },
    ],
    EXPENSE: [
      { id: TransactionType.EXPENSE, label: 'General' },
      { id: TransactionType.BILL, label: 'Bill' },
      { id: TransactionType.TAX, label: 'Tax' },
      { id: TransactionType.SUBSCRIPTION, label: 'Sub' },
      { id: TransactionType.LOAN_REPAYMENT, label: 'Debt' },
      { id: TransactionType.INVESTMENT_OUT, label: 'Invest' },
      { id: TransactionType.GROCERIES, label: 'Food' },
    ],
    TRANSFER: [
      { id: TransactionType.TRANSFER, label: 'Wallet Move' }
    ]
  };

  if (accounts.length === 0) {
    return (
      <Card className="w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-10 space-y-8 shadow-2xl border-none animate-ios-entry">
        <div className="flex flex-col items-center text-center space-y-4">
           <AlertCircle className="w-12 h-12 text-amber-500" />
           <h3 className="text-xl font-black text-black dark:text-white">Account Required</h3>
           <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">Establish a wallet in your portfolio first to track cash movement.</p>
           <button onClick={onClose} className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Dismiss</button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-[3rem] p-10 space-y-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-ios-entry border-none no-scrollbar">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-black dark:text-white">{editingTransaction ? 'Modify Entry' : 'New Movement'}</h2>
        <button onClick={onClose} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center active:scale-90 transition-transform"><Plus className="rotate-45 w-5 h-5 text-black dark:text-white" /></button>
      </div>
      
      <div className="flex bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] p-1.5 border border-black/5 dark:border-white/5">
        {['EXPENSE', 'INCOME', 'TRANSFER'].map((cat: any) => (
          <button 
            key={cat} type="button" 
            onClick={() => {
              setActiveCategory(cat);
              setFormData({...formData, type: subTypes[cat as keyof typeof subTypes][0].id});
            }}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${
              activeCategory === cat ? `${theme.bg} shadow-md text-white` : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd} className="space-y-8">
        <div className="space-y-2 text-center group">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block transition-colors group-focus-within:text-blue-500">Value</label>
          <input 
            type="text" placeholder="0.00" required autoFocus inputMode="decimal"
            className={`w-full text-center text-6xl font-black bg-transparent outline-none ${theme.primary} tracking-tighter transition-all duration-500 focus:scale-105`}
            value={formData.amount}
            onChange={handleAmountChange}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Specific Sub-Type</label>
            <div className="grid grid-cols-4 gap-2">
              {subTypes[activeCategory].map((st) => (
                <button 
                  key={st.id} type="button"
                  onClick={() => setFormData({...formData, type: st.id})}
                  className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-200 border-2 ${
                    formData.type === st.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-zinc-50 dark:border-white/5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`grid ${isTransfer ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{isTransfer ? 'Origin' : 'Source/Target'}</label>
              <div className="relative">
                <select className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl p-4 pr-10 text-xs font-bold outline-none appearance-none text-black dark:text-white" required value={formData.selectedAccountId} onChange={(e) => setFormData({...formData, selectedAccountId: e.target.value})}>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            {isTransfer && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Destination</label>
                <div className="relative">
                  <select className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl p-4 pr-10 text-xs font-bold outline-none appearance-none text-black dark:text-white" required value={formData.toAccountId} onChange={(e) => setFormData({...formData, toAccountId: e.target.value})}>
                    <option value="">Select Target</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Narration</label>
            <input type="text" placeholder="Digital memo..." className="w-full bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl p-4 outline-none font-bold text-sm text-black dark:text-white transition-all focus:ring-2 focus:ring-blue-600/20" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border border-black/5 dark:border-white/5 transition-all">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${theme.ghost} rounded-2xl flex items-center justify-center`}><Repeat className="w-6 h-6" /></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">Recurring Activity</span>
            </div>
            <input type="checkbox" className="w-6 h-6 rounded-full accent-black dark:accent-white cursor-pointer transition-transform active:scale-125" checked={formData.isRecurring} onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})} />
          </div>

          {formData.isRecurring && (
            <div className="grid grid-cols-4 gap-2 animate-in slide-in-from-top-2 duration-300">
              {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].map(p => (
                <button 
                  key={p} type="button" onClick={() => setFormData({...formData, recurrencePeriod: p as any})}
                  className={`py-3 rounded-xl text-[8px] font-black tracking-widest transition-all duration-300 ${formData.recurrencePeriod === p ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-zinc-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className={`w-full ${theme.bg} text-white font-black py-6 rounded-[2.5rem] shadow-xl active:scale-95 transition-all duration-300 text-sm uppercase tracking-widest hover:shadow-2xl hover:opacity-90`}>
          Secure Entry Submission
        </button>
      </form>
    </Card>
  );
};
