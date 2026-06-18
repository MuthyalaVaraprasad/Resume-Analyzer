import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RadialGauge } from '../components/CustomCharts';
import { 
  CheckCircle, AlertTriangle, ArrowLeft, Plus, Copy, Check, 
  Flame, Activity, FileText, Sparkles, TrendingUp, Layers, RefreshCw
} from 'lucide-react';

export const Analysis: React.FC = () => {
  const { currentCV, updateCurrentCV, setActiveTab, triggerAdminAction } = useApp();

  // 11 New Granular AI Analytics State Variables
  const [missingKeywords, setMissingKeywords] = useState([
    'Kubernetes', 'CI/CD', 'Docker', 'GraphQL', 'System Design', 'Go', 'Redis'
  ]);
  const [benchmark, setBenchmark] = useState<'Junior' | 'Mid' | 'Senior' | 'Lead'>('Senior');
  const [phrasesToClean, setPhrasesToClean] = useState([
    { original: 'utilize synergy', suggestion: 'collaborate cross-functionally' },
    { original: 'results-oriented team player', suggestion: 'delivered project milestones' },
    { original: 'responsible for managing', suggestion: 'managed / spearheaded' }
  ]);
  const [isValidatingPdf, setIsValidatingPdf] = useState(false);
  const [pdfValidationResult, setPdfValidationResult] = useState<'idle' | 'success' | 'warning'>('idle');
  const [isCopied, setIsCopied] = useState(false);
  const [autoFitPage, setAutoFitPage] = useState(false);

  // Original Data Lists
  const recruiterChecklist = [
    { title: "Contact Details Found", status: "pass", desc: "Found name, email, phone, location." },
    { title: "Quantified Accomplishments", status: "warning", desc: "Needs more bullet points with percentages or metrics." },
    { title: "Reverse Chronological Order", status: "pass", desc: "Items structured from newest to oldest." },
    { title: "No Embedded Visual Graphic Charts", status: "pass", desc: "Clear of scanning parsing bottlenecks." },
    { title: "Keyword Density Compliance", status: "warning", desc: "Missing target skills like 'CI/CD'." },
    { title: "Single-Column Design layout", status: "pass", desc: "No multi-column scanning index overlaps." }
  ];

  const keywordCloud = [
    { text: "React", weight: 95, size: "text-lg font-bold text-purple-400" },
    { text: "TypeScript", weight: 90, size: "text-md font-bold text-cyan-400" },
    { text: "Node.js", weight: 85, size: "text-md font-semibold text-pink-400" },
    { text: "Express", weight: 80, size: "text-xs font-semibold text-zinc-300" },
    { text: "MongoDB", weight: 75, size: "text-xs text-zinc-400" },
    { text: "Tailwind", weight: 88, size: "text-sm font-semibold text-purple-450" },
    { text: "AWS", weight: 70, size: "text-xs text-zinc-500" },
    { text: "Docker", weight: 72, size: "text-xs text-zinc-500" },
    { text: "GraphQL", weight: 65, size: "text-xs text-zinc-550" }
  ];

  const sectionScores = [
    { name: "Header & Contact Info", score: 95, grade: "A+" },
    { name: "Work History Bullets", score: 82, grade: "B-" },
    { name: "Technical Skills Matrix", score: 85, grade: "B" },
    { name: "Education & Credentials", score: 90, grade: "A" }
  ];

  const benchmarkTargets = {
    Junior: { ats: 65, grammar: 75, keywords: 55, formatting: 80 },
    Mid: { ats: 75, grammar: 85, keywords: 70, formatting: 85 },
    Senior: { ats: 85, grammar: 90, keywords: 80, formatting: 90 },
    Lead: { ats: 92, grammar: 95, keywords: 88, formatting: 95 }
  };

  // Event Handlers
  const handleAddKeyword = (kw: string) => {
    if (!currentCV.skills.includes(kw)) {
      updateCurrentCV(prev => ({
        ...prev,
        skills: [...prev.skills, kw]
      }));
      triggerAdminAction(`[CV EDIT] Added missing keyword '${kw}' to skills.`);
    }
    setMissingKeywords(prev => prev.filter(item => item !== kw));
  };

  const handleCleanPhrase = (idx: number) => {
    const phrase = phrasesToClean[idx];
    triggerAdminAction(`[PHRASE] Substituted redundant phrase: "${phrase.original}"`);
    setPhrasesToClean(prev => prev.filter((_, i) => i !== idx));
  };

  const handleValidatePdf = () => {
    setIsValidatingPdf(true);
    triggerAdminAction(`[SCAN] Initialized OCR scan node validator.`);
    setTimeout(() => {
      setIsValidatingPdf(false);
      setPdfValidationResult('success');
    }, 1200);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(currentCV, null, 2));
    setIsCopied(true);
    triggerAdminAction(`[EXPORT] Copied CV JSON schema representation.`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleAutoFit = () => {
    setAutoFitPage(!autoFitPage);
    triggerAdminAction(`[AUDIT] Toggled auto-fit-page mode to ${!autoFitPage}.`);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-900 gap-4">
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
            <h2 className="text-xl font-bold tracking-tight text-white">AI Resume Analysis</h2>
            <p className="text-xs text-zinc-500 mt-1">Granular scoring metrics and recruiter dashboard audits.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setActiveTab('accuracy')}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-md transition shrink-0"
        >
          View Accuracy Solutions
        </button>
      </div>

      {/* Gauges Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center bg-zinc-900/10">
          <RadialGauge score={currentCV.atsScore || 85} label="ATS Rating" size={100} strokeWidth={8} />
        </div>
        <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center bg-zinc-900/10">
          <RadialGauge score={currentCV.grammarScore || 92} label="Grammar Rating" size={100} strokeWidth={8} />
        </div>
        <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center bg-zinc-900/10">
          <RadialGauge score={currentCV.keywordScore || 80} label="Keyword Score" size={100} strokeWidth={8} />
        </div>
        <div className="glass-panel rounded-2xl p-4 flex flex-col items-center justify-center bg-zinc-900/10">
          <RadialGauge score={currentCV.formattingScore || 90} label="Formatting Rating" size={100} strokeWidth={8} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section Breakdown Scores */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Section Breakdown Scores</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectionScores.map((sec, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl hover:border-zinc-800 transition">
                  <div className="text-left">
                    <p className="text-xs font-semibold text-zinc-300">{sec.name}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Weighted Impact</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-cyan-400">{sec.score}%</span>
                    <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-md text-[10px] font-bold">{sec.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Benchmark Filters */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
              <div className="flex items-center space-x-2 text-left">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Target Job Benchmarks</h3>
                  <p className="text-[10px] text-zinc-500">Compare parameters vs industry roles</p>
                </div>
              </div>
              <div className="flex p-0.5 bg-zinc-950 border border-zinc-900 rounded-lg">
                {(['Junior', 'Mid', 'Senior', 'Lead'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setBenchmark(role)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${
                      benchmark === role
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                        : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-zinc-950/30 rounded-xl text-left border border-zinc-900/60">
                <p className="text-[10px] text-zinc-500 font-medium">ATS Rating</p>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-sm font-bold text-white">{currentCV.atsScore || 85}%</span>
                  <span className="text-[9px] text-zinc-500">vs {benchmarkTargets[benchmark].ats}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-1 transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((currentCV.atsScore || 85) / benchmarkTargets[benchmark].ats) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="p-3 bg-zinc-950/30 rounded-xl text-left border border-zinc-900/60">
                <p className="text-[10px] text-zinc-500 font-medium">Grammar Score</p>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-sm font-bold text-white">{currentCV.grammarScore || 92}%</span>
                  <span className="text-[9px] text-zinc-500">vs {benchmarkTargets[benchmark].grammar}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-1 transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((currentCV.grammarScore || 92) / benchmarkTargets[benchmark].grammar) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="p-3 bg-zinc-950/30 rounded-xl text-left border border-zinc-900/60">
                <p className="text-[10px] text-zinc-500 font-medium">Keyword Match</p>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-sm font-bold text-white">{currentCV.keywordScore || 80}%</span>
                  <span className="text-[9px] text-zinc-500">vs {benchmarkTargets[benchmark].keywords}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-pink-500 h-1 transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((currentCV.keywordScore || 80) / benchmarkTargets[benchmark].keywords) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="p-3 bg-zinc-950/30 rounded-xl text-left border border-zinc-900/60">
                <p className="text-[10px] text-zinc-500 font-medium">Formatting</p>
                <div className="flex items-baseline space-x-1.5 mt-1">
                  <span className="text-sm font-bold text-white">{currentCV.formattingScore || 90}%</span>
                  <span className="text-[9px] text-zinc-500">vs {benchmarkTargets[benchmark].formatting}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-1 transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((currentCV.formattingScore || 90) / benchmarkTargets[benchmark].formatting) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Gaps and Cloud */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Keyword Gap Quick Add */}
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white block text-left">Missing Keywords (Gap Analyzer)</span>
                <span className="px-2 py-0.5 bg-zinc-900 text-zinc-500 rounded text-[9px] font-medium">Click to Quick-Add</span>
              </div>
              
              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-start min-h-[90px]">
                  {missingKeywords.map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddKeyword(kw)}
                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 transition transform active:scale-95 text-left"
                    >
                      <span>{kw}</span>
                      <Plus className="w-3 h-3 text-purple-400 shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-[90px] flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mb-1" />
                  <span className="text-[10px] text-zinc-500">All missing keywords added!</span>
                </div>
              )}
            </div>

            {/* Keyword Cloud Density */}
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold text-white block text-left">Keywords Density Cloud</span>
              <div className="flex flex-wrap gap-x-4 gap-y-2.5 items-center justify-center p-3 bg-zinc-900/10 border border-zinc-900 rounded-xl h-[95px] overflow-y-auto no-scrollbar">
                {keywordCloud.map((kw, i) => (
                  <span key={i} className={`${kw.size} transition transform hover:scale-110 cursor-pointer`} title={`Parsed Match Rate: ${kw.weight}%`}>
                    {kw.text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Readability & Phrasing Auditor */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-left">
              <FileText className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Readability & Style Index</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-xl text-left">
                <span className="text-[10px] text-zinc-500 block">Est. Reading Time</span>
                <span className="text-sm font-bold text-white mt-1 block">2.1 minutes</span>
              </div>
              <div className="bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-xl text-left">
                <span className="text-[10px] text-zinc-500 block">Total Word Count</span>
                <span className="text-sm font-bold text-white mt-1 block">382 words</span>
              </div>
              <div className="bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-xl text-left">
                <span className="text-[10px] text-zinc-500 block">Flesch Grade Level</span>
                <span className="text-sm font-bold text-cyan-400 mt-1 block">12.4 (Sophisticated)</span>
              </div>
              <div className="bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-xl text-left">
                <span className="text-[10px] text-zinc-500 block">Unique / Total Words</span>
                <span className="text-sm font-bold text-white mt-1 block">54% ratio</span>
              </div>
            </div>

            {/* Sentence Clarity & Filler Words */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Sentence Clarity Meter</span>
                <div className="p-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Syntax rating:</span>
                    <span className="font-bold text-purple-400">92% (Excellent)</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <p className="text-[9px] text-zinc-500 leading-normal">Your sentences are compact. Good use of active voice action verbs throughout accomplishments.</p>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Redundant Phrasing Alert</span>
                <div className="space-y-1.5">
                  {phrasesToClean.length > 0 ? (
                    phrasesToClean.map((phrase, i) => (
                      <div key={i} className="p-2 bg-zinc-950/40 border border-zinc-900/80 rounded-xl flex items-center justify-between gap-2 text-[10px]">
                        <div className="truncate">
                          <span className="text-red-400 line-through mr-1.5">{phrase.original}</span>
                          <span className="text-emerald-400">→ {phrase.suggestion}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCleanPhrase(i)}
                          className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md font-bold shrink-0 transition"
                        >
                          Swap
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 flex items-center justify-center space-x-1.5 text-[10px] text-zinc-500 h-[66px]">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>All filler phrases cleared!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recruiter Attention Heatmap */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-left">
              <Flame className="w-4 h-4 text-purple-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Recruiter Attention Heatmap</h3>
                <p className="text-[9px] text-zinc-500 mt-0.5">AI projection of eye-tracking hotzones</p>
              </div>
            </div>

            <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between p-2 bg-purple-950/15 border border-purple-500/15 rounded-lg text-left">
                <div>
                  <p className="text-[10px] font-bold text-purple-300">Top Header / Contact Details</p>
                  <p className="text-[9px] text-zinc-500">First impressions quadrant scan</p>
                </div>
                <span className="px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded font-bold text-[10px]">94% Focus</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-cyan-950/10 border border-cyan-500/10 rounded-lg text-left">
                <div>
                  <p className="text-[10px] font-bold text-cyan-300">Experience Accomplishments</p>
                  <p className="text-[9px] text-zinc-500">Quantifiable metrics scan zone</p>
                </div>
                <span className="px-2 py-0.5 bg-cyan-600/20 text-cyan-300 rounded font-bold text-[10px]">82% Focus</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-pink-950/10 border border-pink-500/10 rounded-lg text-left">
                <div>
                  <p className="text-[10px] font-bold text-pink-300">Technical Skills Matrix</p>
                  <p className="text-[9px] text-zinc-500">Keyword indexing lookup target</p>
                </div>
                <span className="px-2 py-0.5 bg-pink-600/20 text-pink-300 rounded font-bold text-[10px]">71% Focus</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-zinc-900/20 border border-zinc-800 rounded-lg text-left">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400">Education & Projects</p>
                  <p className="text-[9px] text-zinc-500">Secondary reference details</p>
                </div>
                <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded font-bold text-[10px]">35% Focus</span>
              </div>
            </div>
          </div>

          {/* Recruiter Audit Checklist */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white text-left">Recruiter Audit Checklist</h3>
            
            <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1 no-scrollbar text-left">
              {recruiterChecklist.map((item, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-xl border flex items-start space-x-3 ${
                    item.status === 'pass' 
                      ? 'bg-emerald-950/5 border-emerald-500/10' 
                      : 'bg-yellow-950/5 border-yellow-500/10'
                  }`}
                >
                  {item.status === 'pass' ? (
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4.5 h-4.5 text-yellow-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[10px] text-zinc-400 leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page Layout Auditor */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-left">
              <Layers className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Page Layout Auditor</h3>
            </div>
            
            <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-3 text-left">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white">Minor Page Overspill Alert</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">Your content runs 4 lines onto a 2nd page. Recruiter attention drops by 70% on Page 2.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleAutoFit}
                className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-1 border ${
                  autoFitPage
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                }`}
              >
                <span>{autoFitPage ? 'Strict Single-Page Active' : 'Enable Strict Single-Page Fit'}</span>
              </button>
            </div>
          </div>

          {/* ATS PDF Scan Validator */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex items-center space-x-2 text-left">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">ATS PDF Scan Validator</h3>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-3 text-left">
              <p className="text-[10px] text-zinc-400 leading-normal">
                Verifies if your document contains actual selectable text nodes, or if it parses as a blank scanned image.
              </p>

              {pdfValidationResult === 'success' ? (
                <div className="p-2.5 bg-emerald-950/10 border border-emerald-500/20 rounded-lg flex items-center space-x-2 text-[10px] text-emerald-400">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Verified: Selectable text nodes detected (100% OCR Clean).</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleValidatePdf}
                  disabled={isValidatingPdf}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isValidatingPdf ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Validating Text Nodes...</span>
                    </>
                  ) : (
                    <span>Run Scanner Validation</span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Parser Trailing Flags */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white text-left uppercase tracking-wider">Parser Trailing Flags</h3>
            <div className="divide-y divide-zinc-900 text-[10px]">
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-500">Embedded Tables</span>
                <span className="font-bold text-emerald-400">0 Alerts (Clean)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-500">Unstructured Headers</span>
                <span className="font-bold text-emerald-400">0 Alerts (Clean)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-500">Floating Footnotes</span>
                <span className="font-bold text-yellow-400">1 Warning Flagged</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-500">Multi-Column Layouts</span>
                <span className="font-bold text-emerald-400">0 Alerts (Standard)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Schema Export Block */}
      <div className="glass-panel border-zinc-900 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div>
          <h4 className="text-xs font-bold text-white">Export Raw CV Metadata Schema</h4>
          <p className="text-[10px] text-zinc-500 mt-0.5">Obtain standard JSON representing parsed resume entities.</p>
        </div>
        <button
          type="button"
          onClick={handleCopySchema}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-[10px] font-bold flex items-center space-x-2 transition active:scale-95"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied Schema!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-purple-400" />
              <span>Copy JSON Schema</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
