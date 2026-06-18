import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Database, Activity, Users, FileSpreadsheet, ArrowLeft, 
  Trash2, Plus, RefreshCw, Key, Shield, Sliders, Server
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { adminStats, triggerAdminAction, setActiveTab, theme, setTheme, addNotification } = useApp();
  
  // CLI State
  const [cliInput, setCliInput] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "System CLI Sandbox active. Type '/help' for available overrides."
  ]);

  // 11 New Admin Features State Variables
  const [maxUploadSize, setMaxUploadSize] = useState(10); // MB
  const [dailyScanLimit, setDailyScanLimit] = useState(8); // scans
  const [rateLimitRpm, setRateLimitRpm] = useState(60); // RPM
  const [apiTokens, setApiTokens] = useState(['tok_live_8f3d', 'tok_live_0a21']);
  const [mockUsers, setMockUsers] = useState([
    { id: 'usr-1', name: 'Alex Morgan', email: 'alex.morgan@techstack.io', role: 'Candidate', status: 'Active' },
    { id: 'usr-2', name: 'Marcus Aurelius', email: 'marcus.dev@techstack.io', role: 'Candidate', status: 'Active' },
    { id: 'usr-3', name: 'Sarah Rivera', email: 'sarah.rivera@google.com', role: 'Recruiter', status: 'Active' }
  ]);
  const [hmrLatency, setHmrLatency] = useState(38); // ms
  const [websocketLogs, setWebsocketLogs] = useState([
    "[WS] Opened stream link client-id: 2894",
    "[WS] Ping heartbeat sent - 12ms delay",
    "[WS] Parsing payload frame length: 84b"
  ]);

  // Event Handlers
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const command = cliInput.trim().toLowerCase();
    const newLogs = [...consoleLogs, `guest@admin-console:~$ ${cliInput}`];
    setConsoleLogs(newLogs);
    setCliInput('');
    triggerAdminAction(`[CLI] Executed command: ${command}`);

    setTimeout(() => {
      let response = `Command not recognized: '${command}'. Type '/help' for options.`;
      
      if (command === '/help') {
        response = `Available Command Overrides:
  /stats   - Returns active server metrics and RAM heaps
  /reboot  - Simulates server reboot clearing telemetry registers
  /clear   - Clears console logs screens`;
      } else if (command === '/stats') {
        response = `Server Stats Node 01:
  Active connections: ${adminStats.activeUsers}
  Total Resumes Parsed: ${adminStats.uploadsCount}
  API Expense Registry: $${adminStats.apiCost.toFixed(2)}
  Hardware CPU: ${adminStats.cpuUsage}% | Memory Heap: ${adminStats.ramUsage}%`;
      } else if (command === '/reboot') {
        response = "System reboot initiated... [OK]\nReloading daemon threads... [OK]\nAll nodes healthy. Telemetries synced.";
      } else if (command === '/clear') {
        setConsoleLogs(["Logs cleared."]);
        return;
      }

      setConsoleLogs(prev => [...prev, response]);
    }, 400);
  };

  const handleSimulateHmr = () => {
    const nextLatency = Math.floor(Math.random() * 80) + 15;
    setHmrLatency(nextLatency);
    triggerAdminAction(`[HMR] Vite live reload restart complete in ${nextLatency}ms.`);
    
    // Add to websocket logs
    setWebsocketLogs(prev => [
      `[HMR] HMR client connected. Hot update applied in ${nextLatency}ms.`,
      ...prev.slice(0, 4)
    ]);
  };

  const handleAddToken = () => {
    const rand = Math.random().toString(36).substring(2, 6);
    const newToken = `tok_live_${rand}`;
    setApiTokens(prev => [...prev, newToken]);
    triggerAdminAction(`[AUTH] Generated new API Token node: ${newToken}`);
  };

  const handleRevokeToken = (token: string) => {
    setApiTokens(prev => prev.filter(t => t !== token));
    triggerAdminAction(`[AUTH] Revoked API Token node: ${token}`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setMockUsers(prev => prev.filter(u => u.id !== id));
    triggerAdminAction(`[USER] Removed user '${name}' directory context.`);
  };

  const handleResetMetrics = () => {
    triggerAdminAction(`[SYSTEM] Initialized full metrics session database reset.`);
    addNotification("Metrics Reset", "Telemetry registers and cost allocators reset to baseline.");
  };

  // 10-15+ features implementation breakdown
  // 1. Vite HMR latency telemetry monitor
  // 2. Max upload limit slider
  // 3. Daily scan limits slider
  // 4. Rate limits RPM slider
  // 5. API token generator manager
  // 6. Token revocation control
  // 7. Mock user list active table
  // 8. User removal delete control
  // 9. Cost projection card calculations
  // 10. CSS theme color switcher buttons
  // 11. WebSocket active log streams
  // 12. Quotas reset action buttons
  // 13. System healthy node status list

  const projectedMonthlyCost = adminStats.uploadsCount * 0.04 * 30;

  return (
    <div className="space-y-6 select-none">
      {/* Header Board */}
      <div className="pb-4 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition flex items-center justify-center font-bold text-xs"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="text-left">
            <h2 className="text-xl font-bold tracking-tight text-white">System Admin Console</h2>
            <p className="text-xs text-zinc-500 mt-1">Real-time system telemetry nodes and backend logs.</p>
          </div>
        </div>

        {/* CSS Theme Preset Switcher */}
        <div className="flex items-center space-x-2 bg-zinc-950 p-1 border border-zinc-900 rounded-xl">
          <span className="text-[9px] text-zinc-500 font-bold uppercase px-2">Theme:</span>
          {(['purple', 'cyan', 'pink', 'green'] as const).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                setTheme(color);
                triggerAdminAction(`[THEME] Switched CSS theme variables preset to: ${color}`);
              }}
              className={`w-4 h-4 rounded-full transition transform hover:scale-110 ${
                color === 'purple' ? 'bg-purple-500' :
                color === 'cyan' ? 'bg-cyan-500' :
                color === 'pink' ? 'bg-pink-500' : 'bg-green-500'
              } ${theme === color ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : 'opacity-70'}`}
              title={`Preset ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Telemetries board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-5 space-y-1 bg-zinc-900/10 text-left">
          <Users className="w-5 h-5 text-purple-400 mb-2" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Total Users</span>
          <span className="text-xl font-bold font-mono text-white">{adminStats.totalUsers}</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-1 bg-zinc-900/10 text-left">
          <Activity className="w-5 h-5 text-cyan-400 mb-2" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Active Connections</span>
          <span className="text-xl font-bold font-mono text-white">{adminStats.activeUsers}</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-1 bg-zinc-900/10 text-left">
          <FileSpreadsheet className="w-5 h-5 text-pink-400 mb-2" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Resume Audits</span>
          <span className="text-xl font-bold font-mono text-white">{adminStats.uploadsCount}</span>
        </div>

        {/* Cost & Monthly projection calculations */}
        <div className="glass-panel rounded-2xl p-5 space-y-1 bg-zinc-900/10 text-left relative overflow-hidden">
          <Database className="w-5 h-5 text-yellow-400 mb-2" />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">AI API Cost</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl font-bold font-mono text-white">${adminStats.apiCost.toFixed(2)}</span>
            <span className="text-[8px] text-zinc-500" title="Projected from audit velocity">est. ${projectedMonthlyCost.toFixed(0)}/mo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls & Key Manager (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Node Health Status Grid */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-xs font-bold text-white">System Node Health Diagnostics</span>
              <span className="text-[9px] text-zinc-500 uppercase font-mono">5 nodes active</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-[10px]">
              <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col justify-between h-[55px]">
                <span className="text-zinc-500 font-medium">DB Database Sync</span>
                <span className="font-bold text-emerald-400 font-mono">100% ONLINE</span>
              </div>
              <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col justify-between h-[55px]">
                <span className="text-zinc-500 font-medium">Tesseract OCR Node</span>
                <span className="font-bold text-emerald-400 font-mono">HEALTHY</span>
              </div>
              <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col justify-between h-[55px]">
                <span className="text-zinc-500 font-medium">Parser Core Daemon</span>
                <span className="font-bold text-emerald-400 font-mono">STABLE</span>
              </div>
              <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col justify-between h-[55px]">
                <span className="text-zinc-500 font-medium">SSL Sandbox API</span>
                <span className="font-bold text-emerald-400 font-mono">ENCRYPTED</span>
              </div>
              <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col justify-between h-[55px]">
                <span className="text-zinc-500 font-medium">Rate Limiter Node</span>
                <span className="font-bold text-emerald-400 font-mono">0 BLOCKED</span>
              </div>
            </div>
          </div>

          {/* Quota Sliders Adjusters */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-5 text-left">
            <div className="flex items-center space-x-2 pb-2 border-b border-zinc-900">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">System Quota & Rate Limit Adjusters</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Max upload slider */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400 font-semibold">Max Upload Size limit:</span>
                  <span className="font-bold font-mono text-purple-400">{maxUploadSize} MB</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={maxUploadSize}
                  onChange={(e) => {
                    setMaxUploadSize(Number(e.target.value));
                    triggerAdminAction(`[CONFIG] Adjusted max upload size ceiling parameters to ${e.target.value}MB.`);
                  }}
                  className="w-full accent-purple-600 cursor-pointer bg-zinc-950 h-1 rounded-full"
                />
              </div>

              {/* Daily scan slider */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400 font-semibold">Free Scan Session Limit:</span>
                  <span className="font-bold font-mono text-purple-400">{dailyScanLimit} scans</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="30"
                  value={dailyScanLimit}
                  onChange={(e) => {
                    setDailyScanLimit(Number(e.target.value));
                    triggerAdminAction(`[CONFIG] Adjusted user session scan count ceilings to ${e.target.value} scans.`);
                  }}
                  className="w-full accent-purple-600 cursor-pointer bg-zinc-950 h-1 rounded-full"
                />
              </div>

              {/* Rate limit slider */}
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-400 font-semibold">API Rate Ceiling (RPM):</span>
                  <span className="font-bold font-mono text-purple-400">{rateLimitRpm} RPM</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={rateLimitRpm}
                  onChange={(e) => {
                    setRateLimitRpm(Number(e.target.value));
                    triggerAdminAction(`[CONFIG] Adjusted rate limiter RPM parameters to ${e.target.value}.`);
                  }}
                  className="w-full accent-purple-600 cursor-pointer bg-zinc-950 h-1 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* API Access Tokens Keys Manager */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-left">
                <Key className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Telemetry API Access Tokens</h3>
              </div>
              <button
                type="button"
                onClick={handleAddToken}
                className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1.5 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Generate Client Key</span>
              </button>
            </div>

            <div className="space-y-2 font-mono text-[10px]">
              {apiTokens.length > 0 ? (
                apiTokens.map((token, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3.5 h-3.5 text-zinc-550 shrink-0" />
                      <span className="text-zinc-300 select-all">{token}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[8px] font-bold">active</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRevokeToken(token)}
                      className="p-1 hover:bg-red-500/10 text-red-400 rounded transition"
                      title="Revoke Token"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-6 flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 text-zinc-600">
                  No telemetry tokens active. Click generate to create one.
                </div>
              )}
            </div>
          </div>

          {/* Active Users Table Directory */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <span className="text-xs font-bold text-white block">Active Directory User Table</span>
            
            <div className="border border-zinc-900 bg-zinc-950 rounded-xl overflow-x-auto">
              <table className="w-full text-[10px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/35 text-zinc-500 font-semibold">
                    <th className="p-3">User Client Name</th>
                    <th className="p-3">Network Mail address</th>
                    <th className="p-3">Credentials Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300 font-medium">
                  {mockUsers.length > 0 ? (
                    mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/20 transition">
                        <td className="p-3 font-semibold text-white">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 bg-zinc-900 text-zinc-400 rounded-md text-[8px] font-bold">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="text-emerald-400 font-bold flex items-center">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block mr-1.5 animate-pulse" />
                            {user.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-1 text-red-400 hover:bg-red-500/10 rounded transition"
                            title="Delete user context"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-zinc-600">
                        No active users registered in session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Performance Telemetry & CLI Console (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Vite Live HMR LATENCY MONITOR */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-left">
                <Server className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="text-xs font-bold text-white">Vite HMR Telemetry</h3>
                  <p className="text-[8px] text-zinc-500">Hot-Module Replacement daemon</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSimulateHmr}
                className="p-1 hover:bg-zinc-900 rounded transition border border-zinc-800 text-zinc-400 hover:text-white"
                title="Trigger HMR reload simulate"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-zinc-500">Active Live Latency:</span>
                <span className="font-mono text-sm font-bold text-white">{hmrLatency} ms</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-1.5 transition-all duration-300" 
                  style={{ width: `${Math.min(100, (hmrLatency / 150) * 100)}%` }} 
                />
              </div>
              <p className="text-[8px] text-zinc-500 leading-normal">
                Vite live HMR listener watches source code files dynamically. Average response delay: ~40ms.
              </p>
            </div>
          </div>

          {/* WebSockets Active Connection Log streams */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 text-left">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">WS Socket Channel Streams</span>
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 font-mono text-[9px] text-purple-400 h-[105px] overflow-y-auto no-scrollbar space-y-2">
              {websocketLogs.map((log, idx) => (
                <div key={idx} className="leading-normal">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Server Hardware Health */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Server Hardware Health</span>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-semibold">CPU Utilization</span>
                  <span className="font-bold font-mono text-white">{adminStats.cpuUsage}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${adminStats.cpuUsage}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-semibold">Memory Heap Allocation</span>
                  <span className="font-bold font-mono text-white">{adminStats.ramUsage}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${adminStats.ramUsage}%` }} />
                </div>
              </div>

              <div className="flex justify-between items-center bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900 text-[10px]">
                <span className="text-zinc-400 font-semibold">Node.js Threads</span>
                <span className="font-bold font-mono text-white">4 Active Threads</span>
              </div>
            </div>
          </div>

          {/* Reset Metrics registers action box */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-4 text-left">
            <button
              type="button"
              onClick={handleResetMetrics}
              className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-xl text-[10px] font-bold transition flex items-center justify-center space-x-1.5"
            >
              <span>Reset Sessions Registries</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live logs console at bottom */}
      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 flex flex-col justify-between min-h-[220px]">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block text-left">Server CLI Console & Logs</span>
        
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 font-mono text-[9px] text-emerald-400 space-y-2 h-[120px] overflow-y-auto pr-1 no-scrollbar text-left shadow-inner flex-1">
          {consoleLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed font-semibold whitespace-pre-wrap">
              {log}
            </div>
          ))}
        </div>

        {/* Interactive command prompt */}
        <form onSubmit={handleCommandSubmit} className="flex items-center space-x-2 border-t border-zinc-900 pt-3">
          <span className="font-mono text-xs text-zinc-550 select-none">$</span>
          <input 
            type="text" 
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            placeholder="Type command: e.g. /stats, /reboot, /clear" 
            className="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-1.5 font-mono text-xs text-zinc-350 outline-none focus:border-purple-500"
          />
        </form>
      </div>
    </div>
  );
};
