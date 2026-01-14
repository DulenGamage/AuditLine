
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Section, Card } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { formatCurrency } from '../utils/formatters';
import { AccountType, TransactionType } from '../types';
import { 
  ChevronLeft, 
  Bell, 
  ArrowRight, 
  Plus, 
  Minus, 
  X,
  CheckCircle2,
  Calendar,
  ChevronDown
} from 'lucide-react';

export const LoanDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, transactions, user, settings, updateAccount, addTransaction } = useApp();
  const [showEditPlan, setShowEditPlan] = useState(false);
  const [editAmount, setEditAmount] = useState<number>(0);

  const loan = accounts.find(a => a.id === id);
  // Fix: Corrected AccountType.LOAN to AccountType.LOAN_PAYABLE as it is the valid enum member for debt accounts
  if (!loan || loan.type !== AccountType.LOAN_PAYABLE) return <div>Loan not found</div>;

  // Fix: Using type casting to access loan-specific properties not yet explicitly defined in the standard Account interface
  const totalPrincipal = (loan as any).principal || (loan as any).capital || 40000;
  const outstanding = Math.abs(loan.balance);
  const repaid = totalPrincipal - outstanding;
  const repaidPercentage = Math.round((repaid / totalPrincipal) * 100);
  const remainingPercentage = 100 - repaidPercentage;

  const loanTransactions = transactions.filter(t => t.toAccountId === loan.id || t.fromAccountId === loan.id);

  const handleOpenEdit = () => {
    setEditAmount((loan as any).installmentAmount || 2000);
    setShowEditPlan(true);
  };

  const handleSavePlan = () => {
    updateAccount(loan.id, { installmentAmount: editAmount } as any);
    setShowEditPlan(false);
  };

  const installments = [
    { date: 'May 15', amount: 2000, paid: true },
    { date: 'June 15', amount: 2000, paid: true },
    { date: 'July 15', amount: 3000, paid: true },
    { date: 'August 15', amount: 3000, paid: true },
    { date: 'September 15', amount: 3000, paid: true },
    { date: 'October 15', amount: 3000, paid: true },
  ];

  return (
    <div className="space-y-6 pb-32 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <header className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Good morning {user.name}</h2>
            <p className="text-[10px] text-gray-400 font-medium">Today, October 2</p>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-black"></span>
        </button>
      </header>

      {/* Circular Progress */}
      <div className="flex flex-col items-center justify-center py-6 relative">
        <div className="relative w-56 h-56">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="24" fill="transparent" className="text-[#e8eaff] dark:text-zinc-800" />
            {/* Progress Circle */}
            <circle 
              cx="112" cy="112" r="90" 
              stroke="#6366f1" 
              strokeWidth="24" 
              fill="transparent" 
              strokeDasharray={565.5} 
              strokeDashoffset={565.5 - (565.5 * remainingPercentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black">{remainingPercentage}%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Remaining</span>
          </div>
          {/* Badge icon on chart */}
          <div className="absolute top-[10px] right-[110px] w-6 h-6 bg-white dark:bg-zinc-900 rounded-full border-2 border-indigo-500 flex items-center justify-center">
            <div className="w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[6px] font-bold">$</div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs font-bold text-gray-400 px-10 leading-relaxed">
        Great job staying on track, every payment brings you closer to financial freedom
      </p>

      {/* Loan Overview Card */}
      <Card className="bg-white dark:bg-zinc-900 border-none shadow-sm py-6">
        <div className="text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total loan amount</span>
          <p className="text-3xl font-black mt-1">
            {formatCurrency(totalPrincipal, settings.currency)}
          </p>
          <p className="text-[10px] font-bold text-gray-400 mt-2">
            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full inline-block mr-1"></span>
            Next due payment <span className="text-orange-500">November 2</span>
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-50 dark:border-white/5">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[6px] font-bold">$</div>
              <span className="text-[9px] font-bold text-gray-400 uppercase">Outstanding balance</span>
            </div>
            <p className="text-sm font-black">{formatCurrency(outstanding, settings.currency)}</p>
          </div>
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-2.5 h-2.5 bg-orange-400 rounded-full flex items-center justify-center text-white text-[6px] font-bold">$</div>
              <span className="text-[9px] font-bold text-gray-400 uppercase">Amount repaid</span>
            </div>
            <p className="text-sm font-black">{formatCurrency(repaid, settings.currency)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button className="py-3.5 bg-gray-50 dark:bg-zinc-800 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all">View history</button>
          <button className="py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Make Payment</button>
        </div>
      </Card>

      {/* Loan Breakdown */}
      <Section title="Loan breakdown">
        <div className="bg-[#f2f4ff] dark:bg-zinc-900 rounded-3xl p-6 space-y-4">
          <BreakdownItem label="Principal" value={formatCurrency(totalPrincipal, settings.currency)} />
          <BreakdownItem label="Interest rate" value={`${loan.interestRate}%`} />
          <BreakdownItem label="Loan Term" value={`${(loan as any).startDate || 'Jan 2021'} - ${(loan as any).endDate || 'Jan 2026'}`} />
          <BreakdownItem label="Repayment plan type" value={(loan as any).repaymentType || 'Monthly'} />
        </div>
      </Section>

      {/* Repayment Progress */}
      <Section title="Repayment progress">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 space-y-4">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
              {repaidPercentage}% repaid — {formatCurrency(repaid, settings.currency)} / {formatCurrency(totalPrincipal, settings.currency)}
            </span>
          </div>
          <div className="w-full h-4 bg-[#f0f2ff] dark:bg-zinc-800 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-[#00c566] transition-all duration-1000 flex items-center justify-center text-[8px] text-white font-bold" 
              style={{ width: `${repaidPercentage}%` }}
            >
              {repaidPercentage}%
            </div>
          </div>
        </div>
      </Section>

      {/* Installment Schedule */}
      <Section title="Installment schedule">
        <div className="bg-[#f2f4ff] dark:bg-zinc-900 rounded-3xl p-6 space-y-5">
          {installments.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{item.date}</span>
              <span className="text-xs font-black">{formatCurrency(item.amount, settings.currency)}</span>
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-white/60 dark:bg-zinc-800/60 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-[#00c566]" />
                <span className="text-[9px] font-bold text-gray-500">Paid</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Edit Payment Plan Button */}
      <div className="flex justify-center py-4">
        <button 
          onClick={handleOpenEdit}
          className="px-8 py-4 bg-blue-600 text-white font-bold text-sm rounded-3xl shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
        >
          Edit payment plan
        </button>
      </div>

      {/* Edit Modal */}
      {showEditPlan && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-0 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <div className="p-6 border-b border-gray-50 dark:border-white/5 flex justify-between items-center">
              <div className="w-8"></div>
              <h2 className="text-sm font-black">Edit payment plan</h2>
              <button onClick={() => setShowEditPlan(false)} className="w-8 h-8 flex items-center justify-center bg-gray-50 dark:bg-zinc-800 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Current plan brief */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current plan</span>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 font-medium">Balance remaining</span>
                    <span className="text-xs font-black">{formatCurrency(outstanding, settings.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 font-medium">Monthly amount</span>
                    <span className="text-xs font-black">{formatCurrency((loan as any).installmentAmount || 2000, settings.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 font-medium">Interest rate</span>
                    <span className="text-xs font-black">{loan.interestRate}%</span>
                  </div>
                </div>
              </div>

              {/* Payment Frequency */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment frequency</span>
                <div className="flex bg-gray-50 dark:bg-zinc-800 p-1 rounded-2xl">
                  {['Monthly', 'Bi-weekly', 'Custom'].map(freq => (
                    <button 
                      key={freq}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${(loan as any).repaymentType === freq || (freq === 'Monthly' && !(loan as any).repaymentType) ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Installment Amount Picker */}
              <div className="space-y-3">
                <div className="flex justify-center">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Choose installation amount</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 rounded-[2rem] p-4">
                  <button 
                    onClick={() => setEditAmount(Math.max(0, editAmount - 100))}
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                  >
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                  <span className="text-2xl font-black">{formatCurrency(editAmount, settings.currency)}</span>
                  <button 
                    onClick={() => setEditAmount(editAmount + 100)}
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Choose new payment date</span>
                <div className="flex items-center justify-between bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold">1 Nov 2025</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Info Tip */}
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-3 rounded-2xl flex items-center space-x-2">
                 <div className="w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-600 flex items-center justify-center text-[10px] text-amber-800 dark:text-amber-100 font-bold">i</div>
                 <p className="text-[10px] font-bold text-amber-600">New end date is Nov 2027</p>
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSavePlan}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
              >
                Save changes
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const BreakdownItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span className="text-xs font-black">{value}</span>
  </div>
);
