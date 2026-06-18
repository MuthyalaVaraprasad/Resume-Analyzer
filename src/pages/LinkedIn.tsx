import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, CheckCircle, ArrowLeft, Check, Copy, Trash2, 
  RefreshCw, Upload, ExternalLink
} from 'lucide-react';

interface RecommendationCheck {
  check: string;
  status: 'pass' | 'warning';
  desc: string;
}

export const LinkedIn: React.FC = () => {
  const { triggerAdminAction, setActiveTab } = useApp();
  const [profileUrl, setProfileUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [auditResults, setAuditResults] = useState<{
    visibilityScore: number;
    headline: string;
    recommendations: RecommendationCheck[];
  } | null>(null);

  // Feature States
  const [headlineTone, setHeadlineTone] = useState<'Executive' | 'Technical' | 'Startup' | 'Creative'>('Technical');
  const [customHeadline, setCustomHeadline] = useState('');
  const [headlineCharLimit, setHeadlineCharLimit] = useState(220);
  const [targetKeywords, setTargetKeywords] = useState('React, Architecture, TypeScript, Cloud');
  const [connectionsCount, setConnectionsCount] = useState(500);
  const [isOpenToWork, setIsOpenToWork] = useState(false);
  const [industrySector, setIndustrySector] = useState('Technology');
  
  // Section Completeness Sliders
  const [aboutCompleteness, setAboutCompleteness] = useState(85);
  const [expCompleteness, setExpCompleteness] = useState(90);
  const [recommendationsCount, setRecommendationsCount] = useState(3);
  
  // Custom Recommendation form
  const [newCheckName, setNewCheckName] = useState('');
  const [newCheckDesc, setNewCheckDesc] = useState('');
  const [newCheckStatus, setNewCheckStatus] = useState<'pass' | 'warning'>('warning');

  // Copy/Sync states
  const [copyStatus, setCopyStatus] = useState(false);
  const [syncStatus, setSyncStatus] = useState(false);

  // Outreach Template Generator
  const [outreachType, setOutreachType] = useState<'Referral' | 'FollowUp' | 'Networking'>('Referral');
  const [outreachTemplate, setOutreachTemplate] = useState('');
  const [copiedOutreach, setCopiedOutreach] = useState(false);

  // Import/Export States
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [exportCopyStatus, setExportCopyStatus] = useState(false);

  // Regex URL Validator
  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    const regex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]+\/?$/;
    return regex.test(url.trim());
  };

  const isUrlValid = profileUrl ? validateUrl(profileUrl) : null;

  // Headline generation mapping
  const headlinePresets = {
    Technical: "Senior Software Engineer | React 19 Expert | Distributed Systems & Next.js Architecture",
    Executive: "Vice President of Engineering | Scaling High-Performing Dev Teams & Cloud Platforms",
    Startup: "Founding Engineer | Full-Stack Product Architect | Fast-Growth SaaS & AI Integrations",
    Creative: "Lead UX Architect | Design Systems Engineer | Crafting High-Fidelity Web Experiences"
  };

  const runLinkedInScan = () => {
    if (!profileUrl.trim()) return;
    setIsScanning(true);
    setAuditResults(null);
    triggerAdminAction(`[INTEGRATION] LinkedIn scan requested for URL: ${profileUrl}`);

    setTimeout(() => {
      setIsScanning(false);
      const initialHeadline = headlinePresets[headlineTone];
      setCustomHeadline(initialHeadline);
      
      setAuditResults({
        visibilityScore: calculateScore(aboutCompleteness, expCompleteness, recommendationsCount, isOpenToWork),
        headline: initialHeadline,
        recommendations: [
          { check: "Headline keywords density", status: "pass", desc: "Successfully included high-density technical tags." },
          { check: "About section summary outcome metrics", status: "warning", desc: "Needs quantifiable deliverables. Focus on ARR or system speeds." },
          { check: "Contact details visibility tags", status: "pass", desc: "Email and personal portfolio websites are accessible." },
          { check: "Connections Index Factor", status: connectionsCount >= 500 ? "pass" : "warning", desc: `Connections level at ${connectionsCount}. Ideal is 500+.` }
        ]
      });
      generateOutreachDraft('Referral', initialHeadline);
    }, 1200);
  };

  // Score Calculator based on sliders & toggles
  const calculateScore = (about: number, exp: number, recs: number, openToWork: boolean): number => {
    let base = Math.round((about + exp) / 2);
    const recPoints = Math.min(10, recs * 3); // max 10 points for recs
    base += recPoints;
    if (openToWork) base += 8; // bonus points
    return Math.min(100, base);
  };

  // Recalculate overall metrics score
  const handleRecalculateScores = () => {
    if (!auditResults) return;
    const nextScore = calculateScore(aboutCompleteness, expCompleteness, recommendationsCount, isOpenToWork);
    setAuditResults({
      ...auditResults,
      visibilityScore: nextScore
    });
    triggerAdminAction(`[INTEGRATION] Recalculated LinkedIn visibility score: ${nextScore}`);
  };

  // Change Headline tone and update fields
  const handleHeadlineToneChange = (tone: 'Executive' | 'Technical' | 'Startup' | 'Creative') => {
    setHeadlineTone(tone);
    const updatedHeadline = headlinePresets[tone];
    setCustomHeadline(updatedHeadline);
    if (auditResults) {
      setAuditResults({
        ...auditResults,
        headline: updatedHeadline
      });
    }
    generateOutreachDraft(outreachType, updatedHeadline);
    triggerAdminAction(`[INTEGRATION] Switched suggested headline tone to: ${tone}`);
  };

  // Generate outreach drafts dynamically
  const generateOutreachDraft = (type: 'Referral' | 'FollowUp' | 'Networking', headlineStr: string) => {
    setOutreachType(type);
    const title = headlineStr.split('|')[0].trim();
    if (type === 'Referral') {
      setOutreachTemplate(`Hi [Recruiter Name],\n\nI hope you're well. I came across your team's openings for technical roles. Given my background as a ${title}, I'd love to connect and share my portfolio. Would you be open to a quick chat next week?\n\nBest,\n[Your Name]`);
    } else if (type === 'FollowUp') {
      setOutreachTemplate(`Hi [Hiring Manager],\n\nI recently submitted my application for the Software Engineer role and wanted to reiterate my interest. With my experience in ${targetKeywords.split(',')[0] || "React"}, I am confident I can hit the ground running. Let me know if you need any extra references.\n\nBest regards,\n[Your Name]`);
    } else {
      setOutreachTemplate(`Hi [Professional Name],\n\nI saw your profile and admired your career path at [Company]. As a fellow specialist in ${industrySector}, I'd love to add you to my network to keep up with your insights.\n\nWarmly,\n[Your Name]`);
    }
  };

  // Keyword density matches calculator
  const checkKeywordsDensity = () => {
    const list = targetKeywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    if (list.length === 0) return 0;
    const text = customHeadline.toLowerCase();
    const matches = list.filter(k => text.includes(k));
    return Math.round((matches.length / list.length) * 100);
  };

  const densityMatchRate = checkKeywordsDensity();

  // Copy headline tool
  const handleCopyHeadline = () => {
    navigator.clipboard.writeText(customHeadline);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  // Copy outreach draft
  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(outreachTemplate);
    setCopiedOutreach(true);
    setTimeout(() => setCopiedOutreach(false), 2000);
  };

  // Sync to CV active state
  const handleSyncToCV = () => {
    setSyncStatus(true);
    triggerAdminAction(`[INTEGRATION] Synced LinkedIn headline to CV workspace: "${customHeadline}"`);
    setTimeout(() => setSyncStatus(false), 2000);
  };

  // Add custom recommendation checklist item
  const handleAddCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckName.trim() || !auditResults) return;
    const newRec: RecommendationCheck = {
      check: newCheckName.trim(),
      status: newCheckStatus,
      desc: newCheckDesc.trim() || "User custom defined optimizer check."
    };
    setAuditResults({
      ...auditResults,
      recommendations: [...auditResults.recommendations, newRec]
    });
    setNewCheckName('');
    setNewCheckDesc('');
    triggerAdminAction(`[INTEGRATION] Added custom LinkedIn audit: ${newRec.check}`);
  };

  // Remove checklist item
  const handleRemoveCheck = (index: number) => {
    if (!auditResults) return;
    const updated = auditResults.recommendations.filter((_, i) => i !== index);
    setAuditResults({
      ...auditResults,
      recommendations: updated
    });
  };

  // Clear checklist
  const handleClearChecks = () => {
    if (!auditResults) return;
    setAuditResults({
      ...auditResults,
      recommendations: []
    });
    triggerAdminAction("[INTEGRATION] Cleared LinkedIn checklist checks.");
  };

  // Export state JSON
  const handleExportJson = () => {
    if (!auditResults) return;
    const payload = {
      aboutCompleteness,
      expCompleteness,
      recommendationsCount,
      isOpenToWork,
      connectionsCount,
      industrySector,
      headlineTone,
      customHeadline,
      auditResults
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setExportCopyStatus(true);
    setTimeout(() => setExportCopyStatus(false), 2000);
    triggerAdminAction("[INTEGRATION] Exported LinkedIn optimizer state configuration payload.");
  };

  // Import state JSON
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (parsed) {
        if (parsed.aboutCompleteness !== undefined) setAboutCompleteness(parsed.aboutCompleteness);
        if (parsed.expCompleteness !== undefined) setExpCompleteness(parsed.expCompleteness);
        if (parsed.recommendationsCount !== undefined) setRecommendationsCount(parsed.recommendationsCount);
        if (parsed.isOpenToWork !== undefined) setIsOpenToWork(!!parsed.isOpenToWork);
        if (parsed.connectionsCount !== undefined) setConnectionsCount(parsed.connectionsCount);
        if (parsed.industrySector !== undefined) setIndustrySector(parsed.industrySector);
        if (parsed.headlineTone !== undefined) setHeadlineTone(parsed.headlineTone);
        if (parsed.customHeadline !== undefined) setCustomHeadline(parsed.customHeadline);
        if (parsed.auditResults) setAuditResults(parsed.auditResults);
        
        setShowImport(false);
        setImportJson('');
        triggerAdminAction("[INTEGRATION] Loaded LinkedIn optimizer configuration payload successfully.");
      }
    } catch (e) {
      alert("Failed to parse JSON configuration schema. Verify structure details.");
    }
  };

  return (
    <div className="space-y-6 select-none text-left">
      {/* Header Panel */}
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
              <span className="text-cyan-400">in</span>
              <span>LinkedIn Profile Analyzer</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Audit headlines, summary hooks, and search indexing rating positions.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: URL Input and Sliders */}
        <div className="lg:col-span-6 space-y-6">
          {/* Profile URL details */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/40">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Profile Link Audits</span>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">LinkedIn Profile URL</label>
                <input 
                  type="text" 
                  placeholder="https://linkedin.com/in/username" 
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className={`w-full bg-zinc-900/60 border rounded-xl p-2 text-xs text-white outline-none transition ${
                    isUrlValid === true ? 'border-emerald-500/50 focus:border-emerald-500' : 
                    isUrlValid === false ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-purple-500'
                  }`} 
                />

                {/* Validation Indicator Banner */}
                {isUrlValid === true && (
                  <p className="text-[9px] text-emerald-400 font-bold flex items-center space-x-1 mt-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Valid LinkedIn URL format structure</span>
                  </p>
                )}
                {isUrlValid === false && (
                  <p className="text-[9px] text-red-400 font-bold flex items-center space-x-1 mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Mismatch: URL must match pattern (/in/username)</span>
                  </p>
                )}
              </div>

              {/* Connections Estimator */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                  <span>LinkedIn Network Connections:</span>
                  <span className="text-cyan-400">{connectionsCount === 1000 ? "1000+ Connections" : `${connectionsCount} connections`}</span>
                </div>
                <input
                  type="range" min="50" max="1000" step="50"
                  value={connectionsCount}
                  onChange={(e) => setConnectionsCount(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-zinc-900 h-1 rounded-full cursor-pointer"
                />
              </div>

              {/* Industry target category */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase block">Target Industry Sector</label>
                <select
                  value={industrySector}
                  onChange={(e) => setIndustrySector(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2 text-zinc-300 outline-none mt-1"
                >
                  <option value="Technology">Technology & Software Systems</option>
                  <option value="Finance">Finance, Wealth & Banking</option>
                  <option value="Healthcare">Healthcare & Biotech</option>
                  <option value="Marketing">Marketing & Sales Strategy</option>
                  <option value="Creative">Creative Arts & Design UX</option>
                </select>
              </div>

              {/* Open to work toggle badge */}
              <label className="flex items-center space-x-2 text-[10px] text-zinc-400 font-bold cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isOpenToWork}
                  onChange={(e) => setIsOpenToWork(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-900 accent-purple-600 cursor-pointer"
                />
                <span>Simulate "Open to Work" Badge Status (+8 Score)</span>
              </label>
            </div>

            <button
              onClick={runLinkedInScan}
              disabled={isScanning || !profileUrl.trim()}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 active:scale-95 flex items-center justify-center space-x-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Headline Matrices...</span>
                </>
              ) : (
                <span>Audit LinkedIn Profile</span>
              )}
            </button>
          </div>

          {/* Completeness Section Sliders */}
          {auditResults && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
              <div className="flex justify-between items-baseline border-b border-zinc-900 pb-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Completeness Diagnostics</span>
                <button
                  onClick={handleRecalculateScores}
                  className="text-[9px] font-bold text-purple-400 hover:text-purple-300 transition flex items-center space-x-1"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Update Score</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* About completeness slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>About Section Completeness:</span>
                    <span className="font-bold text-white">{aboutCompleteness}%</span>
                  </div>
                  <input
                    type="range" min="20" max="100" value={aboutCompleteness}
                    onChange={(e) => setAboutCompleteness(Number(e.target.value))}
                    className="w-full accent-purple-600 bg-zinc-900 h-1 rounded-full cursor-pointer"
                  />
                </div>

                {/* Experience completeness slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Experience Section Completeness:</span>
                    <span className="font-bold text-white">{expCompleteness}%</span>
                  </div>
                  <input
                    type="range" min="20" max="100" value={expCompleteness}
                    onChange={(e) => setExpCompleteness(Number(e.target.value))}
                    className="w-full accent-purple-600 bg-zinc-900 h-1 rounded-full cursor-pointer"
                  />
                </div>

                {/* Recommendations Count */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Professional Recommendations:</span>
                    <span className="font-bold text-white">{recommendationsCount} items</span>
                  </div>
                  <input
                    type="range" min="0" max="10" value={recommendationsCount}
                    onChange={(e) => setRecommendationsCount(Number(e.target.value))}
                    className="w-full accent-purple-600 bg-zinc-900 h-1 rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Backup Import/Export */}
          {auditResults && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Optimizer Configuration Actions</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExportJson}
                  className="py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg flex items-center justify-center space-x-1.5 font-bold transition text-[10px]"
                >
                  {exportCopyStatus ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{exportCopyStatus ? "Copied JSON!" : "Export Config"}</span>
                </button>
                <button
                  onClick={() => setShowImport(!showImport)}
                  className="py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg flex items-center justify-center space-x-1.5 font-bold transition text-[10px]"
                >
                  <Upload className="w-3 h-3" />
                  <span>Load Config</span>
                </button>
              </div>

              {showImport && (
                <div className="space-y-2 pt-2 border-t border-zinc-900 animate-slide-down">
                  <textarea
                    rows={4}
                    placeholder='{"aboutCompleteness": 90, "expCompleteness": 85, "isOpenToWork": true}'
                    value={importJson}
                    onChange={(e) => setImportJson(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-2 text-[10px] text-zinc-300 font-mono outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleImportJson}
                    disabled={!importJson.trim()}
                    className="w-full py-1.5 bg-purple-600/25 border border-purple-500/30 text-purple-300 hover:bg-purple-600/40 rounded-lg font-bold transition text-[10px] disabled:opacity-40"
                  >
                    Parse & Load Configuration
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Outputs and generated content */}
        <div className="lg:col-span-6 space-y-4">
          {isScanning && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-bold">Scanning headline networks...</p>
            </div>
          )}

          {!isScanning && auditResults === null && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-8 text-center text-zinc-650 text-xs py-24 min-h-[300px] flex flex-col items-center justify-center space-y-3">
              <ExternalLink className="w-12 h-12 text-zinc-800" />
              <p className="font-semibold text-zinc-500">Submit your profile URL to review search listings optimization ratings.</p>
            </div>
          )}

          {!isScanning && auditResults !== null && (
            <div className="space-y-4 animate-float">
              {/* Visibility Score card */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-5 flex items-center justify-between bg-zinc-950/30">
                <div>
                  <h4 className="text-sm font-bold text-white">Search Index Visibility</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Rating for tech sector recruiter logs</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-extrabold text-purple-400 font-mono">{auditResults.visibilityScore}%</span>
                  {isOpenToWork && (
                    <span className="text-[8px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 px-1 border border-emerald-500/20 rounded mt-0.5">
                      OPEN TO WORK INCLUDED
                    </span>
                  )}
                </div>
              </div>

              {/* Headline assist & editors */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold text-cyan-400 font-mono block">Suggested Headline Hook</span>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={handleCopyHeadline}
                      className="p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-800 transition"
                      title="Copy to Clipboard"
                    >
                      {copyStatus ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={handleSyncToCV}
                      className="px-2 py-0.5 bg-purple-600/25 border border-purple-500/30 text-purple-300 rounded text-[9px] font-bold transition flex items-center space-x-1 hover:bg-purple-600/40"
                    >
                      {syncStatus ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <RefreshCw className="w-2.5 h-2.5" />}
                      <span>Sync to CV</span>
                    </button>
                  </div>
                </div>

                {/* Tone Selectors */}
                <div className="flex flex-wrap gap-1 border-b border-zinc-900 pb-3">
                  {(['Technical', 'Executive', 'Startup', 'Creative'] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => handleHeadlineToneChange(tone)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border transition ${
                        headlineTone === tone 
                          ? 'bg-cyan-950/20 border-cyan-500 text-cyan-300 font-bold' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-550 hover:text-zinc-300'
                      }`}
                    >
                      {tone} Mode
                    </button>
                  ))}
                </div>

                {/* Editable Headline box */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-baseline text-[9px] text-zinc-500">
                    <label className="uppercase font-bold">Edit Live Headline Draft</label>
                    <span className={`${customHeadline.length > headlineCharLimit ? 'text-red-400 font-bold' : 'text-zinc-450'}`}>
                      {customHeadline.length} / {headlineCharLimit} characters
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-500 font-semibold leading-relaxed"
                  />
                  
                  {/* Slider to adjust targeted character limit constraint */}
                  <div className="flex items-center justify-between text-[9px] text-zinc-550 pt-1">
                    <span>Target Length Constraint:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range" min="120" max="240" step="10"
                        value={headlineCharLimit}
                        onChange={(e) => setHeadlineCharLimit(Number(e.target.value))}
                        className="accent-purple-600 bg-zinc-900 h-1 rounded-full cursor-pointer w-16"
                      />
                      <span className="font-mono text-purple-400 font-bold">{headlineCharLimit}</span>
                    </div>
                  </div>
                </div>

                {/* Keywords density tool */}
                <div className="pt-2 border-t border-zinc-900 space-y-2">
                  <div className="flex justify-between items-baseline text-[9px] text-zinc-500 uppercase font-bold">
                    <span>Filter/Track Target Keywords</span>
                    <span className="text-cyan-400 font-mono">Match density: {densityMatchRate}%</span>
                  </div>
                  <input
                    type="text"
                    value={targetKeywords}
                    onChange={(e) => setTargetKeywords(e.target.value)}
                    placeholder="Enter keywords separated by commas..."
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg p-1.5 text-[10px] text-zinc-300 outline-none"
                  />
                </div>
              </div>

              {/* Outreach generator */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 bg-zinc-950/20 text-xs">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Recruiter Outreach Templates</span>
                  <button
                    onClick={handleCopyOutreach}
                    className="p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded border border-zinc-800 transition flex items-center space-x-1 text-[9px]"
                  >
                    {copiedOutreach ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedOutreach ? "Copied!" : "Copy Pitch"}</span>
                  </button>
                </div>

                <div className="flex space-x-1.5">
                  {(['Referral', 'FollowUp', 'Networking'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => generateOutreachDraft(type, customHeadline)}
                      className={`px-2.5 py-0.5 rounded text-[9px] font-bold border transition ${
                        outreachType === type 
                          ? 'bg-purple-950/30 border-purple-500 text-purple-300' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {type} Pitch
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={outreachTemplate}
                  onChange={(e) => setOutreachTemplate(e.target.value)}
                  className="w-full bg-zinc-900/40 border border-zinc-900 rounded-lg p-2 text-[10px] text-zinc-400 font-mono outline-none"
                />
              </div>

              {/* Audit checks list */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 bg-zinc-950/25">
                <div className="flex justify-between items-baseline border-b border-zinc-900 pb-2">
                  <span className="text-[9px] uppercase font-bold text-zinc-550 tracking-wider block">Audit Checklists ({auditResults.recommendations.length})</span>
                  {auditResults.recommendations.length > 0 && (
                    <button
                      onClick={handleClearChecks}
                      className="text-[9px] font-bold text-red-400 hover:text-red-350 transition"
                    >
                      Clear Checklist
                    </button>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  {auditResults.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start justify-between space-x-2 border-b border-zinc-900/50 pb-2">
                      <div className="flex items-start space-x-2">
                        {rec.status === 'pass' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h5 className="font-bold text-white">{rec.check}</h5>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{rec.desc}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveCheck(idx)}
                        className="text-zinc-650 hover:text-red-400 transition"
                        title="Delete Check"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Check form */}
                <form onSubmit={handleAddCheck} className="space-y-2 pt-2 border-t border-zinc-900 text-[10px]">
                  <span className="uppercase font-bold text-zinc-500 block">Add Custom Checklist Item</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Profile Banner"
                      value={newCheckName}
                      onChange={(e) => setNewCheckName(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded p-1 text-white text-[10px] outline-none"
                    />
                    <select
                      value={newCheckStatus}
                      onChange={(e) => setNewCheckStatus(e.target.value as any)}
                      className="bg-zinc-900 border border-zinc-800 rounded p-1 text-zinc-300 text-[10px] outline-none"
                    >
                      <option value="pass">PASS</option>
                      <option value="warning">WARNING</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Brief description of the check recommendation..."
                    value={newCheckDesc}
                    onChange={(e) => setNewCheckDesc(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-white text-[10px] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newCheckName.trim()}
                    className="w-full py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-bold transition disabled:opacity-40"
                  >
                    Insert Checklist Item
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

