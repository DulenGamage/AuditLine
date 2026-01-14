
import React, { useState } from 'react';
import { Section, Card, EmptyState } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { formatCurrency, parseCommaNumber } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  ChevronRight,
  Target,
  X,
  History,
  Flag
} from 'lucide-react';

export const Goals: React.FC = () => {
  const { goals, settings, addGoal } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: new Date().toISOString().split('T')[0],
    category: 'savings',
    color: '#9171f2'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addGoal({
      name: formData.name,
      targetAmount: parseCommaNumber(formData.targetAmount) || 0,
      deadline: formData.deadline,
      category: formData.category,
      color: formData.color,
      isPinned: false
    });
    setFormData({ name: '', targetAmount: '', deadline: new Date().toISOString().split('T')[0], category: 'savings', color: '#9171f2' });
    setShowAdd(false);
  };

  const calculateDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (goals.length === 0 && !showAdd) {
    return (
      <EmptyState 
        icon={<Flag />}
        title="Financial Ambition"
        description="What are you saving for? Set concrete financial milestones and track your progress toward them."
        actionLabel="Define New Goal"
        onAction={() => setShowAdd(true)}
        accentColor="purple"
      />
    );
  }

  return (
    <div className="space-y-6 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mt-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tighter text-zinc-900 dark:text-zinc-100">My Goals</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 bg-purple-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <Section title="Active Targets">
        <div className="space-y-4">
          {goals.map(goal => {
            const perc = Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
            return (
              <Link to={`/goals/${goal.id}`} key={goal.id} className="block group">
                <Card className="flex flex-col space-y-4 p-6 active:scale-[0.98] transition-all border-none shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${goal.color}20` }}>
                        <Target className="w-6 h-6" style={{ color: goal.color }} />
                      </div>
                      <span className="font-black text-lg text-zinc-900 dark:text-zinc-100">{goal.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                  </div>
                  
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span style={{ color: goal.color }}>{formatCurrency(goal.savedAmount, settings.currency)}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{formatCurrency(goal.targetAmount, settings.currency)}</span>
                  </div>

                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                     <div className="h-full transition-all duration-1000" style={{ width: `${perc}%`, backgroundColor: goal.color }}></div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center">
                      <History className="w-3.5 h-3.5 mr-1.5" />
                      {calculateDaysLeft(goal.deadline)} DAYS REMAINING
                    </span>
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                      {perc}% COMPLETE
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Add Goal Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-[3.5rem] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20 border-none">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Set New Goal</h2>
                <button onClick={() => setShowAdd(false)} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center transition-transform hover:rotate-90 active:scale-90 text-zinc-500 dark:text-zinc-400"><X className="w-5 h-5" /></button>
             </div>
             
             <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Goal Designation</label>
                  <input 
                    type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-2xl py-4 px-5 outline-none font-bold text-sm text-zinc-900 dark:text-zinc-100"
                    placeholder="e.g. Dream Wedding" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Target Amount</label>
                    <input 
                      type="text" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-2xl py-4 px-5 outline-none font-black text-blue-600"
                      placeholder="0.00" value={formData.targetAmount} onChange={(e) => setFormData({...formData, targetAmount: e.target.value})} required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Theme Color</label>
                    <input 
                      type="color" className="w-full h-14 bg-transparent border-none outline-none cursor-pointer"
                      value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Target Deadline</label>
                  <input 
                    type="date" className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-2xl py-4 px-5 outline-none font-bold text-zinc-900 dark:text-zinc-100"
                    value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} required
                  />
                </div>

                <button type="submit" className="w-full bg-zinc-900 dark:bg-white dark:text-black text-white font-black py-6 rounded-[2.5rem] shadow-2xl active:scale-95 transition-all text-lg tracking-tight">
                  Launch Goal
                </button>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};
