
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Layout, BrandLogo } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Goals } from './pages/Goals';
import { GoalDetail } from './pages/GoalDetail';
import { Calculator } from './pages/Calculator';
import { Documents } from './pages/Documents';
import { 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  Mail, 
  User, 
  Key, 
  Hash,
  Eye,
  EyeOff,
  Shield,
  WifiOff,
  RefreshCw
} from 'lucide-react';

const OfflineOverlay: React.FC = () => (
  <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-center p-8">
    <div className="w-full max-w-sm flex flex-col items-center space-y-12 text-center text-white">
      <WifiOff className="w-16 h-16 text-red-500" />
      <h2 className="text-3xl font-black">Connection Lost</h2>
      <button onClick={() => window.location.reload()} className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs">Manual Reconnect</button>
    </div>
  </div>
);

const AuthLanding: React.FC = () => {
  const { login, signUp } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (mode === 'SIGNUP') {
        await signUp(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-black">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-baseline space-x-1">
            <h1 className="text-5xl font-black tracking-tighter text-[#E31B23]">Audit</h1>
            <h1 className="text-5xl font-black tracking-tighter dark:text-white">Line</h1>
          </div>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.4em]">Enterprise Financial Gateway</p>
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] p-1.5">
          <button onClick={() => setMode('LOGIN')} className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'LOGIN' ? 'bg-white dark:bg-zinc-800 dark:text-white shadow-xl' : 'text-zinc-400'}`}>Login</button>
          <button onClick={() => setMode('SIGNUP')} className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SIGNUP' ? 'bg-white dark:bg-zinc-800 dark:text-white shadow-xl' : 'text-zinc-400'}`}>Signup</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'SIGNUP' && (
            <AuthInput icon={<User />} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <AuthInput icon={<Mail />} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <AuthInput icon={<Key />} type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <button type="submit" disabled={isProcessing} className="w-full h-18 bg-black dark:bg-white text-white dark:text-black rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] py-6 shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3">
            <span>{isProcessing ? 'Authenticating...' : (mode === 'LOGIN' ? 'Authorize Identity' : 'Create Account')}</span>
            {!isProcessing && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

const AuthInput: React.FC<any> = ({ icon, type, placeholder, value, onChange }) => (
  <div className="relative">
    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">{icon}</div>
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-[1.8rem] pl-16 pr-6 py-5 outline-none font-bold text-sm text-black dark:text-white" required />
  </div>
);

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppProvider>
      {!isOnline && <OfflineOverlay />}
      <Router>
        <AuthGate>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/goals/:id" element={<GoalDetail />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthGate>
      </Router>
    </AppProvider>
  );
};

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user.isLoggedIn) return <AuthLanding />;
  return <Layout>{children}</Layout>;
};

export default App;
