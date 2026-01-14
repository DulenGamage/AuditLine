
import React, { useState, useEffect } from 'react';
import { Section, Card } from '../components/Layout';
import { useApp } from '../store/AppContext';
import { 
  Download, 
  Moon, 
  Sun,
  Monitor,
  LogOut, 
  ChevronRight, 
  Mail, 
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, user, updateSettings, updateUser, logout, accounts } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email
  });

  useEffect(() => {
    setProfileForm({ name: user.name, email: user.email });
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileForm);
    setIsEditing(false);
  };

  const handleExport = () => {
    const data = localStorage.getItem('auditline_v1');
    const blob = new Blob([data || ''], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuditLine_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const setupProgress = (accounts.length > 0 ? 33 : 0) + (settings.autoEmailEnabled ? 33 : 0) + (user.name !== 'Audit User' ? 34 : 0);

  return (
    <div className="space-y-6 pb-40 animate-in fade-in duration-500">
      <header className="py-6">
        <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Audit System Setup</h1>
      </header>

      {/* Onboarding Progress */}
      {setupProgress < 100 && (
        <Card className="bg-gradient-to-r from-blue-800 to-indigo-800 border-none p-6 text-white space-y-4 shadow-xl shadow-blue-500/20">
           <div className="flex justify-between items-center">
             <h3 className="text-lg font-black tracking-tight">Onboarding Progress</h3>
             <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full">{setupProgress}%</span>
           </div>
           <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
             <div className="h-full bg-white transition-all duration-1000" style={{ width: `${setupProgress}%` }}></div>
           </div>
           <p className="text-[10px] font-bold uppercase tracking-widest opacity-100">Establish your profile for full AuditLine capabilities.</p>
        </Card>
      )}

      {/* Profile Summary */}
      {!isEditing ? (
        <Card className="flex items-center space-x-4 border-none shadow-sm p-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/5">
          <div className="w-16 h-16 bg-blue-700 dark:bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-black dark:text-white">{user.name}</h2>
            <p className="text-xs text-zinc-900 dark:text-zinc-400 font-bold uppercase tracking-widest">{user.email}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-widest px-4 py-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl active:scale-95 transition-all">Edit</button>
        </Card>
      ) : (
        <Card className="p-6 border shadow-xl space-y-4 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-white/10">
            <input type="text" className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl py-4 px-4 outline-none text-sm font-bold text-black dark:text-white border border-zinc-300 dark:border-white/5" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} placeholder="Full Name" />
            <input type="email" className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl py-4 px-4 outline-none text-sm font-bold text-black dark:text-white border border-zinc-300 dark:border-white/5" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} placeholder="Email" />
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-zinc-200 dark:bg-zinc-800 rounded-xl text-xs font-bold text-black dark:text-white">Cancel</button>
              <button onClick={handleSaveProfile} className="flex-1 py-3 bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg">Save Profile</button>
            </div>
        </Card>
      )}

      <Section title="Automated Intelligence">
        <Card className="space-y-6 border-none shadow-sm p-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="font-black text-sm block text-black dark:text-white">Auto-Dispatch Ledger</span>
                <span className="text-[10px] text-zinc-800 dark:text-zinc-400 font-bold uppercase tracking-widest">AuditLine Digital Pipeline</span>
              </div>
            </div>
            <button 
              onClick={() => updateSettings({ autoEmailEnabled: !settings.autoEmailEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoEmailEnabled ? 'bg-emerald-600' : 'bg-zinc-400 dark:bg-zinc-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${settings.autoEmailEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {settings.autoEmailEnabled && (
            <div className="animate-in slide-in-from-top-2 duration-300 space-y-2 pt-2 border-t border-zinc-200 dark:border-white/5">
              <label className="text-[10px] font-black text-black dark:text-zinc-300 uppercase tracking-widest ml-1">Dispatch Gateway</label>
              <div className="flex items-center space-x-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 border border-zinc-300 dark:border-white/5">
                <Mail className="w-4 h-4 text-zinc-900 dark:text-zinc-500" />
                <input 
                  type="email"
                  placeholder="reports@auditline.it"
                  className="bg-transparent outline-none text-sm font-bold flex-1 text-black dark:text-white"
                  value={settings.reportEmail}
                  onChange={(e) => updateSettings({ reportEmail: e.target.value })}
                />
              </div>
            </div>
          )}
        </Card>
      </Section>

      <Section title="Appearance">
        <Card className="p-6 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">
               <Monitor className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-black dark:text-white">System Appearance</span>
          </div>
          <div className="flex bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl p-1.5 border border-black/5 dark:border-white/10">
            {(['light', 'dark', 'system'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => updateSettings({ theme: mode })}
                className={`flex-1 py-3 flex items-center justify-center space-x-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  settings.theme === mode 
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 shadow-xl' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                }`}
              >
                {mode === 'light' && <Sun className="w-3.5 h-3.5" />}
                {mode === 'dark' && <Moon className="w-3.5 h-3.5" />}
                {mode === 'system' && <Monitor className="w-3.5 h-3.5" />}
                <span>{mode}</span>
              </button>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Preferences">
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-300 dark:border-white/5 shadow-sm">
          <SettingItem icon={<Download className="text-blue-800 dark:text-blue-500" />} label="Audit Data Backup (JSON)" onClick={handleExport} hasArrow />
          <SettingItem icon={<ShieldCheck className="text-emerald-700 dark:text-emerald-500" />} label="Biometrics & Security" hasArrow />
        </div>
      </Section>

      <button onClick={logout} className="w-full flex items-center justify-center space-x-3 py-6 text-rose-800 dark:text-rose-400 font-black bg-rose-50 dark:bg-rose-500/10 rounded-[2.5rem] active:scale-95 transition-all border border-rose-300 dark:border-rose-900/10">
        <LogOut className="w-5 h-5" />
        <span className="uppercase tracking-[0.2em] text-sm">Terminate Active Session</span>
      </button>

      <div className="text-center pt-4 opacity-70 text-zinc-800 dark:text-zinc-400">
         <p className="text-[9px] font-black uppercase tracking-widest">AuditLine Enterprise v1.1.0</p>
         <p className="text-[9px] font-bold mt-1 uppercase tracking-tighter">Powered by Maweli IT</p>
      </div>
    </div>
  );
};

const SettingItem: React.FC<{ icon: React.ReactNode; label: string; right?: React.ReactNode; hasArrow?: boolean; onClick?: () => void }> = ({ icon, label, right, hasArrow, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between p-6 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer border-b last:border-0 border-zinc-200 dark:border-white/5">
    <div className="flex items-center space-x-4">
      <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">{icon}</div>
      <span className="font-bold text-sm text-black dark:text-white">{label}</span>
    </div>
    <div className="flex items-center space-x-3">
      {right}
      {hasArrow && <ChevronRight className="w-4 h-4 text-zinc-500 dark:text-zinc-600" />}
    </div>
  </div>
);
