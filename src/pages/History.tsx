import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, Trash2, RotateCcw, ArrowLeft, Search, Download, Trash
} from 'lucide-react';

export const History: React.FC = () => {
  const { cvHistory, currentCV, setCurrentCVData, deleteCVFromHistory, addNotification, setActiveTab, triggerAdminAction } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreRange, setScoreRange] = useState(60); // min score
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  const handleRestore = (id: string) => {
    const matched = cvHistory.find(item => item.id === id);
    if (matched) {
      setCurrentCVData(matched.data);
      addNotification("Resume Snapshot Restored", `Switched active workspace to: ${matched.filename}`);
      triggerAdminAction(`[HISTORY] Restored workspace snapshot: ${matched.filename}`);
    }
  };

  const handleBulkClear = () => {
    cvHistory.forEach(item => {
      if (item.id !== 'hist-default') {
        deleteCVFromHistory(item.id);
      }
    });
    addNotification("History Cleared", "Cleared all cached resume snapshots.");
    triggerAdminAction("[HISTORY] Cleared history snapshot registry cache.");
  };

  const handleDownloadBackups = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cvHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CV_Backups_History.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerAdminAction("[HISTORY] Exported backup logs registry.");
  };

  // Filter and Sort history list
  const filteredHistory = cvHistory
    .filter(item => item.filename.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(item => item.score >= scoreRange)
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      return b.date.localeCompare(a.date);
    });

  return (
    <div className="space-y-6 select-none text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-900 gap-4">
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
            <h2 className="text-xl font-bold tracking-tight text-white">Resume History</h2>
            <p className="text-xs text-zinc-500 mt-1">Review previously audited resumes and restore past snapshots.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={handleDownloadBackups}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-450 hover:text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Backups</span>
          </button>
          {cvHistory.length > 1 && (
            <button
              onClick={handleBulkClear}
              className="px-3 py-1.5 bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-950/40 text-xs font-bold rounded-xl transition flex items-center space-x-1.5"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Bulk Clear Registry</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Filters Panel */}
        <div className="lg:col-span-4 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Registry Filters</span>
          
          <div className="space-y-3">
            {/* Search */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-500">Search File Name</label>
              <div className="relative">
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter name..."
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                />
                <Search className="w-3.5 h-3.5 text-zinc-550 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Score filter */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                <span>Minimum Rating Score:</span>
                <span className="font-mono text-purple-400">{scoreRange}%</span>
              </div>
              <input
                type="range" min="50" max="95" value={scoreRange}
                onChange={(e) => setScoreRange(Number(e.target.value))}
                className="w-full accent-purple-600 bg-zinc-900 h-1.5 rounded-full"
              />
            </div>

            {/* Sort select */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2 outline-none text-zinc-300 mt-1"
              >
                <option value="date">Date Scanned</option>
                <option value="score">ATS Rating Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Snapshots lists */}
        <div className="lg:col-span-8 space-y-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Snapshot Registry ({filteredHistory.length})</span>

          {filteredHistory.map((item) => {
            const isActive = currentCV.name === item.data.name && currentCV.title === item.data.title;
            return (
              <div 
                key={item.id}
                className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition select-none ${
                  isActive 
                    ? 'bg-purple-950/15 border-purple-500/25 shadow-[0_0_20px_rgba(168,85,247,0.06)]' 
                    : 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center space-x-3.5 truncate">
                  <FileText className={`w-8 h-8 shrink-0 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                  <div className="truncate text-left">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{item.filename}</h4>
                      {isActive && (
                        <span className="text-[8px] uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-mono font-bold leading-none">
                          Active Workspace
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Scanned: {item.date} • Rating score: {item.score}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
                  <div className="text-right pr-2">
                    <span className="text-[9px] uppercase font-bold text-zinc-550 block font-mono">ATS Rating</span>
                    <span className="text-md font-bold font-mono text-purple-400">{item.atsScore}%</span>
                  </div>

                  <div className="flex space-x-2">
                    {!isActive && (
                      <button
                        onClick={() => handleRestore(item.id)}
                        className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition"
                        title="Restore Snapshot"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    {item.id !== 'hist-default' && (
                      <button
                        onClick={() => deleteCVFromHistory(item.id)}
                        className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-red-950/20 rounded-lg text-zinc-500 hover:text-red-400 transition"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredHistory.length === 0 && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-12 text-center text-zinc-650 text-xs py-16">
              No snapshots match the active filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
