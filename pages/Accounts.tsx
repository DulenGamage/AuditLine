
import React, { useState, useEffect } from 'react';
import { Section, Card, EmptyState } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { AccountType, Account } from '../types';
import { formatCurrency, parseCommaNumber } from '../utils/formatters';
import { 
  Plus, 
  X, 
  Landmark, 
  ChevronLeft,
  Wallet,
  Gem,
  LayoutGrid,
  Building,
  CreditCard,
  Clock,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Accounts: React.FC = () => {
  const { accounts, addAccount, deleteAccount, settings, user } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: AccountType.SAVINGS,
    balance: '',
    bankName: '',
    accountNumber: '',
    interestRate: '',
    maturityDate: '',
    interestClaimFrequency: 'MONTHLY' as 'MONTHLY' | 'ANNUALLY',
    customColors: { start: '#3b82f6', end: '#1d4ed8' },
    logoType: 'bank' as any,
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolderName: user.name,
    cardNetwork: 'UNKNOWN' as any,
    // Loan Specific
    capital: '',
    loanPeriodMonths: '12',
    gracePeriod: '0',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Automatic Network Detection
  useEffect(() => {
    const num = formData.cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) setFormData(prev => ({...prev, cardNetwork: 'VISA', logoType: 'visa'}));
    else if (num.startsWith('5')) setFormData(prev => ({...prev, cardNetwork: 'MASTERCARD', logoType: 'mastercard'}));
    else if (num.startsWith('3')) setFormData(prev => ({...prev, cardNetwork: 'AMEX', logoType: 'custom'}));
    else setFormData(prev => ({...prev, cardNetwork: 'UNKNOWN', logoType: 'bank'}));
  }, [formData.cardNumber]);

  const isCardType = formData.type === AccountType.CREDIT_CARD || formData.type === AccountType.DEBIT_CARD;
  const isInvestment = formData.type === AccountType.INVESTMENT || formData.type === AccountType.FIXED_DEPOSIT;
  const isLoan = formData.type === AccountType.LOAN_PAYABLE || formData.type === AccountType.LOAN_RECEIVABLE;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseCommaNumber(formData.balance) || 0;
    
    const accountPayload: any = {
      name: formData.name,
      type: formData.type,
      balance: balance,
      bankName: formData.bankName,
      customColors: formData.customColors,
      logoType: formData.logoType,
    };

    if (isInvestment || isLoan) {
      accountPayload.interestRate = parseFloat(formData.interestRate) || 0;
      accountPayload.interestClaimFrequency = formData.interestClaimFrequency;
    }

    if (isLoan) {
      accountPayload.capital = parseCommaNumber(formData.capital) || balance;
      accountPayload.loanPeriodMonths = parseInt(formData.loanPeriodMonths) || 12;
      accountPayload.gracePeriod = parseInt(formData.gracePeriod) || 0;
      accountPayload.startDate = formData.startDate;
    }

    if (isCardType) {
      accountPayload.cardDetails = {
        number: formData.cardNumber || '•••• •••• •••• 0000',
        expiry: formData.cardExpiry || '12/28',
        cvv: formData.cardCvv || '•••',
        holderName: formData.cardHolderName || user.name,
        network: formData.cardNetwork
      };
    } else {
      accountPayload.accountNumber = formData.accountNumber;
    }

    addAccount(accountPayload);
    setShowAdd(false);
    setAddStep(1);
    setFormData({
      name: '', type: AccountType.SAVINGS, balance: '', bankName: '', accountNumber: '',
      interestRate: '', maturityDate: '', interestClaimFrequency: 'MONTHLY',
      customColors: { start: '#3b82f6', end: '#1d4ed8' }, logoType: 'bank',
      cardNumber: '', cardExpiry: '', cardCvv: '', cardHolderName: user.name, cardNetwork: 'UNKNOWN',
      capital: '', loanPeriodMonths: '12', gracePeriod: '0', startDate: new Date().toISOString().split('T')[0]
    });
  };

  const groupedAccounts = accounts.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<AccountType, Account[]>);

  // Fix: Cast Object.entries to provide explicit typing for the account list entries
  const wheelData = (Object.entries(groupedAccounts) as [string, Account[]][]).map(([type, list]) => ({
    name: type.replace('_', ' '),
    value: list.reduce((sum, a) => sum + Math.abs(a.balance), 0)
  })).filter(d => d.value > 0);

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#14b8a6'];

  const getLogoIcon = (type: string) => {
    switch(type) {
      case 'visa': return <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="w-8 h-8 filter brightness-200" alt="Visa" />;
      case 'mastercard': return <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="w-8 h-8" alt="Mastercard" />;
      case 'bank': return <Landmark className="w-6 h-6 text-white" />;
      default: return <Building className="w-6 h-6 text-white" />;
    }
  };

  const resetAddModal = () => {
    setShowAdd(false);
    setAddStep(1);
  };

  if (accounts.length === 0 && !showAdd) {
    return (
      <EmptyState 
        icon={<Gem />}
        title="Asset Initialization"
        description="Every portfolio starts with structure. Establish your bank accounts, cards, and investments."
        actionLabel="Build Portfolio"
        onAction={() => setShowAdd(true)}
        accentColor="emerald"
      />
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 lg:pb-10 pb-32">
      {!selectedAccount ? (
        <>
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-black text-black dark:text-white tracking-tighter">Portfolio</h1>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Allocation Matrix</p>
              <button 
                onClick={() => setShowAdd(true)}
                className="mt-6 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-xl shadow-black/10"
              >
                <Plus className="w-4 h-4" /> Add New Asset
              </button>
            </div>
            
            <Card className="lg:w-96 w-full h-52 flex flex-col items-center justify-center relative bg-white dark:bg-[#121212] shadow-2xl border-none p-0 overflow-hidden ring-1 ring-black/5">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={wheelData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value" stroke="none">
                      {wheelData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: 'bold', fontSize: '10px' }} 
                      formatter={(v: number) => formatCurrency(v, settings.currency)} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Total Wealth</span>
                  <span className="text-sm font-black">{formatCurrency(accounts.reduce((s, a) => s + a.balance, 0), settings.currency)}</span>
                </div>
            </Card>
          </header>

          <div className="space-y-12">
            {(Object.entries(groupedAccounts) as [AccountType, Account[]][]).map(([type, list]) => (
              <Section key={type} title={type.replace('_', ' ')} rightElement={<LayoutGrid className="w-4 h-4 text-zinc-300" />}>
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 no-scrollbar -mx-6 px-6 pb-4">
                  {list.map(acc => (
                    <Card 
                      key={acc.id}
                      onClick={() => setSelectedAccount(acc)}
                      className="snap-center shrink-0 w-[85vw] lg:w-[360px] h-56 text-white border-none flex flex-col justify-between p-8 shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${acc.customColors?.start || '#000'}, ${acc.customColors?.end || '#222'})` }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg border border-white/10">
                            {acc.cardDetails ? <CreditCard className="w-6 h-6 text-white"/> : <Wallet className="w-6 h-6 text-white"/>}
                          </div>
                          <div>
                            <p className="font-black text-xl tracking-tight leading-none">{acc.name}</p>
                            <p className="text-[10px] font-bold opacity-60 tracking-widest uppercase mt-1">{acc.bankName || acc.type}</p>
                          </div>
                        </div>
                        <div className="opacity-70">{getLogoIcon(acc.logoType || 'bank')}</div>
                      </div>
                      <div className="flex justify-between items-end">
                         <div className="text-[10px] font-mono tracking-[0.2em] opacity-60">
                           {acc.cardDetails ? acc.cardDetails.number.replace(/\d(?=\d{4})/g, "•") : (acc.accountNumber || '•••• •••• ••••')}
                         </div>
                         <div className="text-right">
                            <p className="text-2xl font-black leading-none">{formatCurrency(acc.balance, settings.currency)}</p>
                         </div>
                      </div>
                    </Card>
                  ))}
                  <button onClick={() => { setAddStep(1); setShowAdd(true); }} className="snap-center shrink-0 w-[85vw] lg:w-[360px] h-56 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-zinc-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Add Asset</span>
                  </button>
                </div>
              </Section>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto space-y-8">
           <header className="flex items-center space-x-6">
             <button onClick={() => setSelectedAccount(null)} className="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/5 shadow-sm active:scale-90 transition-transform"><ChevronLeft className="w-6 h-6" /></button>
             <h2 className="text-3xl font-black tracking-tight">{selectedAccount.name}</h2>
           </header>
           
           <Card 
            className="text-white border-none py-10 px-10 space-y-12 shadow-2xl rounded-[3rem]"
            style={{ background: `linear-gradient(135deg, ${selectedAccount.customColors?.start || '#000'}, ${selectedAccount.customColors?.end || '#222'})` }}
           >
              <div className="flex justify-between items-start">
                 <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md shadow-xl border border-white/10">
                   {selectedAccount.cardDetails ? <CreditCard className="w-14 h-14 text-white" /> : <Wallet className="w-14 h-14 text-white" />}
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] opacity-70 font-bold uppercase tracking-[0.2em] mb-1">{selectedAccount.bankName || 'Financial Institution'}</p>
                   <p className="text-2xl font-mono tracking-widest">{selectedAccount.cardDetails?.number || selectedAccount.accountNumber || '•••• •••• •••• ••••'}</p>
                 </div>
              </div>

              <div className="py-6">
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Portfolio Valuation</p>
                <h3 className="text-6xl font-black tracking-tighter">{formatCurrency(selectedAccount.balance, settings.currency)}</h3>
              </div>

              {selectedAccount.cardDetails && (
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-80 border-t border-white/10 pt-10">
                   <div className="space-y-1"><span>Holder</span><p className="text-sm">{selectedAccount.cardDetails.holderName}</p></div>
                   <div className="text-center space-y-1"><span>Expiry</span><p className="text-sm">{selectedAccount.cardDetails.expiry}</p></div>
                   <div className="text-right space-y-1"><span>Cvv</span><p className="text-sm">•••</p></div>
                </div>
              )}
           </Card>

           <div className="flex justify-end gap-4">
              <button 
                onClick={() => { deleteAccount(selectedAccount.id); setSelectedAccount(null); }}
                className="px-8 py-4 bg-rose-500/10 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-rose-500/20 active:scale-95 transition-all shadow-sm"
              >
                Liquidate Record
              </button>
           </div>
        </div>
      )}

      {/* Multi-Step Add Asset Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-[3rem] p-10 space-y-8 shadow-2xl border-none max-h-[95vh] overflow-y-auto no-scrollbar">
             <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black tracking-tight leading-none text-black dark:text-white">
                  {addStep === 1 ? 'Asset Class' : addStep === 2 ? 'Audit Details' : 'Aesthetics'}
                </h2>
                <button onClick={resetAddModal} className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center active:scale-90 transition-transform"><X className="w-6 h-6 text-black dark:text-white" /></button>
             </div>

             <div className="flex space-x-2">
                {[1, 2, 3].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${addStep >= s ? 'bg-blue-600' : 'bg-zinc-100 dark:bg-zinc-800'}`} />)}
             </div>

             <form onSubmit={handleAdd} className="space-y-8">
                {addStep === 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in slide-in-from-right-4 duration-300">
                    {Object.values(AccountType).map(t => (
                      <button 
                        key={t} type="button" onClick={() => { setFormData({...formData, type: t}); setAddStep(2); }}
                        className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center justify-center space-y-3 transition-all ${formData.type === t ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'border-zinc-50 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                      >
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1 ${formData.type === t ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                           {[AccountType.CREDIT_CARD, AccountType.DEBIT_CARD].includes(t) ? <CreditCard className="w-6 h-6" /> : 
                            [AccountType.LOAN_PAYABLE, AccountType.LOAN_RECEIVABLE].includes(t) ? <Clock className="w-6 h-6" /> : 
                            t === AccountType.INVESTMENT ? <TrendingUp className="w-6 h-6" /> : <Wallet className="w-6 h-6" />}
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-center">{t.replace('_', ' ')}</span>
                      </button>
                    ))}
                  </div>
                )}

                {addStep === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Asset Label</label>
                        <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" placeholder="e.g. Wealth Hub" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Current Balance</label>
                        <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-black text-xl text-blue-600" placeholder="0.00" value={formData.balance} onChange={(e) => setFormData({...formData, balance: e.target.value})} required />
                      </div>
                      
                      {!isCardType ? (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Institution</label>
                            <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} placeholder="e.g. Global Bank" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Acc/Ref Number</label>
                            <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} placeholder="•••• •••• ••••" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Card Number</label>
                            <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} placeholder="0000 0000 0000 0000" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Expiry</label>
                              <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" value={formData.cardExpiry} onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})} placeholder="MM/YY" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">CVV</label>
                              <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" value={formData.cardCvv} onChange={(e) => setFormData({...formData, cardCvv: e.target.value})} placeholder="•••" />
                            </div>
                          </div>
                        </>
                      )}

                      {(isInvestment || isLoan) && (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Interest % (p.a.)</label>
                            <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" type="number" step="0.01" value={formData.interestRate} onChange={(e) => setFormData({...formData, interestRate: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Accrual Freq</label>
                            <select className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" value={formData.interestClaimFrequency} onChange={(e) => setFormData({...formData, interestClaimFrequency: e.target.value as any})}>
                               <option value="MONTHLY">Monthly</option>
                               <option value="ANNUALLY">Annually</option>
                            </select>
                          </div>
                        </>
                      )}

                      {isLoan && (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Principal Capital</label>
                            <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" value={formData.capital} onChange={(e) => setFormData({...formData, capital: e.target.value})} placeholder="Original Amount" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Period (Months)</label>
                            <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" type="number" value={formData.loanPeriodMonths} onChange={(e) => setFormData({...formData, loanPeriodMonths: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Start Date</label>
                            <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Grace Period (Mo)</label>
                            <input className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-2xl py-4 px-6 font-bold text-black dark:text-white" type="number" value={formData.gracePeriod} onChange={(e) => setFormData({...formData, gracePeriod: e.target.value})} />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      <button type="button" onClick={() => setAddStep(1)} className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-3xl font-black text-[10px] uppercase tracking-widest text-black dark:text-white">Back</button>
                      <button type="button" onClick={() => setAddStep(3)} className="flex-[2] py-4 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl">Customize Aesthetic</button>
                    </div>
                  </div>
                )}

                {addStep === 3 && (
                  <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-col items-center">
                       <div 
                        className="w-full max-w-sm h-52 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl transition-all duration-500 mb-8 ring-4 ring-black/5"
                        style={{ background: `linear-gradient(135deg, ${formData.customColors.start}, ${formData.customColors.end})` }}
                       >
                          <div className="flex justify-between items-start">
                             <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg border border-white/10">
                               {isCardType ? <CreditCard className="w-6 h-6 text-white"/> : <Wallet className="w-6 h-6 text-white"/>}
                             </div>
                             {getLogoIcon(formData.logoType)}
                          </div>
                          <div>
                             <p className="font-black text-xl tracking-tight leading-none">{formData.name || 'Account Label'}</p>
                             <p className="text-[9px] font-bold uppercase opacity-60 tracking-[0.3em] mt-2">{formData.bankName || 'Financial Hub'}</p>
                          </div>
                       </div>

                       <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-zinc-400 block ml-1">Gradient Signature</label>
                            <div className="flex items-center space-x-4">
                              <div className="flex-1 space-y-1">
                                <span className="text-[8px] font-black text-zinc-500 uppercase ml-1">Primary RGB</span>
                                <input type="color" className="w-full h-12 bg-transparent border-none outline-none cursor-pointer" value={formData.customColors.start} onChange={(e) => setFormData({...formData, customColors: {...formData.customColors, start: e.target.value}})} />
                              </div>
                              <div className="flex-1 space-y-1">
                                <span className="text-[8px] font-black text-zinc-500 uppercase ml-1">Accent RGB</span>
                                <input type="color" className="w-full h-12 bg-transparent border-none outline-none cursor-pointer" value={formData.customColors.end} onChange={(e) => setFormData({...formData, customColors: {...formData.customColors, end: e.target.value}})} />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-zinc-400 block ml-1">Identity Mark</label>
                            <div className="grid grid-cols-4 gap-2">
                              {['bank', 'visa', 'mastercard', 'custom'].map(l => (
                                <button 
                                  key={l} type="button" onClick={() => setFormData({...formData, logoType: l as any})}
                                  className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${formData.logoType === l ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-100 dark:border-white/5'}`}
                                >
                                  <div className="scale-75">{getLogoIcon(l)}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex space-x-4">
                      <button type="button" onClick={() => setAddStep(2)} className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-3xl font-black text-[10px] uppercase tracking-widest text-black dark:text-white">Back</button>
                      <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 transition-all">Secure Asset Entry</button>
                    </div>
                  </div>
                )}
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};
