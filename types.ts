
export enum AccountType {
  SAVINGS = 'SAVINGS',
  CURRENT = 'CURRENT',
  FIXED_DEPOSIT = 'FIXED_DEPOSIT',
  LOAN_PAYABLE = 'LOAN_PAYABLE',
  LOAN_RECEIVABLE = 'LOAN_RECEIVABLE',
  INVESTMENT = 'INVESTMENT',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY'
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
  SALARY = 'SALARY',
  DIVIDEND = 'DIVIDEND',
  BONUS = 'BONUS',
  GIFT = 'GIFT',
  RENTAL = 'RENTAL',
  INTEREST_EARNED = 'INTEREST_EARNED',
  BILL = 'BILL',
  TAX = 'TAX',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  INVESTMENT_OUT = 'INVESTMENT_OUT',
  SUBSCRIPTION = 'SUBSCRIPTION',
  GROCERIES = 'GROCERIES',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER'
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  date: string;
  read: boolean;
}

export interface Receivable {
  id: string;
  accountId: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'RECEIVED';
  description: string;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  holderName: string;
  network: 'VISA' | 'MASTERCARD' | 'AMEX' | 'UNKNOWN';
}

export interface DocFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  data: string; // base64
  date: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  accountNumber?: string;
  bankName?: string;
  interestRate?: number;
  maturityDate?: string;
  interestClaimFrequency?: 'MONTHLY' | 'ANNUALLY';
  capital?: number;
  gracePeriod?: number; // months
  loanPeriodMonths?: number;
  startDate?: string;
  colorGradient?: string;
  customColors?: { start: string; end: string };
  logoType?: 'default' | 'bank' | 'visa' | 'mastercard' | 'apple' | 'google' | 'custom';
  customLogo?: string;
  cardDetails?: CardDetails;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  category: string;
  isPinned: boolean;
  createdAt: string;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: TransactionType;
  fromAccountId: string;
  toAccountId: string;
  category: string;
  isRecurring: boolean;
  recurrencePeriod?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  goalId?: string;
}

export interface UserSettings {
  currency: string;
  theme: 'system' | 'light' | 'dark';
  notifications: boolean;
  onboardingCompleted: boolean;
  reportEmail?: string;
  autoEmailEnabled?: boolean;
  lastReportDispatch?: string;
}

export interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  goals: Goal[];
  receivables: Receivable[];
  documents: DocFile[];
  notifications: AppNotification[];
  settings: UserSettings;
  user: {
    id: string;
    name: string;
    email: string;
    isLoggedIn: boolean;
    sessionToken?: string;
    lastLogin?: string;
  };
}
