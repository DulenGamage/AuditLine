
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Section, Card } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { formatCurrency } from '../utils/formatters';
import { TransactionType } from '../types';
import { 
  ChevronLeft, 
  MoreVertical, 
  Target, 
  Plus, 
  TrendingUp,
  History,
  Info
} from 'lucide-react';

export const GoalDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, transactions, settings, contributeToGoal, accounts } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const goal = goals.find(g => g.id === id);
  if (!goal) return <div className="p-10 text-center font-black">Goal not found</div>;

  const goalTransactions = transactions.filter(t => t.goalId === goal.id);
  const percentage = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (topUpAmount && selectedAccountId) {
      contributeToGoal(goal.id, parseFloat(topUpAmount), selectedAccountId);
      setShowTopUp(false);
      setTopUpAmount('');
    }
  };

  return (
    <div className="space-y-6 pb-40 animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-center py-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">Goals</h2>
        <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Hero Visual */}
      <div className="flex flex-col items-center justify-center space-y-4 py-6">
        <div className="w-40 h-40 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] shadow-inner flex items-center justify-center relative">
          <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-[2rem] shadow-xl flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-white/5">
             <Target className="w-12 h-12" style={{ color: goal.color }} />
          </div>
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transform rotate-12">
            <span className="text-xs font-black">Success!</span>
          </div>
        </div>
        <h1 className="text-2xl font-black text-center text-zinc-900 dark:text-zinc-100">{goal.name}</h1>
        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/10 px-4 py-1.5 rounded-full flex items-center">
          <TrendingUp className="w-3 h-3 mr-1.5" /> 
          You'll reach this goal in {Math.round(daysLeft / 7)} weeks.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col justify-center items-center py-6 bg-white dark:bg-zinc-900 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Accumulated Savings</p>
          <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{formatCurrency(goal.savedAmount, settings.currency)}</p>
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-1">out of {formatCurrency(goal.targetAmount, settings.currency)}</p>
        </Card>
        <Card className="flex items-center justify-center py-6 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-100 dark:text-zinc-800" />
              <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="transition-all duration-1000" style={{ stroke: goal.color, strokeDasharray: 213.6, strokeDashoffset: 213.6 - (213.6 * percentage) / 100 }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-zinc-900 dark:text-zinc-100">{percentage}%</span>
          </div>
        </Card>
      </div>

      <Card className="bg-white dark:bg-zinc-900 py-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Financial Progress</span>
          <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">{formatCurrency(goal.targetAmount - goal.savedAmount, settings.currency)} to go</span>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
           <div className="h-full transition-all duration-1000" style={{ width: `${percentage}%`, backgroundColor: goal.color }}></div>
        </div>
        <div className="flex justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center"><History className="w-3 h-3 mr-1" /> {daysLeft} days remaining</span>
          <span className="flex items-center"><Info className="w-3 h-3 mr-1" /> Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
        </div>
      </Card>

      <Section title="Progress Line">
        <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-100 dark:before:bg-zinc-800">
          <JourneyItem active label="Ambition Defined" sub="Your strategic journey started." time="Phase 1" color={goal.color} />
          <JourneyItem active={percentage >= 25} label="25% Reached" sub="First quarter achieved." time="" color={percentage >= 25 ? goal.color : undefined} />
          <JourneyItem active={percentage >= 50} label="50% Midpoint" sub="Halfway to success." time="" color={percentage >= 50 ? goal.color : undefined} />
          <JourneyItem active={percentage >= 100} label="Target Secured" sub="Financial goal accomplished." time="" color={percentage >= 100 ? goal.color : undefined} />
        </div>
      </Section>

      <Section title="Contribution History" rightElement={<button className="text-xs font-black text-blue-600 uppercase">View All</button>}>
        <div className="space-y-4">
          {goalTransactions.length > 0 ? goalTransactions.map(tx => (
            <div key={tx.id} className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-white/5">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                   <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                   <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Capital Injection</p>
                   <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-600">+{formatCurrency(tx.amount, settings.currency)}</p>
              </div>
            </div>
          )) : (
            <p className="text-center text-zinc-400 dark:text-zinc-600 text-xs py-4 font-medium italic">No injections recorded yet.</p>
          )}
        </div>
      </Section>

      <div className="fixed bottom-32 left-6 right-6 z-40">
        <button 
          onClick={() => setShowTopUp(true)}
          className="w-full h-16 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-[2rem] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-all border border-white/5"
        >
          <Plus className="w-6 h-6" />
          <span className="font-black uppercase tracking-widest text-xs">Inject Capital</span>
        </button>
      </div>

      {showTopUp && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20 border-none">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Capital Injection</h2>
                <button onClick={() => setShowTopUp(false)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400"><Plus className="rotate-45" /></button>
             </div>
             <form onSubmit={handleTopUp} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Allocation Amount</label>
                  <input 
                    type="number"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 rounded-2xl py-4 px-4 outline-none text-2xl font-black text-zinc-900 dark:text-zinc-100"
                    placeholder="0.00"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Funding Account</label>
                  <select 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 rounded-2xl py-4 px-4 outline-none font-bold text-sm text-zinc-900 dark:text-zinc-100"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    required
                  >
                    <option value="">Select Wallet</option>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({formatCurrency(acc.balance, settings.currency)})</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-3xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest">
                  Process Injection
                </button>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};

const JourneyItem: React.FC<{ active: boolean, label: string, sub: string, time: string, color?: string }> = ({ active, label, sub, time, color }) => (
  <div className="relative">
    <div className={`absolute -left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white dark:border-black z-10 ${active ? 'bg-white dark:bg-zinc-900 shadow-md' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
       {active && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color || '#ddd' }}></div>}
    </div>
    <div className="flex justify-between items-start">
      <div>
        <h4 className={`text-sm font-black ${active ? 'text-zinc-900 dark:text-white' : 'text-zinc-300 dark:text-zinc-700'}`}>{label}</h4>
        <p className={`text-[10px] font-bold mt-0.5 leading-relaxed ${active ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-200 dark:text-zinc-800'}`}>{sub}</p>
      </div>
      <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{time}</span>
    </div>
  </div>
);
