
import React, { useState, useEffect, useRef } from 'react';
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
import { LoanDetail } from './pages/LoanDetail';
import { Calculator } from './pages/Calculator';
import { Documents } from './pages/Documents';
import { 
  ShieldCheck, 
  Fingerprint, 
  Lock, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  Mail, 
  User, 
  Key, 
  Hash,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  Shield,
  WifiOff,
  RefreshCw
} from 'lucide-react';

const OfflineOverlay: React.FC = () => (
  <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
    <div className="w-full max-w-sm flex flex-col items-center space-y-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-red-600 rounded-full blur-[60px] opacity-20 animate-pulse"></div>
        <BrandLogo className="w-24 h-24 relative z-10" bg="bg-white/10" iconColor="white" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-3 text-red-500">
          <WifiOff className="w-6 h-6" />
          <h2 className="text-3xl font-black tracking-tighter text-white">Connection Lost</h2>
        </div>
        <p className="text-zinc-400 font-medium text-sm leading-relaxed max-w-[280px] mx-auto">
          AuditLine secure protocol requires an active uplink. Re-establishing link to Maweli servers...
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6 w-full">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-[#E31B23] rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Syncing Cryptographic Keys</p>
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all flex items-center space-x-3 active:scale-95"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Manual Reconnect</span>
      </button>
    </div>
  </div>
);

const AuthLanding: React.FC = () => {
  const { login, settings, updateSettings } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'ONBOARDING'>('LOGIN');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [digitalId, setDigitalId] = useState('');
  const [password, setPassword] = useState('');
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - card.left) / card.width;
    const y = (e.clientY - card.top) / card.height;
    setTilt({ x: (x - 0.5) * 25, y: (y - 0.5) * -25 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'SIGNUP') {
      setMode('ONBOARDING');
    } else {
      setIsProcessing(true);
      await login(name || 'Audit User', email || `${digitalId}@auditline.it`, digitalId);
      setIsProcessing(false);
    }
  };

  const completeOnboarding = async () => {
    setIsProcessing(true);
    await login(name, email || `${digitalId}@auditline.it`, digitalId);
    updateSettings({ onboardingCompleted: true });
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 lg:p-12 overflow-hidden relative">
      <div 
        className="perspective-1000 w-full max-w-sm mb-12 hidden sm:block cursor-default select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={`w-full h-56 rounded-[2.8rem] p-10 text-white flex flex-col justify-between shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] border border-white/10 preserve-3d transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            mode === 'LOGIN' 
              ? 'bg-gradient-to-br from-zinc-800 via-zinc-900 to-black' 
              : 'bg-gradient-to-br from-[#E31B23] via-black to-black'
          }`}
          style={{ transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)` }}
        >
          <div className="absolute inset-0 rounded-[2.8rem] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <BrandLogo bg="bg-white/10" iconColor="white" />
            <div className="flex flex-col items-end">
              <Shield className="w-8 h-8 text-red-500 opacity-60 mb-2" />
              <div className="text-[7px] font-black uppercase tracking-[0.3em] opacity-40">Maweli Protocol</div>
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-3 opacity-60">
               <Hash className="w-3.5 h-3.5" />
               <p className="text-[11px] font-mono tracking-[0.5em] uppercase">{digitalId || 'AUDIT-MASTER-ID'}</p>
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.3em]">Authorized Bearer</p>
                <h2 className="text-2xl font-black tracking-tighter leading-none">{name || 'SYSTEM OPERATOR'}</h2>
              </div>
              <div className="w-12 h-8 bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 rounded-lg opacity-90 shadow-2xl brightness-110" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-10 animate-ios-entry">
        {mode !== 'ONBOARDING' ? (
          <>
            <div className="text-center space-y-3">
              <div className="flex justify-center items-baseline">
                <h1 className="text-5xl font-black tracking-tighter text-[#E31B23]">Audit</h1>
                <h1 className="text-5xl font-black tracking-tighter text-black dark:text-white">Line</h1>
              </div>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.4em]">
                {mode === 'LOGIN' ? 'Secure Ledger Gateway' : 'Establish Corporate Portfolio'}
              </p>
            </div>
            <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] p-1.5 border border-black/5 dark:border-white/5 shadow-inner">
              <button onClick={() => setMode('LOGIN')} className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'LOGIN' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-2xl scale-[1.02]' : 'text-zinc-400'}`}>Login</button>
              <button onClick={() => setMode('SIGNUP')} className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'SIGNUP' ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-2xl scale-[1.02]' : 'text-zinc-400'}`}>Signup</button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === 'SIGNUP' ? (
                <div className="space-y-4">
                  <AuthInput icon={<User />} type="text" placeholder="Full Professional Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <AuthInput icon={<Mail />} type="email" placeholder="Corporate Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <AuthInput icon={<Hash />} type="text" placeholder="Preferred Digital ID" value={digitalId} onChange={(e) => setDigitalId(e.target.value)} />
                  <AuthInput icon={<Key />} type={showPassword ? "text" : "password"} placeholder="Vault Passcode" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              ) : (
                <div className="space-y-4">
                  <AuthInput icon={<Hash />} type="text" placeholder="Digital ID" value={digitalId} onChange={(e) => setDigitalId(e.target.value)} />
                  <AuthInput icon={<Key />} type={showPassword ? "text" : "password"} placeholder="Passcode" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              )}
              <button type="submit" disabled={isProcessing} className="w-full h-18 bg-black dark:bg-white text-white dark:text-black rounded-[2.2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3 group mt-6 py-6 disabled:opacity-50">
                <span>{isProcessing ? 'Processing...' : (mode === 'LOGIN' ? 'Authorize Identity' : 'Proceed to Setup')}</span>
                {!isProcessing && <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-10 text-center">
             <div className="space-y-3">
               <div className="w-20 h-20 bg-[#E31B23] rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-red-500/30">
                 <Sparkles className="w-10 h-10 text-white" />
               </div>
               <h2 className="text-4xl font-black tracking-tighter">System Engaged</h2>
             </div>
             <button onClick={completeOnboarding} className="w-full h-18 bg-[#E31B23] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl py-6">Access My Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthInput: React.FC<{ icon: React.ReactNode; type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ icon, type, placeholder, value, onChange }) => (
  <div className="relative group">
    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#E31B23] transition-colors">
      {React.cloneElement(icon as React.ReactElement<any>, { className: "w-4.5 h-4.5" })}
    </div>
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-[1.8rem] pl-16 pr-14 py-5 outline-none font-bold text-sm focus:ring-4 focus:ring-[#E31B23]/10 focus:border-[#E31B23]/30 transition-all placeholder:text-zinc-400 text-black dark:text-white" required />
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
