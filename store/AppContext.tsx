
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AppState, Account, Transaction, Goal, AccountType, TransactionType, UserSettings, Receivable, DocFile, AppNotification } from '../types';

// Replace these with your actual Supabase Project URL and Anon Key from the dashboard
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  login: (name: string, email: string, digitalId: string) => Promise<void>;
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
    name: 'Audit User',
    email: 'user@auditline.it',
    isLoggedIn: false,
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [toast, setToast] = useState<{msg: string, type: string} | null>(null);

  // REAL-TIME SYNC: Fetch data when user logs in
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userId = session.user.id;
        
        // Fetch Parallel Data
        const [accountsData, transactionsData, goalsData] = await Promise.all([
          supabase.from('accounts').select('*').eq('user_id', userId),
          supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
          supabase.from('goals').select('*').eq('user_id', userId),
        ]);

        setState(prev => ({
          ...prev,
          user: { 
            id: userId, 
            name: session.user.user_metadata.full_name || 'Audit User',
            email: session.user.email || '',
            isLoggedIn: true 
          },
          accounts: accountsData.data || [],
          transactions: transactionsData.data || [],
          goals: goalsData.data || []
        }));
      }
    };

    fetchData();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchData();
      else setState(INITIAL_STATE);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const openTransactionModal = (type: TransactionType = TransactionType.EXPENSE) => {
    setTransactionModalType(type);
    setIsAddModalOpen(true);
  };

  // REAL BACKEND ACTIONS
  const login = async (name: string, email: string, digitalId: string) => {
    // Note: In a real Supabase flow, you'd use supabase.auth.signUp or signIn
    // For this guide, we simulate the handshake
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
    notify("Authentication Link dispatched to your email.", "success", "Security");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState(INITIAL_STATE);
  };

  const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase.from('accounts').insert([{
      ...accountData,
      user_id: state.user.id
    }]).select();

    if (error) return notify(error.message, "error");
    setState(prev => ({ ...prev, accounts: [...prev.accounts, data[0]] }));
    notify(`Asset "${accountData.name}" established in secure database.`, 'success', 'Portfolio');
  };

  const addTransaction = async (txData: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase.from('transactions').insert([{
      ...txData,
      user_id: state.user.id
    }]).select();

    if (error) return notify(error.message, "error");

    // Atomic update of balances would ideally be handled via a Postgres Trigger in Supabase
    // But for the UI, we update the local state immediately
    setState(prev => {
      const updatedAccounts = prev.accounts.map(acc => {
        let bal = acc.balance;
        if (acc.id === txData.fromAccountId) bal -= txData.amount;
        if (acc.id === txData.toAccountId) bal += txData.amount;
        return { ...acc, balance: bal };
      });
      return { ...prev, accounts: updatedAccounts, transactions: [data[0], ...prev.transactions] };
    });
    notify("Transaction verified and written to ledger.", "success");
  };

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    await supabase.from('accounts').update(updates).eq('id', id);
    setState(prev => ({ ...prev, accounts: prev.accounts.map(a => a.id === id ? { ...a, ...updates } : a) }));
  };

  const deleteAccount = async (id: string) => {
    await supabase.from('accounts').delete().eq('id', id);
    setState(prev => ({ ...prev, accounts: prev.accounts.filter(a => a.id !== id) }));
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    await supabase.from('transactions').update(updates).eq('id', id);
    setState(prev => ({ ...prev, transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t) }));
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id);
    setState(prev => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt' | 'savedAmount'>) => {
    const { data } = await supabase.from('goals').insert([{ ...goal, user_id: state.user.id }]).select();
    if (data) setState(prev => ({ ...prev, goals: [...prev.goals, data[0]] }));
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    await supabase.from('goals').update(updates).eq('id', id);
    setState(prev => ({ ...prev, goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g) }));
  };

  const contributeToGoal = async (goalId: string, amount: number, fromAccountId: string) => {
    await addTransaction({
      date: new Date().toISOString(),
      amount,
      description: `Capital Contribution`,
      type: TransactionType.EXPENSE,
      fromAccountId,
      toAccountId: '',
      category: 'invest',
      isRecurring: false,
      goalId
    });
    await supabase.rpc('increment_goal', { goal_id: goalId, amount });
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  };

  const updateUser = async (updates: Partial<{ name: string; email: string }>) => {
    setState(prev => ({ ...prev, user: { ...prev.user, ...updates } }));
  };

  const addDocument = async (doc: Omit<DocFile, 'id' | 'date'>) => {
    // In production, upload base64 to Supabase Storage and store the URL in the DB
    setState(prev => ({ ...prev, documents: [{ ...doc, id: Math.random().toString(), date: new Date().toISOString() }, ...prev.documents] }));
  };

  const deleteDocument = async (id: string) => {
    setState(prev => ({ ...prev, documents: prev.documents.filter(d => d.id !== id) }));
  };

  const markNotificationsRead = () => setState(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, read: true })) }));
  const clearNotifications = () => setState(prev => ({ ...prev, notifications: [] }));
  
  const processReceivable = async (receivableId: string) => {
    // Logic for marking a pending receivable as collected
  };

  return (
    <AppContext.Provider value={{ 
      ...state, addAccount, updateAccount, deleteAccount, addTransaction, updateTransaction, deleteTransaction, 
      addGoal, updateGoal, contributeToGoal, updateSettings, updateUser, login, logout, notify,
      markNotificationsRead, clearNotifications,
      processReceivable, addDocument, deleteDocument, isAddModalOpen, setIsAddModalOpen,
      transactionModalType, setTransactionModalType, openTransactionModal
    }}>
      {children}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl bg-black text-white font-black text-[10px] uppercase tracking-widest border border-white/20 animate-in slide-in-from-bottom-10 fade-in duration-300">
          {toast.msg}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp error');
  return context;
};
