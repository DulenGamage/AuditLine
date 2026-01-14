
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { AppState, Account, Transaction, Goal, AccountType, TransactionType, UserSettings, Receivable, DocFile, AppNotification } from '../types';

interface AppContextType extends AppState {
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'savedAmount'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  contributeToGoal: (goalId: string, amount: number, fromAccountId: string) => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateUser: (updates: Partial<{ name: string; email: string }>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  notify: (msg: string, type?: 'success' | 'info' | 'warning' | 'error', title?: string) => void;
  markNotificationsRead: () => void;
  clearNotifications: () => void;
  processReceivable: (receivableId: string) => Promise<void>;
  addDocument: (doc: Omit<DocFile, 'id' | 'date'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  transactionModalType: TransactionType;
  setTransactionModalType: (type: TransactionType) => void;
  openTransactionModal: (type?: TransactionType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_STATE: AppState = {
  accounts: [],
  transactions: [],
  goals: [],
  receivables: [],
  notifications: [],
  documents: [],
  settings: {
    currency: 'LKR',
    theme: 'system',
    notifications: true,
    onboardingCompleted: false,
    reportEmail: '',
    autoEmailEnabled: false,
  },
  user: {
    id: '',
    name: 'Guest',
    email: '',
    isLoggedIn: false,
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [toast, setToast] = useState<{msg: string, type: string} | null>(null);

  const notify = useCallback((msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', title: string = 'AuditLine') => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substring(7),
      title,
      message: msg,
      type,
      date: new Date().toISOString(),
      read: false
    };
    setState(prev => ({ ...prev, notifications: [newNotif, ...prev.notifications].slice(0, 50) }));
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchData = useCallback(async (userId: string) => {
    try {
      const [accs, txs, goals] = await Promise.all([
        supabase.from('accounts').select('*').eq('user_id', userId),
        supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('goals').select('*').eq('user_id', userId),
      ]);

      setState(prev => ({
        ...prev,
        accounts: accs.data || [],
        transactions: txs.data || [],
        goals: goals.data || []
      }));
    } catch (e) {
      console.error("AuditLine Database Fetch Error:", e);
      notify("Uplink to secure database failed. Check connectivity.", "error", "Network Error");
    }
  }, [notify]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setState(prev => ({
          ...prev,
          user: {
            id: session.user.id,
            name: session.user.user_metadata.full_name || 'Audit User',
            email: session.user.email || '',
            isLoggedIn: true
          }
        }));
        fetchData(session.user.id);
      }
    }).catch(err => console.error("Session Error:", err));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setState(prev => ({
          ...prev,
          user: {
            id: session.user.id,
            name: session.user.user_metadata.full_name || 'Audit User',
            email: session.user.email || '',
            isLoggedIn: true
          }
        }));
        fetchData(session.user.id);
      } else {
        setState(INITIAL_STATE);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      notify(error.message, 'error', 'Auth Error');
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) {
      notify(error.message, 'error', 'Sign Up Error');
      throw error;
    }
    notify("Account created. Please verify your email.", "success");
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const addAccount = async (accountData: any) => {
    const { data, error } = await supabase.from('accounts').insert([{
      ...accountData,
      user_id: state.user.id
    }]).select();

    if (error) return notify(error.message, 'error');
    if (data) setState(prev => ({ ...prev, accounts: [...prev.accounts, data[0]] }));
    notify("Account established.", "success");
  };

  const addTransaction = async (txData: any) => {
    const { data, error } = await supabase.from('transactions').insert([{
      ...txData,
      user_id: state.user.id
    }]).select();

    if (error) return notify(error.message, 'error');

    setState(prev => {
      const updatedAccounts = prev.accounts.map(acc => {
        let bal = acc.balance;
        if (acc.id === txData.fromAccountId) bal -= txData.amount;
        if (acc.id === txData.toAccountId) bal += txData.amount;
        return { ...acc, balance: bal };
      });
      return { ...prev, accounts: updatedAccounts, transactions: data ? [data[0], ...prev.transactions] : prev.transactions };
    });
    notify("Transaction recorded.", "success");
  };

  const updateAccount = async (id: string, updates: any) => {
    await supabase.from('accounts').update(updates).eq('id', id);
    setState(prev => ({ ...prev, accounts: prev.accounts.map(a => a.id === id ? { ...a, ...updates } : a) }));
  };

  const deleteAccount = async (id: string) => {
    await supabase.from('accounts').delete().eq('id', id);
    setState(prev => ({ ...prev, accounts: prev.accounts.filter(a => a.id !== id) }));
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id);
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };

  const addGoal = async (goal: any) => {
    const { data } = await supabase.from('goals').insert([{ ...goal, user_id: state.user.id }]).select();
    if (data) setState(prev => ({ ...prev, goals: [...prev.goals, data[0]] }));
  };

  const updateGoal = async (id: string, updates: any) => {
    await supabase.from('goals').update(updates).eq('id', id);
    setState(prev => ({ ...prev, goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g) }));
  };

  const contributeToGoal = async (goalId: string, amount: number, fromAccountId: string) => {
    // Basic goal contribution logic
  };

  const updateSettings = async (updates: any) => setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  const updateUser = async (updates: any) => setState(prev => ({ ...prev, user: { ...prev.user, ...updates } }));
  
  const markNotificationsRead = () => setState(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, read: true })) }));
  const clearNotifications = () => setState(prev => ({ ...prev, notifications: [] }));
  const processReceivable = async () => {};
  const addDocument = async () => {};
  const deleteDocument = async () => {};
  
  const openTransactionModal = (type: TransactionType = TransactionType.EXPENSE) => {
    setTransactionModalType(type);
    setIsAddModalOpen(true);
  };

  return (
    <AppContext.Provider value={{ 
      ...state, addAccount, updateAccount, deleteAccount, addTransaction, updateTransaction: async () => {}, deleteTransaction, 
      addGoal, updateGoal, contributeToGoal, updateSettings, updateUser, login, signUp, logout, notify,
      markNotificationsRead, clearNotifications,
      processReceivable, addDocument, deleteDocument, isAddModalOpen, setIsAddModalOpen,
      transactionModalType, setTransactionModalType, openTransactionModal
    }}>
      {children}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl bg-black text-white font-black text-[10px] uppercase tracking-widest border border-white/20">
          {toast.msg}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
