
import React, { useState } from 'react';
import { Section, Card } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { formatCurrency } from '../utils/formatters';
import { Calculator as CalcIcon, History, Zap } from 'lucide-react';

export const Calculator: React.FC = () => {
  const { settings } = useApp();
  const [loanAmount, setLoanAmount] = useState('1000000');
  const [interestRate, setInterestRate] = useState('12');
  const [tenure, setTenure] = useState('12');

  const p = parseFloat(loanAmount.replace(/,/g, '')) || 0;
  const r = (parseFloat(interestRate) || 0) / 12 / 100;
  const n = parseInt(tenure) || 0;

  const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  return (
    <div className="space-y-6 pb-32 animate-in fade-in duration-500">
      <header className="py-6">
        <h1 className="text-3xl font-black tracking-tight">Loan Calculator</h1>
        <p className="text-gray-400 text-sm font-medium">Plan your borrowing accurately.</p>
      </header>

      <Card className="p-8 space-y-6 border-none shadow-sm">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Loan Principal</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-5 outline-none font-black text-xl"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Interest Rate (%)</label>
              <input 
                type="number" 
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-5 outline-none font-bold"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Period (Months)</label>
              <input 
                type="number" 
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/5 rounded-2xl py-4 px-5 outline-none font-bold"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-blue-600 text-white border-none p-8 flex flex-col items-center justify-center space-y-2 shadow-xl shadow-blue-500/20">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Monthly Installment (EMI)</p>
           <h2 className="text-4xl font-black">{formatCurrency(emi, settings.currency)}</h2>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 flex flex-col items-center border-none shadow-sm">
             <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Total Interest</p>
             <p className="text-sm font-black text-rose-500">{formatCurrency(totalInterest, settings.currency)}</p>
          </Card>
          <Card className="p-6 flex flex-col items-center border-none shadow-sm">
             <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Total Payment</p>
             <p className="text-sm font-black text-emerald-500">{formatCurrency(totalPayment, settings.currency)}</p>
          </Card>
        </div>
      </div>

      <Section title="Repayment Tip">
         <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-5 rounded-3xl flex items-start space-x-4">
            <Zap className="w-6 h-6 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
              Consider making early repayments to save significantly on total interest over the loan lifetime. Even small monthly additions can reduce your tenure by months.
            </p>
         </div>
      </Section>
    </div>
  );
};
