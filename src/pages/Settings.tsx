import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trash, ArrowLeft } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, login, logout, addNotification, theme, setTheme, setActiveTab } = useApp();
  const [name, setName] = useState(user?.name || 'Guest User');
  const [email, setEmail] = useState(user?.email || 'guest@domain.com');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    
    login(user?.email?.split('@')[1]?.split('.')[0] || 'Google', { name, email });
    addNotification("Settings Saved", "User credentials updated successfully.");
  };

  const handleClearCache = () => {
    localStorage.clear();
    addNotification("Cache Cleared", "Cleared all resume parsing histories and user states.");
    setTimeout(() => {
      logout();
      window.location.reload();
    }, 1000);
  };

  const themeList = [
    { id: 'purple', name: 'Aurora Purple', color: 'bg-purple-600' },
    { id: 'cyan', name: 'Cyber Cyan', color: 'bg-cyan-500' },
    { id: 'pink', name: 'Neon Pink', color: 'bg-pink-500' },
    { id: 'green', name: 'Matrix Green', color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6 select-none">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button 
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition flex items-center justify-center font-bold text-xs"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-left">
          <h2 className="text-xl font-bold tracking-tight text-white">System Settings</h2>
          <p className="text-xs text-zinc-500 mt-1">Configure profile sandboxes and cache telemetry.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Profile Card */}
        <form onSubmit={handleUpdateProfile} className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/40">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Candidate Credentials</span>
          
          <div className="flex items-center space-x-4 pb-2">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-purple-500/30">
              <img src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Sandbox Avatar</h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">Linked via OAuth provider handshake</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Display Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 focus:border-purple-500 outline-none text-zinc-200" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Verified Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 focus:border-purple-500 outline-none text-zinc-200" 
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
          >
            Update Credentials
          </button>
        </form>

        {/* System configurations */}
        <div className="lg:col-span-5 space-y-4">
          {/* Custom Theme Selector */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Custom Theme Accent</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {themeList.map(themeItem => (
                <button
                  key={themeItem.id}
                  type="button"
                  onClick={() => setTheme(themeItem.id)}
                  className={`p-3 rounded-xl border flex items-center space-x-2 transition text-left cursor-pointer ${
                    theme === themeItem.id 
                      ? 'border-purple-500 bg-purple-950/20' 
                      : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${themeItem.color} shrink-0`} />
                  <span className="text-[10px] font-semibold text-white truncate">{themeItem.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">System States</span>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900">
                <div>
                  <h5 className="font-bold">Automated Logging</h5>
                  <p className="text-[9px] text-zinc-500">Record parser telemetry locally</p>
                </div>
                <span className="w-8 h-4 bg-purple-600 rounded-full relative flex items-center justify-end px-0.5"><span className="w-3.5 h-3.5 bg-white rounded-full" /></span>
              </div>
              
              <div className="flex justify-between items-center bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900">
                <div>
                  <h5 className="font-bold">Notifications Alert</h5>
                  <p className="text-[9px] text-zinc-500">Audits complete push events</p>
                </div>
                <span className="w-8 h-4 bg-purple-600 rounded-full relative flex items-center justify-end px-0.5"><span className="w-3.5 h-3.5 bg-white rounded-full" /></span>
              </div>
            </div>
          </div>

          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Maintenance</span>
            <button
              onClick={handleClearCache}
              type="button"
              className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Reset Local Cache Registry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
