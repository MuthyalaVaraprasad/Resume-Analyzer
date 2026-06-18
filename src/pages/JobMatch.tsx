import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RadialGauge } from '../components/CustomCharts';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export const JobMatch: React.FC = () => {
  const { addNotification, triggerAdminAction, setActiveTab } = useApp();
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const runAnalysis = () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setMatchScore(null);
    triggerAdminAction("[AI] Triggered Job Match scan comparisons.");

    setTimeout(() => {
      setIsAnalyzing(false);
      const randomScore = Math.floor(Math.random() * 15) + 78; // Score 78 to 92
      setMatchScore(randomScore);
      addNotification("Job Match Scan Completed", `Job match score calculated: ${randomScore}%.`);
    }, 1500);
  };

  const sampleJD = () => {
    setJdText("We are looking for a Senior Software Engineer with strong experience building scalable web apps. Required skills: React, TypeScript, Node.js, Express, Docker, Kubernetes, and CI/CD pipelines. Experience deploying on AWS and handling microservices architectures is a huge plus.");
  };

  return (
    <div className="space-y-6 select-none">
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
            <h2 className="text-xl font-bold tracking-tight text-white">Job Match Analyzer</h2>
            <p className="text-xs text-zinc-500 mt-1">Audit compliance weights and skills gaps against target postings.</p>
          </div>
        </div>
        <button 
          onClick={sampleJD}
          className="text-xs text-purple-400 hover:text-purple-300 font-bold"
        >
          Load Sample JD
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* JD Paste box */}
        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/40">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Target Job Description</span>
          
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste target job requirement description details..."
            rows={10} 
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl p-3 text-xs focus:border-purple-500 outline-none resize-none leading-relaxed text-zinc-200" 
          />

          <button
            onClick={runAnalysis}
            disabled={isAnalyzing || !jdText.trim()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 active:scale-95"
          >
            {isAnalyzing ? "Comparing Resume Skills..." : "Analyze Match Rating"}
          </button>
        </div>

        {/* Audit outputs */}
        <div className="lg:col-span-5 space-y-4">
          {isAnalyzing && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-bold">Scanning keyword matrices...</p>
            </div>
          )}

          {!isAnalyzing && matchScore === null && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-8 text-center text-zinc-650 text-xs py-16">
              Paste a job description on the left and click analyze to output keywords audit.
            </div>
          )}

          {!isAnalyzing && matchScore !== null && (
            <div className="space-y-4 animate-float">
              {/* Score card */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                <RadialGauge score={matchScore} label="Job Match Score" gradientColors={["#06b6d4", "#22d3ee"]} />
                <h4 className="text-sm font-bold text-white mt-4">Hiring Probability is High</h4>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[200px]">Profile matches core requirements of target posting.</p>
              </div>

              {/* Skills checklist */}
              <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Keywords Gaps Audit</span>
                
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-emerald-950/10 border border-emerald-500/10 rounded-xl flex items-center space-x-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Matched skills: React, TypeScript, Node.js, Express, MongoDB</span>
                  </div>
                  
                  <div className="p-2.5 bg-yellow-950/10 border border-yellow-500/10 rounded-xl flex items-center space-x-2 text-yellow-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Missing skills: Kubernetes, Docker, AWS Architectures</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
