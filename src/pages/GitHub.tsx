import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderGit2, ArrowLeft, Search, Plus, Trash2, Upload, Check, 
  Sparkles, RefreshCw, Copy, CheckCircle, Info
} from 'lucide-react';

interface GitHubRepo {
  name: string;
  language: string;
  docScore: number;
  testScore: number;
  customTags: string[];
  complexity: string;
  ciBadge: boolean;
}

export const GitHub: React.FC = () => {
  const { triggerAdminAction, setActiveTab } = useApp();
  const [username, setUsername] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [repoData, setRepoData] = useState<{
    qualityScore: number;
    readmeScore: number;
    commitFrequency: string;
    repos: GitHubRepo[];
  } | null>(null);

  // Feature states
  const [isConnected, setIsConnected] = useState(false);
  const [scanLimit, setScanLimit] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'docScore' | 'testScore'>('name');
  const [passingThreshold, setPassingThreshold] = useState(75);
  const [showComplexity, setShowComplexity] = useState(false);
  
  // Custom repo adder states
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoLang, setNewRepoLang] = useState('TypeScript');
  const [newRepoDocScore, setNewRepoDocScore] = useState(80);
  const [newRepoTestScore, setNewRepoTestScore] = useState(70);

  // Selected repo for audit checklist
  const [selectedRepoIdx, setSelectedRepoIdx] = useState<number | null>(null);
  const [checklistReadme, setChecklistReadme] = useState(true);
  const [checklistLicense, setChecklistLicense] = useState(true);
  const [checklistContributing, setChecklistContributing] = useState(false);
  const [checklistCodeOfConduct, setChecklistCodeOfConduct] = useState(false);
  const [checklistSecurity, setChecklistSecurity] = useState(false);

  // Import payload
  const [importJson, setImportJson] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  // Sync to CV state
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Timeline commitment multiplier
  const [commitRange, setCommitRange] = useState<'month' | 'quarter' | 'year'>('month');

  const runGitHubScan = () => {
    if (!username.trim()) return;
    setIsScanning(true);
    setRepoData(null);
    triggerAdminAction(`[INTEGRATION] GitHub scan requested: ${username} with limit: ${scanLimit}`);

    setTimeout(() => {
      setIsScanning(false);
      setRepoData({
        qualityScore: 84,
        readmeScore: 80,
        commitFrequency: commitRange === 'month' 
          ? "Active (32 commits last month)" 
          : commitRange === 'quarter' 
            ? "Very Active (112 commits last quarter)" 
            : "High Frequency (450 commits last year)",
        repos: [
          { name: "cv-analyzer-core", language: "TypeScript", docScore: 92, testScore: 85, customTags: ["core", "nlp"], complexity: "Low", ciBadge: true },
          { name: "react-neon-glow", language: "JavaScript", docScore: 78, testScore: 40, customTags: ["ui", "css"], complexity: "Medium", ciBadge: false },
          { name: "python-ats-parser", language: "Python", docScore: 85, testScore: 72, customTags: ["backend", "regex"], complexity: "High", ciBadge: true },
          { name: "go-metrics-pipeline", language: "Go", docScore: 64, testScore: 90, customTags: ["telemetry"], complexity: "Low", ciBadge: true }
        ]
      });
      setIsConnected(true);
    }, 1200);
  };

  // 1. Add mock repository manually
  const handleAddCustomRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim() || !repoData) return;

    const newRepo: GitHubRepo = {
      name: newRepoName.trim(),
      language: newRepoLang,
      docScore: Number(newRepoDocScore),
      testScore: Number(newRepoTestScore),
      customTags: ["custom"],
      complexity: "Medium",
      ciBadge: false
    };

    const updatedRepos = [...repoData.repos, newRepo];
    recalculateQuality(updatedRepos);
    setNewRepoName('');
    triggerAdminAction(`[INTEGRATION] Custom repository added: ${newRepo.name}`);
  };

  // 2. Delete repository from audit
  const handleDeleteRepo = (index: number) => {
    if (!repoData) return;
    const updatedRepos = repoData.repos.filter((_, i) => i !== index);
    recalculateQuality(updatedRepos);
    if (selectedRepoIdx === index) {
      setSelectedRepoIdx(null);
    } else if (selectedRepoIdx !== null && selectedRepoIdx > index) {
      setSelectedRepoIdx(selectedRepoIdx - 1);
    }
    triggerAdminAction(`[INTEGRATION] Removed repo at index: ${index}`);
  };

  // 3. Recalculate average scores
  const recalculateQuality = (reposList: GitHubRepo[]) => {
    if (reposList.length === 0) {
      setRepoData({
        qualityScore: 0,
        readmeScore: 0,
        commitFrequency: "Empty Sandbox",
        repos: []
      });
      return;
    }
    const sumDoc = reposList.reduce((acc, r) => acc + r.docScore, 0);
    const sumTest = reposList.reduce((acc, r) => acc + r.testScore, 0);
    const avgDoc = Math.round(sumDoc / reposList.length);
    const avgTest = Math.round(sumTest / reposList.length);
    const overall = Math.round((avgDoc + avgTest) / 2);

    setRepoData({
      ...repoData!,
      qualityScore: overall,
      readmeScore: avgDoc,
      repos: reposList
    });
  };

  // 4. Boost tests coverage instantly
  const handleBoostTests = () => {
    if (!repoData) return;
    const updated = repoData.repos.map(r => ({
      ...r,
      testScore: Math.min(100, Math.round(r.testScore * 1.3))
    }));
    recalculateQuality(updated);
    triggerAdminAction("[INTEGRATION] Boosted repo test coverages");
  };

  // 5. Optimize readmes automatically
  const handleOptimizeReadmes = () => {
    if (!repoData) return;
    const updated = repoData.repos.map(r => ({
      ...r,
      docScore: Math.min(100, Math.round(r.docScore * 1.25))
    }));
    recalculateQuality(updated);
    triggerAdminAction("[INTEGRATION] Optimized repository README layout documentation scores");
  };

  // 6. Sync skills to active resume workspace
  const handleSyncToCV = () => {
    if (!repoData) return;
    setSyncSuccess(true);
    const uniqueLangs = Array.from(new Set(repoData.repos.map(r => r.language)));
    triggerAdminAction(`[INTEGRATION] Sync GitHub languages ${uniqueLangs.join(', ')} to resume skills`);
    setTimeout(() => setSyncSuccess(false), 2000);
  };

  // 7. Toggle mock CI badge
  const toggleCiBadge = (index: number) => {
    if (!repoData) return;
    const updated = [...repoData.repos];
    updated[index].ciBadge = !updated[index].ciBadge;
    updated[index].testScore = updated[index].ciBadge 
      ? Math.min(100, updated[index].testScore + 10)
      : Math.max(0, updated[index].testScore - 10);
    recalculateQuality(updated);
  };

  // 8. Interactive Checklist update for selected repository
  const handleApplyChecklist = () => {
    if (selectedRepoIdx === null || !repoData) return;
    let score = 30; // base score
    if (checklistReadme) score += 20;
    if (checklistLicense) score += 15;
    if (checklistContributing) score += 15;
    if (checklistCodeOfConduct) score += 10;
    if (checklistSecurity) score += 10;

    const updated = [...repoData.repos];
    updated[selectedRepoIdx].docScore = score;
    recalculateQuality(updated);
    triggerAdminAction(`[INTEGRATION] Applied checklists score to ${updated[selectedRepoIdx].name}`);
  };

  // 9. Export Audit state as JSON
  const handleExportJson = () => {
    if (!repoData) return;
    navigator.clipboard.writeText(JSON.stringify(repoData, null, 2));
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
    triggerAdminAction("[INTEGRATION] Exported repository audits layout config");
  };

  // 10. Import custom mock repository payload
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (parsed && Array.isArray(parsed.repos)) {
        setRepoData({
          qualityScore: parsed.qualityScore || 80,
          readmeScore: parsed.readmeScore || 75,
          commitFrequency: parsed.commitFrequency || "Custom Uploaded Profile",
          repos: parsed.repos.map((r: any) => ({
            name: r.name || "unnamed-repo",
            language: r.language || "TypeScript",
            docScore: r.docScore || 70,
            testScore: r.testScore || 60,
            customTags: r.customTags || [],
            complexity: r.complexity || "Medium",
            ciBadge: !!r.ciBadge
          }))
        });
        setShowImportArea(false);
        setImportJson('');
        triggerAdminAction("[INTEGRATION] Loaded custom repository configuration payload");
      } else {
        alert("Invalid format: JSON must contain a 'repos' array.");
      }
    } catch (err) {
      alert("Failed to parse JSON schema. Verify structure details.");
    }
  };

  // Gather languages for interactive filtering tags
  const availableLanguages = repoData 
    ? ["All", ...Array.from(new Set(repoData.repos.map(r => r.language)))]
    : ["All"];

  // Filter and Sort repos
  const processedRepos = repoData 
    ? repoData.repos
        .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(r => selectedLanguage === 'All' || r.language === selectedLanguage)
        .sort((a, b) => {
          if (sortBy === 'docScore') return b.docScore - a.docScore;
          if (sortBy === 'testScore') return b.testScore - a.testScore;
          return a.name.localeCompare(b.name);
        })
    : [];

  return (
    <div className="space-y-6 select-none text-left">
      {/* Header section */}
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
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-purple-400" />
              <span>GitHub Portfolio Analyzer</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Audit codebase documentation indexes, testing scopes, and project qualities.</p>
          </div>
        </div>

        {/* Connection status tag */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded-lg flex items-center space-x-1">
              <Check className="w-3 h-3" />
              <span>Connected as @{username || "octocat"}</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-mono font-bold rounded-lg">
              Not Connected
            </span>
          )}
          
          {repoData && (
            <button
              onClick={() => setIsConnected(!isConnected)}
              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 text-[10px] font-bold transition"
            >
              Toggle OAuth Mock
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Mock Tools */}
        <div className="lg:col-span-5 space-y-6">
          {/* Indexer controller */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/40">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Repository Indexer</span>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">GitHub Developer Username</label>
                <input 
                  type="text" 
                  placeholder="octocat, devname, etc." 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs text-white focus:border-purple-500 outline-none" 
                />
              </div>

              {/* Slider for max repos to scan */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                  <span>Max Repositories Scan Limit:</span>
                  <span className="text-purple-400">{scanLimit} repos</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={scanLimit}
                  onChange={(e) => setScanLimit(Number(e.target.value))}
                  className="w-full accent-purple-600 bg-zinc-900 h-1 rounded-full cursor-pointer"
                />
              </div>

              {/* Commits range picker */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block">Commit Analysis Scope</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['month', 'quarter', 'year'] as const).map((rng) => (
                    <button
                      key={rng}
                      type="button"
                      onClick={() => setCommitRange(rng)}
                      className={`py-1 text-[10px] font-bold rounded-lg border transition capitalize ${
                        commitRange === rng 
                          ? 'bg-purple-950/35 border-purple-500 text-purple-300' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Past {rng}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={runGitHubScan}
              disabled={isScanning || !username.trim()}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 active:scale-95 flex items-center justify-center space-x-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting Commits Feed...</span>
                </>
              ) : (
                <span>Audit GitHub Repositories</span>
              )}
            </button>
          </div>

          {/* Add custom repo form */}
          {repoData && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 bg-zinc-950/20 text-xs">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Add Repository Manually</span>
              <form onSubmit={handleAddCustomRepo} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-zinc-500">Repository Name</label>
                  <input
                    type="text"
                    placeholder="e.g. custom-rest-api"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-[9px] uppercase font-bold text-zinc-500 block">Lang</label>
                    <select
                      value={newRepoLang}
                      onChange={(e) => setNewRepoLang(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-[10px] text-zinc-300 outline-none"
                    >
                      <option value="TypeScript">TypeScript</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Python">Python</option>
                      <option value="Go">Go</option>
                      <option value="HTML/CSS">HTML/CSS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-zinc-500 block">Doc %</label>
                    <input
                      type="number" min="0" max="100"
                      value={newRepoDocScore}
                      onChange={(e) => setNewRepoDocScore(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-[10px] text-white text-center outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-zinc-500 block">Test %</label>
                    <input
                      type="number" min="0" max="100"
                      value={newRepoTestScore}
                      onChange={(e) => setNewRepoTestScore(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-[10px] text-white text-center outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newRepoName.trim()}
                  className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[10px] font-bold transition disabled:opacity-40 flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Insert Mock Repository</span>
                </button>
              </form>
            </div>
          )}

          {/* Backup Import/Export & Sync Section */}
          {repoData && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Data Sync & Backup Actions</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExportJson}
                  className="py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg flex items-center justify-center space-x-1.5 font-bold transition text-[10px]"
                >
                  {copyStatus ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copyStatus ? "Copied JSON!" : "Export Config"}</span>
                </button>

                <button
                  onClick={() => setShowImportArea(!showImportArea)}
                  className="py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg flex items-center justify-center space-x-1.5 font-bold transition text-[10px]"
                >
                  <Upload className="w-3 h-3" />
                  <span>Load Config</span>
                </button>
              </div>

              {showImportArea && (
                <div className="space-y-2 pt-2 border-t border-zinc-900 animate-slide-down">
                  <textarea
                    rows={4}
                    placeholder='{"qualityScore": 80, "repos": [{"name": "repo1", "language": "Go", "docScore": 80, "testScore": 75}]}'
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-2 text-[10px] text-zinc-300 font-mono outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleImportJson}
                    disabled={!importJson.trim()}
                    className="w-full py-1.5 bg-purple-600/25 border border-purple-500/30 text-purple-300 hover:bg-purple-600/40 rounded-lg font-bold transition text-[10px] disabled:opacity-40"
                  >
                    Parse & Load Payload
                  </button>
                </div>
              )}

              <button
                onClick={handleSyncToCV}
                className="w-full py-2 bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 border border-purple-500/25 text-purple-300 rounded-xl text-[10px] font-bold tracking-wider uppercase transition flex items-center justify-center space-x-1.5 shadow-md"
              >
                {syncSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sync Successful!</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Sync Languages to CV Skills</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Scans results list & audits details */}
        <div className="lg:col-span-7 space-y-4">
          {isScanning && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-bold">Scanning repositories and clean code structures...</p>
            </div>
          )}

          {!isScanning && repoData === null && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-8 text-center text-zinc-600 text-xs py-24 min-h-[300px] flex flex-col items-center justify-center space-y-3">
              <FolderGit2 className="w-12 h-12 text-zinc-800" />
              <p className="font-semibold text-zinc-500">Submit your GitHub username to review repository documentations & testing.</p>
            </div>
          )}

          {!isScanning && repoData !== null && (
            <div className="space-y-4 animate-float">
              {/* Metrics grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass-panel border-zinc-900 rounded-xl p-4 bg-zinc-950/20 text-center">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 block">Overall Score</span>
                  <span className="text-xl font-bold font-mono text-purple-400 block mt-1">{repoData.qualityScore}%</span>
                </div>
                
                <div className="glass-panel border-zinc-900 rounded-xl p-4 bg-zinc-950/20 text-center">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 block">Average Documentation</span>
                  <span className="text-xl font-bold font-mono text-cyan-400 block mt-1">{repoData.readmeScore}%</span>
                </div>

                <div className="glass-panel border-zinc-900 rounded-xl p-4 bg-zinc-950/20 text-center flex flex-col justify-center">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 block">Commit Feed Status</span>
                  <span className="text-[10px] font-semibold text-white mt-1 leading-tight">{repoData.commitFrequency}</span>
                </div>
              </div>

              {/* Quick Action Boosters */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-4 bg-zinc-950/10 flex flex-wrap gap-2 items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">AI Refactoring Quick Actions:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBoostTests}
                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg font-bold text-[10px] transition flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Boost Test Coverage</span>
                  </button>

                  <button
                    onClick={handleOptimizeReadmes}
                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg font-bold text-[10px] transition flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Auto-Fix Readmes</span>
                  </button>
                </div>
              </div>

              {/* Filtering & Settings Panel */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-4 space-y-3 bg-zinc-950/20 text-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Search query input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-7 pr-3 py-1.5 text-[11px] text-zinc-300 outline-none focus:border-purple-500"
                    />
                    <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-2.5" />
                  </div>

                  {/* Target Passing slider */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 block">Target Threshold:</span>
                      <span className="text-[10px] font-mono text-purple-400 font-bold">{passingThreshold}%</span>
                    </div>
                    <input
                      type="range" min="50" max="90" value={passingThreshold}
                      onChange={(e) => setPassingThreshold(Number(e.target.value))}
                      className="accent-purple-600 bg-zinc-900 h-1 rounded-full cursor-pointer w-20"
                    />
                  </div>

                  {/* Complexity & Sort options */}
                  <div className="flex space-x-2 shrink-0">
                    <button
                      onClick={() => setShowComplexity(!showComplexity)}
                      className={`px-2 py-1.5 border rounded-lg text-[10px] font-bold transition ${
                        showComplexity 
                          ? 'bg-purple-950/20 border-purple-500 text-purple-300' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {showComplexity ? "Hide Complexity" : "Show Complexity"}
                    </button>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 text-[10px] rounded-lg px-2 py-1.5 text-zinc-300 outline-none"
                    >
                      <option value="name">Sort: Alphabetical</option>
                      <option value="docScore">Sort: Document Score</option>
                      <option value="testScore">Sort: Test Coverage</option>
                    </select>
                  </div>
                </div>

                {/* Language tags list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border transition ${
                        selectedLanguage === lang
                          ? 'bg-purple-500/10 border-purple-500 text-purple-400 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repositories list view */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                  Repository Quality Audits ({processedRepos.length})
                </span>
                
                <div className="space-y-3 text-xs">
                  {processedRepos.map((repo, idx) => {
                    const originalIdx = repoData.repos.findIndex(r => r.name === repo.name);
                    const isPassed = repo.docScore >= passingThreshold && repo.testScore >= passingThreshold;
                    const isSelected = selectedRepoIdx === originalIdx;

                    return (
                      <div 
                        key={idx} 
                        className={`p-3 bg-zinc-900/30 border rounded-xl space-y-2 transition ${
                          isSelected ? 'border-purple-500/40 bg-purple-950/5' : 'border-zinc-900'
                        }`}
                      >
                        <div className="flex justify-between items-baseline font-bold">
                          <button
                            onClick={() => setSelectedRepoIdx(isSelected ? null : originalIdx)}
                            className="text-white hover:text-purple-400 flex items-center space-x-1.5 font-bold transition"
                          >
                            <FolderGit2 className="w-4 h-4 text-purple-400 shrink-0" />
                            <span>{repo.name}</span>
                            <span className="text-[9px] font-normal text-zinc-500 font-mono">({repo.language})</span>
                          </button>

                          <div className="flex items-center space-x-2">
                            {/* Passing Badge */}
                            {isPassed ? (
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono rounded font-bold">
                                PASS
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-mono rounded font-bold">
                                FAIL
                              </span>
                            )}
                            
                            {/* Delete repo */}
                            <button
                              onClick={() => handleDeleteRepo(originalIdx)}
                              className="text-zinc-650 hover:text-red-400 transition"
                              title="Delete Repo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Custom tags */}
                        {repo.customTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {repo.customTags.map((tag) => (
                              <span key={tag} className="px-1.5 py-0.2 bg-zinc-900 text-zinc-500 text-[8px] rounded border border-zinc-800 font-mono">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-[10px] pt-1">
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Readme Docs:</span>
                            <span className={repo.docScore >= passingThreshold ? 'text-emerald-400 font-bold' : 'text-yellow-400 font-bold'}>
                              {repo.docScore}%
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-zinc-400">
                            <span>Test Coverage:</span>
                            <span className={repo.testScore >= passingThreshold ? 'text-emerald-400 font-bold' : 'text-yellow-400 font-bold'}>
                              {repo.testScore}%
                            </span>
                          </div>
                        </div>

                        {/* CI/CD Badge & Complexity toggle options */}
                        <div className="flex items-center justify-between pt-1 text-[10px] border-t border-zinc-900/60">
                          <div className="flex items-center space-x-2">
                            <span className="text-zinc-500 text-[9px]">CI/CD Badges:</span>
                            <button
                              onClick={() => toggleCiBadge(originalIdx)}
                              className={`px-1.5 py-0.5 rounded border font-bold text-[8px] font-mono transition ${
                                repo.ciBadge 
                                  ? 'bg-purple-950/20 border-purple-500/30 text-purple-300' 
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-650'
                              }`}
                            >
                              {repo.ciBadge ? "PASSING" : "NO CI BADGE"}
                            </button>
                          </div>

                          {showComplexity && (
                            <div className="flex items-center space-x-1.5">
                              <span className="text-zinc-550 text-[9px]">Complexity:</span>
                              <span className={`font-mono text-[9px] font-bold ${
                                repo.complexity === 'High' ? 'text-rose-400' : repo.complexity === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'
                              }`}>
                                {repo.complexity}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Expandable Interactive Audit Checklist Drawer */}
                        {isSelected && (
                          <div className="mt-3 p-3 bg-zinc-900/40 border border-zinc-800 rounded-lg space-y-3 animate-slide-down text-left">
                            <div className="flex items-center space-x-1 text-purple-300 font-bold text-[10px]">
                              <Info className="w-3.5 h-3.5" />
                              <span>Audit Checklist details for "{repo.name}"</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checklistReadme}
                                  onChange={(e) => setChecklistReadme(e.target.checked)}
                                  className="rounded border-zinc-800 bg-zinc-900 accent-purple-600 cursor-pointer"
                                />
                                <span>README.md Exists (+20)</span>
                              </label>

                              <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checklistLicense}
                                  onChange={(e) => setChecklistLicense(e.target.checked)}
                                  className="rounded border-zinc-800 bg-zinc-900 accent-purple-600 cursor-pointer"
                                />
                                <span>LICENSE Details (+15)</span>
                              </label>

                              <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checklistContributing}
                                  onChange={(e) => setChecklistContributing(e.target.checked)}
                                  className="rounded border-zinc-800 bg-zinc-900 accent-purple-600 cursor-pointer"
                                />
                                <span>CONTRIBUTING Guide (+15)</span>
                              </label>

                              <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checklistCodeOfConduct}
                                  onChange={(e) => setChecklistCodeOfConduct(e.target.checked)}
                                  className="rounded border-zinc-800 bg-zinc-900 accent-purple-600 cursor-pointer"
                                />
                                <span>Code of Conduct (+10)</span>
                              </label>

                              <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={checklistSecurity}
                                  onChange={(e) => setChecklistSecurity(e.target.checked)}
                                  className="rounded border-zinc-800 bg-zinc-900 accent-purple-600 cursor-pointer"
                                />
                                <span>SECURITY Policy (+10)</span>
                              </label>
                            </div>

                            <button
                              onClick={handleApplyChecklist}
                              className="w-full py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-bold tracking-wider uppercase transition"
                            >
                              Update Documentation Score
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

