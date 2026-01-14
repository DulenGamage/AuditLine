
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Plus, 
  Bell,
  ChevronLeft,
  Target,
  History,
  PieChart,
  Settings,
  MoreHorizontal,
  Calculator,
  X,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowRight,
  LogOut,
  Files,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { TransactionForm } from './TransactionForm';

export const BrandLogo: React.FC<{ className?: string, bg?: string, iconColor?: string }> = ({ className = "w-10 h-10", bg = "bg-white", iconColor = "black" }) => (
  <div className={`${className} ${bg} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden transition-transform duration-300 group-hover:scale-110`}>
    {/* High-Fidelity SVG Reconstruction of the AuditLine 'A' Symbol */}
    <svg viewBox="0 0 100 100" className="w-[75%] h-[75%]">
      <path 
        d="M50 12C38 12 18 35 18 70C18 82 25 88 50 88C75 88 82 82 82 70C82 35 62 12 50 12Z" 
        fill={iconColor} 
      />
      <path 
        d="M50 78L30 45H70L50 78Z" 
        fill="#E31B23" 
      />
    </svg>
  </div>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAddModalOpen, setIsAddModalOpen, notifications, markNotificationsRead, clearNotifications, logout, user } = useApp();
  const [isMoreIslandOpen, setIsMoreIslandOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleMore = () => setIsMoreIslandOpen(!isMoreIslandOpen);
  const toggleNotifications = () => {
    if (!isNotificationOpen) markNotificationsRead();
    setIsNotificationOpen(!isNotificationOpen);
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/accounts', icon: Wallet, label: 'Portfolio' },
    { path: '/transactions', icon: History, label: 'Ledger' },
    { path: '/reports', icon: PieChart, label: 'Analytics' },
    { path: '/goals', icon: Target, label: 'Milestones' },
    { path: '/calculator', icon: Calculator, label: 'Calculators' },
    { path: '/documents', icon: Files, label: 'Vault' },
  ];

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gray-50 dark:bg-black text-black dark:text-zinc-100 flex lg:flex-row flex-col">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 bg-white dark:bg-zinc-950 border-r border-black/5 dark:border-white/5 flex-col p-8 z-50">
        <div className="flex items-center space-x-3 mb-1 w-full group cursor-pointer" onClick={() => navigate('/')}>
          <BrandLogo bg="bg-white dark:bg-zinc-900" iconColor="black" />
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-2xl font-black tracking-tighter text-[#E31B23]">Audit</span>
              <span className="text-2xl font-black tracking-tighter text-black dark:text-white">Line</span>
            </div>
            <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest -mt-1">Powered by Maweli IT</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar mt-12">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 ml-4">Core Management</p>
          {navItems.map(item => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => `flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 font-bold ${isActive ? 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white shadow-sm' : 'text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50'}`}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#E31B23]' : 'text-zinc-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          
          <div className="pt-6 mt-6 border-t border-black/5 dark:border-white/5">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl transition-all duration-300 font-black text-xs uppercase tracking-widest text-white bg-[#E31B23] shadow-lg shadow-red-500/20 active:scale-95 hover:opacity-90"
            >
              <Plus className="w-5 h-5" />
              <span>Record Entry</span>
            </button>
          </div>
        </nav>

        <div className="pt-8 border-t border-black/5 dark:border-white/5 space-y-2">
           <div className="flex items-center space-x-3 px-4 py-2 group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-2xl transition-all" onClick={() => navigate('/settings')}>
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-black transition-transform group-hover:scale-110 duration-300 border border-black/5 dark:border-white/5 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black truncate">{user.name}</p>
                <p className="text-[9px] font-bold text-zinc-400 truncate uppercase tracking-tighter">Premium Access</p>
              </div>
              <Settings className="w-4 h-4 text-zinc-400" />
           </div>
           
           <button onClick={logout} className="w-full flex items-center space-x-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-black text-[10px] uppercase tracking-widest transition-all duration-300">
             <LogOut className="w-5 h-5" />
             <span>Terminate Session</span>
           </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-gray-50/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 h-16 flex items-center px-6">
        <div className="w-full flex justify-between items-center">
          {isHome ? (
            <BrandLogo className="w-10 h-10" />
          ) : (
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-white/5 active:scale-90 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-black dark:text-white" />
            </button>
          )}

          <h1 className="text-lg font-black tracking-tight text-black dark:text-white flex items-baseline">
            {location.pathname === '/accounts' ? 'Portfolio' : 
             location.pathname === '/reports' ? 'Analytics' : 
             location.pathname === '/goals' ? 'Milestones' : 
             location.pathname === '/transactions' ? 'Ledger' :
             location.pathname === '/settings' ? 'Settings' : 
             location.pathname === '/calculator' ? 'Calculator' :
             location.pathname === '/documents' ? 'Vault' : (
               <>
                 <span className="text-[#E31B23]">Audit</span>
                 <span>Line</span>
               </>
             )}
          </h1>

          <div className="flex items-center space-x-3">
             <button 
              onClick={toggleNotifications}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl shadow-sm border transition-all duration-300 active:scale-90 ${isNotificationOpen ? 'bg-[#E31B23] border-[#E31B23] text-white shadow-lg' : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-white/5 text-black dark:text-white'}`}
             >
               <Bell className="w-5 h-5" />
               {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 animate-bounce">
                   {unreadCount}
                 </span>
               )}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 lg:p-12 p-6 lg:max-w-none max-w-4xl mx-auto w-full lg:pb-10 pb-32 animate-ios-entry overflow-x-hidden">
        {children}
      </main>

      {/* Notification Center */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center p-6 pt-20 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
           <Card className="w-full max-w-md bg-white dark:bg-[#121212] rounded-[2.5rem] p-8 space-y-6 shadow-2xl flex flex-col max-h-[70vh] border-white/5">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black">Activity</h2>
                <div className="flex space-x-2">
                   {notifications.length > 0 && (
                     <button onClick={clearNotifications} className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-900/10 rounded-xl active:scale-90 transition-all"><Trash2 className="w-4 h-4" /></button>
                   )}
                   <button onClick={toggleNotifications} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl active:scale-90 transition-all"><X className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
                 {notifications.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-10 opacity-60">
                      <Bell className="w-12 h-12 mb-4 text-zinc-300" />
                      <p className="font-bold text-sm text-zinc-400">No recent activity.</p>
                   </div>
                 ) : (
                   notifications.map(n => (
                     <div key={n.id} className={`flex items-start space-x-4 p-4 rounded-3xl border transition-all duration-300 ${n.read ? 'bg-zinc-50 dark:bg-zinc-800/50 border-transparent opacity-70' : 'bg-white dark:bg-zinc-800 border-blue-300 dark:border-blue-900/20 shadow-sm'}`}>
                        <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${
                          n.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
                          n.type === 'warning' ? 'bg-orange-50 text-orange-700' :
                          n.type === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                           {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : n.type === 'warning' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                           <h4 className="text-sm font-black">{n.title}</h4>
                           <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </Card>
        </div>
      )}

      {/* CONTROL CENTER */}
      {isMoreIslandOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="w-full max-w-lg bg-[#0a0a0a]/95 rounded-[3.5rem] p-10 relative shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-white/10 ring-1 ring-white/5 animate-ios-entry">
              <button 
                onClick={toggleMore} 
                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/70 active:scale-90 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-12 flex flex-col items-center">
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-black tracking-tighter text-[#E31B23]">Audit</h2>
                  <h2 className="text-4xl font-black tracking-tighter text-white">Line</h2>
                </div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-2">Powered by Maweli IT</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <MoreIslandItem 
                  icon={<PieChart className="w-10 h-10 text-red-400" />} 
                  label="Analysis" 
                  onClick={() => { navigate('/reports'); toggleMore(); }} 
                  color="red"
                />
                <MoreIslandItem 
                  icon={<Calculator className="w-10 h-10 text-zinc-400" />} 
                  label="Calculators" 
                  onClick={() => { navigate('/calculator'); toggleMore(); }} 
                  color="zinc"
                />
                <MoreIslandItem 
                  icon={<ShieldAlert className="w-10 h-10 text-emerald-400" />} 
                  label="Vault" 
                  onClick={() => { navigate('/documents'); toggleMore(); }} 
                  color="emerald"
                />
                <MoreIslandItem 
                  icon={<Target className="w-10 h-10 text-orange-400" />} 
                  label="Milestones" 
                  onClick={() => { navigate('/goals'); toggleMore(); }} 
                  color="orange"
                />
                <MoreIslandItem 
                  icon={<Settings className="w-10 h-10 text-zinc-400" />} 
                  label="Settings" 
                  onClick={() => { navigate('/settings'); toggleMore(); }} 
                  color="zinc"
                />
                <MoreIslandItem 
                  icon={<Files className="w-10 h-10 text-purple-400" />} 
                  label="Files" 
                  onClick={() => { navigate('/documents'); toggleMore(); }} 
                  color="purple"
                />
              </div>
           </div>
        </div>
      )}

      {/* Mobile Nav Pill */}
      <div className="lg:hidden fixed bottom-8 left-0 right-0 z-[60] px-6">
        <nav className="max-w-md mx-auto bg-black dark:bg-[#121212] rounded-[2.5rem] h-16 flex items-center justify-between px-3 shadow-2xl border border-white/10">
          <NavLink to="/" className={({ isActive }) => `p-3 rounded-full transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-zinc-500'}`}>
            <LayoutDashboard className="w-6 h-6" />
          </NavLink>
          <NavLink to="/accounts" className={({ isActive }) => `p-3 rounded-full transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-zinc-500'}`}>
            <Wallet className="w-6 h-6" />
          </NavLink>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-90 hover:scale-110 transition-all duration-300 ring-4 ring-black/5"
          >
            <Plus className="w-7 h-7 text-black" />
          </button>

          <NavLink to="/transactions" className={({ isActive }) => `p-3 rounded-full transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-zinc-500'}`}>
            <History className="w-6 h-6" />
          </NavLink>

          <button onClick={toggleMore} className={`p-3 rounded-full transition-all duration-300 active:scale-110 ${isMoreIslandOpen ? 'text-white' : 'text-zinc-500'}`}>
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* Global Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg">
            <TransactionForm onClose={() => setIsAddModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const MoreIslandItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; color: string }> = ({ icon, label, onClick, color }) => {
  const colorMap: Record<string, string> = {
    red: 'hover:bg-red-500/10 group-hover:text-red-400',
    emerald: 'hover:bg-emerald-500/10 group-hover:text-emerald-400',
    indigo: 'hover:bg-indigo-500/10 group-hover:text-indigo-400',
    orange: 'hover:bg-orange-500/10 group-hover:text-orange-400',
    zinc: 'hover:bg-zinc-500/10 group-hover:text-zinc-400',
    purple: 'hover:bg-purple-500/10 group-hover:text-purple-400',
  };

  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center justify-center space-y-4 p-8 bg-white/5 rounded-[2.5rem] active:scale-95 transition-all duration-300 border border-white/5 group shadow-lg ${colorMap[color] || ''}`}
    >
      <div className="group-hover:scale-125 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        {icon}
      </div>
      <span className="text-[10px] font-black tracking-[0.15em] text-white/80 uppercase group-hover:text-white transition-colors duration-300">{label}</span>
    </button>
  );
};

export const Section: React.FC<{ title: string; children: React.ReactNode; rightElement?: React.ReactNode }> = ({ title, children, rightElement }) => (
  <section className="mb-10">
    <div className="flex justify-between items-end mb-6 px-2">
      <h2 className="text-xl font-black tracking-tight text-black dark:text-white">{title}</h2>
      {rightElement}
    </div>
    {children}
  </section>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties }> = ({ children, className = '', onClick, style }) => (
  <div onClick={onClick} style={style} className={`bg-white dark:bg-[#121212] rounded-[2rem] shadow-sm hover:shadow-xl border border-black/5 dark:border-white/5 transition-all duration-500 ${className}`}>
    {children}
  </div>
);

export const EmptyState: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  actionLabel?: string; 
  onAction?: () => void;
  accentColor?: string;
}> = ({ icon, title, description, actionLabel, onAction, accentColor = 'blue' }) => {
  const accentColors: Record<string, string> = {
    blue: 'bg-blue-600',
    red: 'bg-[#E31B23]',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };
  
  const bgAccent = accentColors[accentColor] || accentColors.blue;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10 animate-in fade-in zoom-in-95 duration-700 px-6">
      <div className="relative">
        <div className={`absolute -inset-10 ${bgAccent} rounded-full blur-3xl opacity-10`}></div>
        <div className="relative w-32 h-32 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-black/5 dark:border-white/5 overflow-hidden">
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-14 h-14 text-zinc-300 dark:text-zinc-600" }) : icon}
        </div>
      </div>
      <div className="space-y-3 max-w-sm">
        <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white">{title}</h2>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className={`px-10 py-5 ${bgAccent} text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
