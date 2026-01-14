
export const formatCurrency = (amount: number, currency: string = 'LKR') => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (val: number) => {
  return new Intl.NumberFormat('en-LK').format(val);
};

export const parseCommaNumber = (str: string) => {
  return parseFloat(str.replace(/,/g, ''));
};

export const getStatusColor = (balance: number) => {
  if (balance > 0) return 'text-emerald-600 dark:text-emerald-400';
  if (balance < 0) return 'text-rose-600 dark:text-rose-400';
  return 'text-slate-600 dark:text-slate-400';
};
