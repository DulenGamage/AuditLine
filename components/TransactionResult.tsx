
import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { Card } from './Layout';
import { formatCurrency } from '../utils/formatters';

interface TransactionResultProps {
  status: 'success' | 'error';
  transactionId: string;
  paymentMethod: string;
  date: string;
  amount: number;
  currency: string;
  onClose: () => void;
}

export const TransactionResult: React.FC<TransactionResultProps> = ({
  status,
  transactionId,
  paymentMethod,
  date,
  amount,
  currency,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300 border-none">
        {/* Scalloped Icon */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Scalloped background using SVG */}
            <svg width="80" height="80" viewBox="0 0 100 100" className={status === 'success' ? "text-emerald-100 dark:text-emerald-900/30" : "text-rose-100 dark:text-rose-900/30"}>
              <path
                fill="currentColor"
                d="M50 0 C54 10 65 10 70 5 C75 10 86 10 90 15 C95 20 95 31 100 36 C95 41 95 52 100 57 C95 62 95 73 90 78 C86 83 75 83 70 88 C65 83 54 83 50 88 C46 83 35 83 30 88 C25 83 14 83 10 78 C5 73 5 62 0 57 C5 52 5 41 0 36 C5 31 5 20 10 15 C14 10 25 10 30 5 C35 10 46 10 50 0 Z"
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center ${status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {status === 'success' ? <Check className="w-8 h-8 stroke-[3]" /> : <X className="w-8 h-8 stroke-[3]" />}
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black leading-tight px-4 text-gray-900 dark:text-white">
            {status === 'success' 
              ? "Your transaction has been successfully recorded" 
              : "Transaction could not be recorded"}
          </h2>
        </div>

        {/* Info Table */}
        <div className="border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
          <InfoRow label="Transaction ID" value={transactionId.slice(0, 8).toUpperCase()} />
          <InfoRow label="Payment Method" value={paymentMethod} />
          <InfoRow label="Date & Time" value={date} />
          <div className="flex justify-between items-center p-4 bg-gray-50/30 dark:bg-white/5">
            <span className="text-sm font-medium text-gray-400">Total</span>
            <span className="text-lg font-black">{formatCurrency(amount, currency)}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-[#1a1c1e] dark:bg-white text-white dark:text-black font-black py-5 rounded-2xl active:scale-95 transition-all shadow-xl shadow-black/10"
        >
          Go to my account
        </button>
      </Card>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center p-4">
    <span className="text-sm font-medium text-gray-400">{label}</span>
    <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
  </div>
);
