import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, Columns, Cpu, ArrowLeft, User, Key, 
  Calendar, Mail, FileCheck, Trash2, Check
} from 'lucide-react';

/* ==========================================
   1. AppTracker
   ========================================== */
export const AppTracker: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [columns, setColumns] = useState([
    { id: 'col-1', title: "Applied", cards: [{ id: 'card-1', company: "Google", role: "Software Engineer III", priority: "High" }] },
    { id: 'col-2', title: "Interviewing", cards: [{ id: 'card-2', company: "Stripe", role: "Lead Frontend Engineer", priority: "High" }] },
    { id: 'col-3', title: "Offer Issued", cards: [] }
  ]);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;
    const newCard = { id: 'card-' + Date.now(), company: newCompany, role: newRole, priority: newPriority };
    setColumns(prev => {
      const next = [...prev];
      next[0].cards = [...next[0].cards, newCard];
      return next;
    });
    setNewCompany('');
    setNewRole('');
    triggerAdminAction(`[TRACKER] Added card for ${newCompany} in Applied column.`);
  };

  const handleMoveCard = (cardId: string, fromColIdx: number, toColIdx: number) => {
    setColumns(prev => {
      const next = [...prev];
      const card = next[fromColIdx].cards.find(c => c.id === cardId);
      if (card) {
        next[fromColIdx].cards = next[fromColIdx].cards.filter(c => c.id !== cardId);
        next[toColIdx].cards = [...next[toColIdx].cards, card];
        triggerAdminAction(`[TRACKER] Moved card ${card.company} to ${next[toColIdx].title}.`);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Columns className="w-5 h-5 text-purple-400" />
            <span>Job Application Kanban Tracker</span>
          </h2>
          <p className="text-xs text-zinc-500">Track active application pipelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Adder Form */}
        <div className="lg:col-span-4">
          <form onSubmit={handleAddCard} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Add Job Application</span>
            <div className="space-y-2 text-xs">
              <input
                type="text" placeholder="Company Name" value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-purple-500"
              />
              <input
                type="text" placeholder="Role Title" value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-purple-500"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2 outline-none text-zinc-300"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <button type="submit" className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition">
              Add Application Card
            </button>
          </form>
        </div>

        {/* Board Columns */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col, colIdx) => (
            <div key={col.id} className="glass-panel border-zinc-900 rounded-2xl p-4 space-y-4 bg-zinc-950/20 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-xs font-bold text-white">{col.title}</span>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{col.cards.length}</span>
              </div>
              <div className="space-y-3 min-h-[180px] pt-1">
                {col.cards.map((card) => (
                  <div key={card.id} className="p-3 bg-zinc-900/60 border border-zinc-850 rounded-xl space-y-2 relative">
                    <h4 className="text-xs font-bold text-white">{card.company}</h4>
                    <p className="text-[10px] text-zinc-400">{card.role}</p>
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                      card.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {card.priority} Priority
                    </span>

                    {/* Move controls inside card */}
                    <div className="flex justify-end space-x-1.5 pt-1 border-t border-zinc-900/60">
                      {colIdx > 0 && (
                        <button
                          onClick={() => handleMoveCard(card.id, colIdx, colIdx - 1)}
                          className="px-1 py-0.5 bg-zinc-950 text-zinc-400 hover:text-white rounded text-[8px] font-bold"
                        >
                          ← Left
                        </button>
                      )}
                      {colIdx < 2 && (
                        <button
                          onClick={() => handleMoveCard(card.id, colIdx, colIdx + 1)}
                          className="px-1 py-0.5 bg-zinc-955 text-zinc-400 hover:text-white rounded text-[8px] font-bold"
                        >
                          Right →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {col.cards.length === 0 && (
                  <div className="text-center py-10 text-[10px] text-zinc-650 border border-dashed border-zinc-900 rounded-xl">
                    Empty Stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   2. PortfolioSite
   ========================================== */
export const PortfolioSite: React.FC = () => {
  const { currentCV, setActiveTab, triggerAdminAction } = useApp();
  const [copiedLink, setCopiedLink] = useState(false);
  const [portfolioTheme, setPortfolioTheme] = useState<'Dark Neon' | 'Clean Light'>('Dark Neon');
  const [customBio, setCustomBio] = useState(currentCV.summary);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://portfolio.cvanalyzer.io/${currentCV.name.toLowerCase().replace(/ /g, '-')}`);
    setCopiedLink(true);
    triggerAdminAction(`[PORTFOLIO] Copied dynamic web portfolio URL link.`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span>AI Web Portfolio Site</span>
          </h2>
          <p className="text-xs text-zinc-500">Render a single-page online portfolio layout matching your CV.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Portfolio Settings</span>
            
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Select Layout Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Dark Neon', 'Clean Light'] as const).map(thm => (
                  <button
                    key={thm}
                    onClick={() => setPortfolioTheme(thm)}
                    className={`py-1.5 rounded-lg border font-bold text-[10px] transition ${
                      portfolioTheme === thm 
                        ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {thm}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Custom Pitch/Bio</label>
              <textarea
                value={customBio}
                onChange={(e) => setCustomBio(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-cyan-500 resize-none leading-relaxed"
              />
            </div>

            <button 
              onClick={handleCopyLink} 
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
              <span>{copiedLink ? "Link Copied!" : "Copy Live Link"}</span>
            </button>
          </div>
        </div>

        {/* Live Preview Sandbox */}
        <div className="lg:col-span-7">
          <div className={`border rounded-2xl p-6 text-left space-y-4 transition-all duration-300 ${
            portfolioTheme === 'Clean Light' 
              ? 'bg-zinc-50 border-zinc-200 text-zinc-900' 
              : 'bg-zinc-950 border-zinc-850 text-white'
          }`}>
            <div className={`border-b pb-4 ${portfolioTheme === 'Clean Light' ? 'border-zinc-200' : 'border-zinc-900'}`}>
              <h1 className="text-lg font-black">{currentCV.name}</h1>
              <p className="text-xs text-cyan-400 font-mono mt-0.5">{currentCV.title}</p>
            </div>
            <div className="space-y-2 text-left">
              <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono">Summary Profile</span>
              <p className={`text-[10px] leading-relaxed ${portfolioTheme === 'Clean Light' ? 'text-zinc-650' : 'text-zinc-400'}`}>
                {customBio}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {currentCV.skills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-350 text-[9px] font-bold rounded">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   3. ReferencesSheet
   ========================================== */
export const ReferencesSheet: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [references, setReferences] = useState([
    { name: "Jane Doe", title: "VP of Software Engineering", company: "CloudVibe", email: "j.doe@cloudvibe.com" },
    { name: "John Smith", title: "Principal Product Lead", company: "DataSync", email: "j.smith@datasync.com" }
  ]);
  const [refName, setRefName] = useState('');
  const [refTitle, setRefTitle] = useState('');
  const [refCompany, setRefCompany] = useState('');
  const [refEmail, setRefEmail] = useState('');

  const handleAddReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName || !refTitle || !refCompany) return;
    const newRef = { name: refName, title: refTitle, company: refCompany, email: refEmail };
    setReferences(prev => [...prev, newRef]);
    setRefName('');
    setRefTitle('');
    setRefCompany('');
    setRefEmail('');
    triggerAdminAction(`[REFERENCES] Appended custom reference listing: ${refName}`);
  };

  const handleDeleteReference = (idx: number) => {
    setReferences(prev => prev.filter((_, i) => i !== idx));
    triggerAdminAction(`[REFERENCES] Deleted reference at index ${idx}`);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-pink-400" />
            <span>Professional References Sheet</span>
          </h2>
          <p className="text-xs text-zinc-500">Manage and export your professional references sheet.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Adder Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleAddReference} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Add Reference</span>
            <div className="space-y-2 text-xs">
              <input
                type="text" placeholder="Reference Name" value={refName}
                onChange={(e) => setRefName(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-pink-500"
              />
              <input
                type="text" placeholder="Title Role" value={refTitle}
                onChange={(e) => setRefTitle(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-pink-500"
              />
              <input
                type="text" placeholder="Company" value={refCompany}
                onChange={(e) => setRefCompany(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-pink-500"
              />
              <input
                type="email" placeholder="Contact Email" value={refEmail}
                onChange={(e) => setRefEmail(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-pink-500"
              />
            </div>
            <button type="submit" className="w-full py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition">
              Inject Reference
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">References List</h3>
          <div className="space-y-3">
            {references.map((ref, idx) => (
              <div key={idx} className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between text-left transition">
                <div>
                  <h4 className="text-xs font-bold text-white">{ref.name}</h4>
                  <p className="text-[10px] text-zinc-400">{ref.title}</p>
                  <p className="text-[9px] text-zinc-550 font-mono mt-0.5">{ref.company} • {ref.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteReference(idx)}
                  className="p-1 hover:bg-red-500/10 text-red-400 rounded transition"
                  title="Remove reference"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   4. PortalSync
   ========================================== */
export const PortalSync: React.FC = () => {
  const { setActiveTab, currentCV, triggerAdminAction } = useApp();
  const [portalSelect, setPortalSelect] = useState('Workday');
  const [copiedKey, setCopiedKey] = useState<'name' | 'exp' | 'skills' | null>(null);

  const syncLayouts = {
    Workday: {
      name: currentCV.name,
      exp: `${currentCV.experience.map(e => `${e.role} at ${e.company} (${e.duration}): ${e.bullets.join(' ')}`).join('\n\n')}`,
      skills: currentCV.skills.join(', ')
    },
    Greenhouse: {
      name: currentCV.name.toUpperCase(),
      exp: `${currentCV.experience.map(e => `[POSITION] ${e.role}\n[ORGANIZATION] ${e.company}\n[DATES] ${e.duration}\n[DELIVERABLES]\n${e.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}`,
      skills: currentCV.skills.join(' | ')
    }
  };

  const handleCopyField = (field: 'name' | 'exp' | 'skills') => {
    const text = syncLayouts[portalSelect as keyof typeof syncLayouts][field];
    navigator.clipboard.writeText(text);
    setCopiedKey(field);
    triggerAdminAction(`[PORTAL] Copied synced ${field} data for: ${portalSelect}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-850 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            <span>Job Portal Sync Helper</span>
          </h2>
          <p className="text-xs text-zinc-500">Export formatted copy blocks optimized for portal profiles.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
          <span className="text-xs font-bold text-white">Target Job Portal System</span>
          <select
            value={portalSelect}
            onChange={(e) => setPortalSelect(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2 outline-none text-zinc-300"
          >
            <option>Workday</option>
            <option>Greenhouse</option>
          </select>
        </div>

        <div className="space-y-4 text-xs text-left">
          {/* Name Field */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono">Profile Name Block</span>
              <button onClick={() => handleCopyField('name')} className="text-[10px] text-teal-400 font-bold">
                {copiedKey === 'name' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-[9px] text-zinc-350">{syncLayouts[portalSelect as keyof typeof syncLayouts].name}</p>
          </div>

          {/* Exp Field */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono">Work History Block</span>
              <button onClick={() => handleCopyField('exp')} className="text-[10px] text-teal-400 font-bold">
                {copiedKey === 'exp' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-[9px] text-zinc-350 whitespace-pre-wrap leading-relaxed truncate max-h-[100px]">
              {syncLayouts[portalSelect as keyof typeof syncLayouts].exp}
            </p>
          </div>

          {/* Skills Field */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono">Skills Array Block</span>
              <button onClick={() => handleCopyField('skills')} className="text-[10px] text-teal-400 font-bold">
                {copiedKey === 'skills' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-[9px] text-zinc-350">{syncLayouts[portalSelect as keyof typeof syncLayouts].skills}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   5. ApiTelemetry
   ========================================== */
export const ApiTelemetry: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [tokens, setTokens] = useState(['tok_live_78df49a...', 'tok_live_a23b128...']);
  const [desc, setDesc] = useState('');

  const generateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const rand = Math.random().toString(36).substring(7);
    const newToken = `tok_live_${rand}...`;
    setTokens(prev => [...prev, newToken]);
    setDesc('');
    triggerAdminAction(`[TELEMETRY] Created public API telemetry key: ${newToken}`);
  };

  const handleRevokeToken = (tk: string) => {
    setTokens(prev => prev.filter(t => t !== tk));
    triggerAdminAction(`[TELEMETRY] Revoked public API token.`);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-yellow-400" />
            <span>Developer Keys & API manager</span>
          </h2>
          <p className="text-xs text-zinc-500">Generate API tokens and view telemetry logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <form onSubmit={generateKey} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Generate New Client Key</span>
            <input
              type="text" placeholder="Key description (e.g. staging_server)" value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-yellow-500"
            />
            <button type="submit" className="w-full py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl text-xs font-bold transition">
              Create Client Key
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Public API Tokens</h3>
          <div className="space-y-2 text-xs font-mono">
            {tokens.map((tk, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                <span className="text-zinc-300 select-all">{tk}</span>
                <button
                  onClick={() => handleRevokeToken(tk)}
                  className="p-1 hover:bg-red-500/10 text-red-400 rounded transition"
                  title="Revoke Token"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   6. ActivityLog
   ========================================== */
export const ActivityLog: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [productivity, setProductivity] = useState(8); // hours spent
  const [activityGrid, setActivityGrid] = useState(
    Array.from({ length: 28 }, (_, i) => ({
      idx: i,
      active: i % 5 === 0 ? 3 : i % 3 === 0 ? 1 : 0
    }))
  );

  const handleCellClick = (idx: number) => {
    setActivityGrid(prev => {
      const next = [...prev];
      next[idx].active = (next[idx].active + 1) % 4; // cycle 0 to 3 density
      return next;
    });
    triggerAdminAction(`[ACTIVITY] Modified cell logs contribution at index: ${idx}`);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-zinc-400" />
            <span>AI Edit Activity Grid</span>
          </h2>
          <p className="text-xs text-zinc-500">Contribution activity calendar tracking CV edits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Productivity Logs</span>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-400 font-semibold">Hours spent writing:</span>
              <span className="font-bold font-mono text-purple-400">{productivity} hours</span>
            </div>
            <input
              type="range" min="1" max="15" value={productivity}
              onChange={(e) => setProductivity(Number(e.target.value))}
              className="w-full accent-purple-600 bg-zinc-900 h-1.5 rounded-full"
            />
          </div>
        </div>

        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Contribution Grid</h3>
            <span className="text-[9px] text-zinc-500 font-mono">Click cells to add edits</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 max-w-sm pt-2">
            {activityGrid.map((cell) => (
              <div 
                key={cell.idx} 
                onClick={() => handleCellClick(cell.idx)}
                className={`h-5 w-5 rounded-sm border cursor-pointer transition ${
                  cell.active === 3 ? 'bg-purple-600 border-purple-500/25' :
                  cell.active === 2 ? 'bg-purple-600/60 border-purple-500/15' :
                  cell.active === 1 ? 'bg-purple-600/30 border-purple-500/10' :
                  'bg-zinc-900 border-zinc-950 hover:bg-zinc-800'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   7. RecruiterConnect
   ========================================== */
export const RecruiterConnect: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [mailDraft, setMailDraft] = useState('');
  const [platform, setPlatform] = useState<'Email' | 'InMail'>('Email');
  const [recruiterName, setRecruiterName] = useState('Sarah Jenkins');

  const generateMail = () => {
    triggerAdminAction(`[CONNECT] Drafted recruiter outreach for ${recruiterName} via ${platform}`);
    if (platform === 'Email') {
      setMailDraft(`Subject: Technical Alignment Inquiry - React & Cloud Node\n\nDear ${recruiterName},\n\nI recently analyzed my core skills alignment against standard hiring benchmarks. With 6+ years specializing in frontend performance optimization (React 19) and API speed integrations, I would love to explore if you are currently seeking senior talent.\n\nBest,\nAlex Morgan`);
    } else {
      setMailDraft(`Hi ${recruiterName},\n\nI noticed you recruit for tech product roles. I recently benchmarked my software engineering portfolio (React 19, GraphQL, AWS) and hit a 92% fit rating index. Let me know if you are open to briefly reviewing my resume parameters.\n\nThanks,\nAlex Morgan`);
    }
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-400" />
            <span>Recruiter Connect Templates</span>
          </h2>
          <p className="text-xs text-zinc-500">Draft outreach mails targeting recruiter listings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Outreach Parameters</span>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Recruiter Name</label>
              <input
                type="text" value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Outreach Medium</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Email', 'InMail'] as const).map(plat => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPlatform(plat)}
                    className={`py-1.5 rounded-lg border font-bold text-[10px] transition ${
                      platform === plat 
                        ? 'bg-orange-600/20 text-orange-300 border-orange-500/30'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={generateMail} className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition">
            Generate Outreach Template
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {mailDraft && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
              <span className="text-[9px] uppercase font-bold text-orange-400 font-mono tracking-widest block">Outreach Message</span>
              <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl font-mono text-[9px] text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {mailDraft}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   8. ActionVerbs
   ========================================== */
export const ActionVerbs: React.FC = () => {
  const { setActiveTab } = useApp();
  const [query, setQuery] = useState('');

  const list = [
    { category: "Leadership & Strategy", verbs: ["Spearheaded", "Orchestrated", "Designed", "Formulated", "Guided", "Championed"] },
    { category: "Execution & Code Integration", verbs: ["Architected", "Engineered", "Optimized", "Refactored", "Automated", "Consolidated"] }
  ];

  const filteredList = list.map(g => ({
    category: g.category,
    verbs: g.verbs.filter(v => v.toLowerCase().includes(query.toLowerCase()))
  })).filter(g => g.verbs.length > 0);

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>AI Action Verbs Catalog</span>
          </h2>
          <p className="text-xs text-zinc-500">Browse strong active verbs categorized by discipline.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-4 bg-zinc-950/20">
        <input
          type="text" placeholder="Search active verbs (e.g. Engineered...)" value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredList.map((group, idx) => (
          <div key={idx} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 text-left">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider font-mono">{group.category}</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {group.verbs.map((verb, i) => (
                <span key={i} className="bg-zinc-900/60 border border-zinc-850 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300">
                  {verb}
                </span>
              ))}
            </div>
          </div>
        ))}
        {filteredList.length === 0 && (
          <p className="text-xs text-zinc-600 text-center py-6">No verbs matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};
