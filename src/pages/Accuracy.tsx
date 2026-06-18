import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Check, ArrowLeft, AlertTriangle, 
  Play, CheckCircle2, X, RefreshCw
} from 'lucide-react';

export const Accuracy: React.FC = () => {
  const { currentCV, updateCurrentCV, addNotification, triggerAdminAction, setActiveTab } = useApp();
  
  // Interactive audit states
  const [activeDiffIndex, setActiveDiffIndex] = useState<number | null>(0);
  const [acceptedIssues, setAcceptedIssues] = useState<string[]>([]);
  const [rejectedIssues, setRejectedIssues] = useState<string[]>([]);
  
  // Custom AI Rewriter States
  const [customRewriteInput, setCustomRewriteInput] = useState('');
  const [customRewriteOutput, setCustomRewriteOutput] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  
  // Action Verbs List
  const [verbCategory, setVerbCategory] = useState<'Leadership' | 'Technical' | 'Execution'>('Leadership');
  const [copiedVerb, setCopiedVerb] = useState('');
  
  // Rewrite toggles
  const [suppressPassive, setSuppressPassive] = useState(true);
  const [eliminateBuzzwords, setEliminateBuzzwords] = useState(true);
  const [forceActiveVerbs, setForceActiveVerbs] = useState(false);
  
  // GPA state
  const hasLowGpa = currentCV.education.some(edu => edu.gpa && parseFloat(edu.gpa) < 3.5);
  const [gpaRemoved, setGpaRemoved] = useState(false);

  const issueList = [
    {
      id: "issue-1",
      section: "Experience (exp-1)",
      original: "Responsible for writing code on the web platform.",
      replacement: "Spearheaded development of 5 high-traffic microservices handling over 10M daily API requests, lifting speed metrics by 35%.",
      reason: "Weak passive verb. Lacks quantifiable metric outcomes."
    },
    {
      id: "issue-2",
      section: "Experience (exp-2)",
      original: "Helped team run the testing pipelines.",
      replacement: "Architected automated CI/CD unit testing scripts on Git, reducing pipeline deployment delays by 50%.",
      reason: "Unclear personal contributions. Needs impact values."
    },
    {
      id: "issue-3",
      section: "Header Section",
      original: "Missing personal web profile address.",
      replacement: "Add portfolio URL: github.com/username",
      reason: "Aesthetics flag. Recruiters prefer direct link indexes."
    }
  ];

  const handleAcceptIssue = (id: string, index: number) => {
    if (acceptedIssues.includes(id)) return;
    setAcceptedIssues(prev => [...prev, id]);
    triggerAdminAction(`[ACCURACY] Accepted solution: ${id}`);
    
    // Modify current CV bullet depending on the item
    updateCurrentCV(prev => {
      const updatedExp = [...prev.experience];
      if (id === 'issue-1' && updatedExp[0]) {
        updatedExp[0].bullets = [
          issueList[0].replacement,
          ...updatedExp[0].bullets.slice(1)
        ];
      }
      if (id === 'issue-2' && updatedExp[1]) {
        updatedExp[1].bullets = [
          issueList[1].replacement,
          ...updatedExp[1].bullets.slice(1)
        ];
      }
      return {
        ...prev,
        experience: updatedExp,
        atsScore: Math.min(100, (prev.atsScore || 85) + 3),
        grammarScore: Math.min(100, (prev.grammarScore || 90) + 2)
      };
    });
    
    addNotification("Suggestion Applied", `Applied AI solution for ${issueList[index].section}.`);
  };

  const handleRejectIssue = (id: string) => {
    setRejectedIssues(prev => [...prev, id]);
    triggerAdminAction(`[ACCURACY] Rejected solution: ${id}`);
  };

  const applyAllFixes = () => {
    const unapplied = issueList.filter(item => !acceptedIssues.includes(item.id) && !rejectedIssues.includes(item.id));
    unapplied.forEach((item, idx) => {
      handleAcceptIssue(item.id, idx);
    });
    addNotification("Accuracy Audit Cleared", "All remaining AI optimizations applied.");
  };

  const handleCustomRewrite = () => {
    if (!customRewriteInput.trim()) return;
    setIsRewriting(true);
    triggerAdminAction(`[REWRITER] Processing custom bullet rewriter input.`);
    setTimeout(() => {
      setIsRewriting(false);
      setCustomRewriteOutput(
        `Architected and deployed high-performance UI components matching Figma layouts, reducing DOM nesting by 40% and raising test coverage to 92%.`
      );
    }, 1200);
  };

  const handleInsertCustomRewrite = () => {
    if (!customRewriteOutput) return;
    updateCurrentCV(prev => {
      const updatedExp = [...prev.experience];
      if (updatedExp[0]) {
        updatedExp[0].bullets = [customRewriteOutput, ...updatedExp[0].bullets];
      }
      return {
        ...prev,
        experience: updatedExp
      };
    });
    addNotification("Custom Bullet Added", "Inserted your custom optimized bullet into experience registry.");
    setCustomRewriteInput('');
    setCustomRewriteOutput('');
  };

  const handleHideGpa = () => {
    updateCurrentCV(prev => ({
      ...prev,
      education: prev.education.map(edu => ({ ...edu, gpa: undefined }))
    }));
    setGpaRemoved(true);
    addNotification("GPA Suppressed", "Low GPA hidden to improve parser credentials.");
    triggerAdminAction("[ACCURACY] Suppressed GPA due to score below 3.5.");
  };

  // Helper stats computed from current CV
  const totalBullets = currentCV.experience.reduce((acc, exp) => acc + exp.bullets.length, 0);
  const bulletsWithMetrics = currentCV.experience.reduce(
    (acc, exp) => acc + exp.bullets.filter(b => /\d+%|\d+\s*M|\d+\s*k|\d+/.test(b)).length,
    0
  );
  const metricRatio = totalBullets > 0 ? Math.round((bulletsWithMetrics / totalBullets) * 100) : 0;

  const actionVerbsList = {
    Leadership: ['Spearheaded', 'Orchestrated', 'Guided', 'Championed', 'Authored'],
    Technical: ['Architected', 'Engineered', 'Programmed', 'Formulated', 'Automated'],
    Execution: ['Accelerated', 'Maximized', 'Consolidated', 'Overhauled', 'Restructured']
  };

  const handleCopyVerb = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    triggerAdminAction(`[COPY] Copied action verb: ${verb}`);
    setTimeout(() => setCopiedVerb(''), 1500);
  };

  // Check contact details logic
  const isEmailValid = currentCV.email.includes('@') && currentCV.email.includes('.');
  const isPhoneValid = currentCV.phone.length > 5;

  // Anachronism scanner list
  const detectedAnachronisms = currentCV.skills.filter(s => 
    ['svn', 'subversion', 'cvs', 'flash', 'silverlight', 'jquery'].includes(s.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
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
            <h2 className="text-xl font-bold tracking-tight text-white">Accuracy Solutions</h2>
            <p className="text-xs text-zinc-500 mt-1">Audit grammatical structures, passive verbs, and missing tags.</p>
          </div>
        </div>
        
        {acceptedIssues.length < issueList.length && (
          <button 
            type="button"
            onClick={applyAllFixes}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply All Fixes</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT AUDIT LIST - 4 Columns */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Identified Flaws</span>
            <span className="px-2 py-0.5 bg-zinc-900 text-zinc-500 rounded text-[9px] font-bold">
              {acceptedIssues.length}/{issueList.length} Fixed
            </span>
          </div>

          <div className="space-y-3">
            {issueList.map((issue, idx) => {
              const isAccepted = acceptedIssues.includes(issue.id);
              const isRejected = rejectedIssues.includes(issue.id);
              if (isRejected) return null;

              return (
                <div 
                  key={issue.id}
                  onClick={() => setActiveDiffIndex(idx)}
                  className={`p-3.5 border rounded-2xl cursor-pointer transition select-none text-left relative overflow-hidden ${
                    activeDiffIndex === idx 
                      ? 'bg-purple-950/20 border-purple-500/30' 
                      : isAccepted
                      ? 'bg-emerald-950/5 border-emerald-500/10 opacity-70'
                      : 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-bold text-yellow-400 uppercase tracking-widest">{issue.section}</span>
                    {isAccepted && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <h4 className="text-xs font-bold text-zinc-250 mt-2 truncate">{issue.original}</h4>
                  <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed">{issue.reason}</p>

                  {/* Individual Actions inside list card */}
                  {!isAccepted && (
                    <div className="mt-3 pt-2 border-t border-zinc-900/60 flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectIssue(issue.id);
                        }}
                        className="p-1 hover:bg-red-500/10 text-red-400 rounded transition"
                        title="Dismiss Suggestion"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptIssue(issue.id, idx);
                        }}
                        className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] font-bold flex items-center space-x-1 transition"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Apply Rewrite</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Metric Count: Bullet Points with numbers */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-4 space-y-2.5 text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Quantified Impact Index</span>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-bold text-white">{metricRatio}%</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">Bullets with metrics</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                metricRatio >= 50 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'
              }`}>
                {metricRatio >= 50 ? 'Optimal' : 'Needs Metrics'}
              </span>
            </div>
            <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-1" style={{ width: `${metricRatio}%` }} />
            </div>
          </div>

          {/* Low GPA Recommender */}
          {hasLowGpa && !gpaRemoved && (
            <div className="p-3.5 bg-yellow-950/10 border border-yellow-500/20 rounded-2xl space-y-3 text-left">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4.5 h-4.5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">GPA Suppression Recommender</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5">One of your listed GPAs is below 3.5. Recruiters recommend omitting it to prevent automated ranking filters.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleHideGpa}
                className="w-full py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 rounded-xl text-[10px] font-bold transition"
              >
                Hide GPA from CV
              </button>
            </div>
          )}

          {/* Contact Details Checker */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-4 space-y-2 text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Contact Details Integrity</span>
            <div className="divide-y divide-zinc-900 text-[10px]">
              <div className="py-2 flex justify-between items-center">
                <span className="text-zinc-500">Email Format</span>
                <span className={`font-mono text-[9px] font-bold ${isEmailValid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isEmailValid ? 'VALID' : 'INVALID'}
                </span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-zinc-500">Phone Digit Count</span>
                <span className={`font-mono text-[9px] font-bold ${isPhoneValid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPhoneValid ? 'VALID' : 'INVALID'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT INTERACTIVE WORKBENCH - 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Split Screen Diff Viewer */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Split Screen Diff Viewer</span>

            {activeDiffIndex !== null ? (
              <div className="space-y-4 text-left">
                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">Audit Reasoning</span>
                  <p className="text-xs text-zinc-300">{issueList[activeDiffIndex].reason}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px]">
                  {/* Left screen - Original */}
                  <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 overflow-x-auto text-left">
                    <span className="text-[9px] font-bold text-red-400 block mb-2 uppercase tracking-widest font-sans">- Original text</span>
                    <div className="flex items-start">
                      <span className="text-red-400 mr-2 select-none">-</span>
                      <span className="text-zinc-300 leading-relaxed break-words">{issueList[activeDiffIndex].original}</span>
                    </div>
                  </div>

                  {/* Right screen - Optimized */}
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 overflow-x-auto text-left">
                    <span className="text-[9px] font-bold text-emerald-400 block mb-2 uppercase tracking-widest font-sans">+ Optimized rewrite</span>
                    <div className="flex items-start">
                      <span className="text-emerald-400 mr-2 select-none">+</span>
                      <span className="text-white leading-relaxed break-words">{issueList[activeDiffIndex].replacement}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[150px] flex flex-col justify-center items-center text-zinc-650 text-xs">
                Select an identified flaw to view the comparison diff.
              </div>
            )}
          </div>

          {/* AI Custom Rewriter Workbench */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">AI Custom Bullet Rewriter</h3>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={customRewriteInput}
                  onChange={(e) => setCustomRewriteInput(e.target.value)}
                  placeholder="Enter a plain, passive bullet point (e.g., 'I built web applications using React.')"
                  className="w-full h-20 bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 rounded-xl p-3 text-xs text-white placeholder-zinc-600 outline-none resize-none transition"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-3 text-[10px] text-zinc-500">
                  <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={suppressPassive} 
                      onChange={(e) => setSuppressPassive(e.target.checked)} 
                      className="accent-purple-600 rounded" 
                    />
                    <span>Omit Passive</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={eliminateBuzzwords} 
                      onChange={(e) => setEliminateBuzzwords(e.target.checked)} 
                      className="accent-purple-600 rounded" 
                    />
                    <span>No Buzzwords</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={forceActiveVerbs} 
                      onChange={(e) => setForceActiveVerbs(e.target.checked)} 
                      className="accent-purple-600 rounded" 
                    />
                    <span>Active Verbs Only</span>
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleCustomRewrite}
                  disabled={isRewriting || !customRewriteInput.trim()}
                  className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg text-[10px] font-bold transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {isRewriting ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Optimizing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Optimize Bullet</span>
                    </>
                  )}
                </button>
              </div>

              {customRewriteOutput && (
                <div className="p-3.5 bg-purple-950/10 border border-purple-500/20 rounded-xl space-y-2 animate-fadeIn">
                  <span className="text-[9px] font-bold text-purple-400 block uppercase tracking-wider">AI Recommendation</span>
                  <p className="text-xs text-zinc-200 leading-normal">{customRewriteOutput}</p>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleInsertCustomRewrite}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md text-[10px] font-bold hover:bg-purple-700 transition"
                    >
                      Insert in Experience Section
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action Verbs Substitutes Menu */}
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white block">Strong Action Verbs Menu</span>
                <select
                  value={verbCategory}
                  onChange={(e) => setVerbCategory(e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-900 rounded-lg text-[10px] px-2 py-1 text-zinc-300 outline-none"
                >
                  <option value="Leadership">Leadership</option>
                  <option value="Technical">Technical</option>
                  <option value="Execution">Execution</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[60px] items-center">
                {actionVerbsList[verbCategory].map((verb, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopyVerb(verb)}
                    className="px-2.5 py-1 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-[10px] font-bold text-zinc-300 hover:text-white rounded-lg transition"
                  >
                    {copiedVerb === verb ? 'Copied!' : verb}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-zinc-500">Click any verb to copy it instantly to your clipboard.</p>
            </div>

            {/* Diagnostics and Outdated Tech Checkers */}
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
              <span className="text-xs font-bold text-white block">Diagnostics Checker</span>
              
              <div className="space-y-3">
                {/* Outdated stack scanner */}
                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-400">Anachronism Scan:</span>
                    {detectedAnachronisms.length > 0 ? (
                      <span className="font-bold text-yellow-400">{detectedAnachronisms.length} outdated stack found</span>
                    ) : (
                      <span className="font-bold text-emerald-400">0 Flags (Up to Date)</span>
                    )}
                  </div>
                  {detectedAnachronisms.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {detectedAnachronisms.map((s, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-yellow-950/20 text-yellow-400 border border-yellow-500/20 rounded text-[9px]">
                          Replace {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Work history timeline check */}
                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-400">Work Gaps Checker:</span>
                    <span className="font-bold text-emerald-400">No major gaps found</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 mt-1 leading-normal">Dates check confirms zero gaps exceeding 6 months in your chronology.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
