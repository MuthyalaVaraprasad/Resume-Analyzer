import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Map, Award, Calendar, BarChart3, Building, Compass, 
  DollarSign, ArrowLeft, Clock, Check, Copy
} from 'lucide-react';

/* ==========================================
   1. SalaryPredictor
   ========================================== */
export const SalaryPredictor: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [location, setLocation] = useState('San Francisco, CA');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [costOfLiving, setCostOfLiving] = useState(1.4); // Multiplier
  const [inflationRate, setInflationRate] = useState(3); // %
  const [bonusToggle, setBonusToggle] = useState(true);
  const [prediction, setPrediction] = useState<{ min: number; max: number; median: number } | null>({
    min: 110000,
    max: 165000,
    median: 137500
  });
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const exchangeRates = { USD: 1, EUR: 0.92, GBP: 0.78 };
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£' };

  const calculateSalary = () => {
    const factor = jobTitle.length + location.length;
    const base = (90000 + (factor % 5) * 20000) * costOfLiving * (1 + inflationRate / 100);
    setPrediction({
      min: base,
      max: base * 1.4 + (bonusToggle ? 25000 : 0),
      median: base * 1.2 + (bonusToggle ? 10000 : 0)
    });
    triggerAdminAction(`[SALARY] Calculated predictions for ${jobTitle} in ${location}.`);
  };

  const getVal = (val: number) => {
    return Math.round(val * exchangeRates[currency]).toLocaleString();
  };

  const negotiationText = `Dear Hiring Team,\n\nThank you for the offer for the ${jobTitle} position. I am thrilled about the opportunity to join the organization and contribute to engineering milestones.\n\nGiven my experience in frontend architectures and high-density performance engineering, I would like to negotiate the base salary to ${currencySymbols[currency]}${getVal(prediction?.median || 135000)}, which aligns with cost-of-living adjustments for ${location}.\n\nBest regards,\n[Your Name]`;

  const handleCopyNegotiation = () => {
    navigator.clipboard.writeText(negotiationText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span>Salary Predictor & Negotiator</span>
          </h2>
          <p className="text-xs text-zinc-500">Calculate salary ranges and get negotiation email templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Search Parameters</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500">Job Title</label>
              <input 
                type="text" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs text-white outline-none focus:border-purple-500 mt-1" 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500">Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs text-white outline-none focus:border-purple-500 mt-1" 
              />
            </div>

            {/* Cost of Living Select */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500">Cost of Living Area Weight</label>
              <select
                value={costOfLiving}
                onChange={(e) => setCostOfLiving(Number(e.target.value))}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-350 outline-none mt-1"
              >
                <option value="1.5">San Francisco / NYC (1.5x weight)</option>
                <option value="1.2">Austin / Seattle (1.2x weight)</option>
                <option value="1.0">Chicago / Standard Hubs (1.0x weight)</option>
                <option value="0.8">Remote / Low COL Hub (0.8x weight)</option>
              </select>
            </div>

            {/* Inflation slider */}
            <div>
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-500 uppercase font-bold">Inflation Adjuster</span>
                <span className="text-purple-400 font-bold font-mono">{inflationRate}%</span>
              </div>
              <input 
                type="range" min="0" max="10" value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full accent-purple-600 bg-zinc-900 h-1.5 rounded-full mt-1.5"
              />
            </div>

            {/* Bonus toggle */}
            <div className="flex justify-between items-center py-1.5 text-zinc-400">
              <span>Include signing bonus & equity</span>
              <input 
                type="checkbox" checked={bonusToggle} 
                onChange={(e) => setBonusToggle(e.target.checked)} 
                className="accent-purple-500 rounded" 
              />
            </div>

            {/* Currency selector tabs */}
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Currency Output</label>
              <div className="grid grid-cols-3 gap-2">
                {(['USD', 'EUR', 'GBP'] as const).map(curr => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`py-1 rounded-lg border font-bold text-[10px] transition ${
                      currency === curr 
                        ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={calculateSalary} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition">
              Calculate Salary Predictions
            </button>
          </div>
        </div>

        {prediction && (
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Estimated Annual Range</h3>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] uppercase font-bold text-zinc-500">Min</span>
                  <p className="text-md font-bold text-white mt-1">{currencySymbols[currency]}{getVal(prediction.min)}</p>
                </div>
                <div className="bg-purple-950/20 p-3 rounded-xl border border-purple-500/20">
                  <span className="text-[9px] uppercase font-bold text-purple-400">Median</span>
                  <p className="text-md font-bold text-purple-400 mt-1">{currencySymbols[currency]}{getVal(prediction.median)}</p>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] uppercase font-bold text-zinc-500">Max</span>
                  <p className="text-md font-bold text-white mt-1">{currencySymbols[currency]}{getVal(prediction.max)}</p>
                </div>
              </div>
            </div>

            {/* Negotiation Templates */}
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Negotiation Email Draft</h3>
                <button
                  onClick={handleCopyNegotiation}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-[9px] font-bold flex items-center space-x-1.5 transition active:scale-95"
                >
                  {copiedTemplate ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTemplate ? 'Copied!' : 'Copy Draft'}</span>
                </button>
              </div>
              <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-900 font-mono text-[9px] text-zinc-400 whitespace-pre-wrap leading-relaxed">
                {negotiationText}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================
   2. SkillRoadmap
   ========================================== */
export const SkillRoadmap: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [selectedTarget, setSelectedTarget] = useState('Staff Engineer');
  const [timeframe, setTimeframe] = useState<'3 Months' | '6 Months' | '12 Months'>('6 Months');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const roadmapSteps = {
    'Staff Engineer': [
      { title: "System Design & Architecture", desc: "Learn distributed caches, message queues (Kafka), database partitioning.", duration: "Phase 1" },
      { title: "Infrastructure & Platform Ops", desc: "Gain hands-on proficiency in Docker orchestration, Kubernetes deployments, and AWS architecture.", duration: "Phase 2" },
      { title: "Engineering Leadership", desc: "Spearhead cross-functional product alignments, lead unit-testing automation structures.", duration: "Phase 3" }
    ],
    'Solutions Architect': [
      { title: "Cloud Strategy & FinOps", desc: "Evaluate cloud spending workloads and map multi-region redundancies.", duration: "Phase 1" },
      { title: "Security Protocols & IAM Policies", desc: "Configure SSL sandboxes, network firewalls, and active directories authorization policies.", duration: "Phase 2" },
      { title: "High-Availability Integration", desc: "Deploy load balancers and CDNs (Cloudflare/Cloudfront) for assets distribution.", duration: "Phase 3" }
    ],
    'Engineering Manager': [
      { title: "People Management & HR logs", desc: "Run high-fidelity interviews audits and manage junior developer career roadmaps.", duration: "Phase 1" },
      { title: "Agile Scrums & Deliveries", desc: "Optimize sprint workflows velocities and eliminate pipeline roadblocks.", duration: "Phase 2" },
      { title: "Technical Project Scopes", desc: "Define functional requirements specifications and system schemas specifications.", duration: "Phase 3" }
    ],
    'VP of Technology': [
      { title: "Executive Tech Alignment", desc: "Coordinate engineering budgets and target core corporate strategies.", duration: "Phase 1" },
      { title: "Organizational Structures", desc: "Design scaling engineering teams nodes and coordinate directories.", duration: "Phase 2" },
      { title: "Vendor & Stack Selection", desc: "Choose database layers and software license models to minimize ARR expenses.", duration: "Phase 3" }
    ]
  };

  const handleToggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(prev => prev.filter(i => i !== idx));
    } else {
      setCompletedSteps(prev => [...prev, idx]);
      triggerAdminAction(`[ROADMAP] Finished step ${idx + 1} for ${selectedTarget}.`);
    }
  };

  const activeSteps = roadmapSteps[selectedTarget as keyof typeof roadmapSteps] || roadmapSteps['Staff Engineer'];

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-cyan-400" />
            <span>Skill Gap Roadmap</span>
          </h2>
          <p className="text-xs text-zinc-500">Acquire core technical and leadership milestones for your career goals.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Target Career Destination</label>
            <select 
              value={selectedTarget} 
              onChange={(e) => {
                setSelectedTarget(e.target.value);
                setCompletedSteps([]);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2.5 outline-none text-zinc-300"
            >
              <option>Staff Engineer</option>
              <option>Solutions Architect</option>
              <option>Engineering Manager</option>
              <option>VP of Technology</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Roadmap Time Horizon</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2.5 outline-none text-zinc-300"
            >
              <option>3 Months</option>
              <option>6 Months</option>
              <option>12 Months</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {activeSteps.map((step, idx) => {
            const isCompleted = completedSteps.includes(idx);
            return (
              <div 
                key={idx} 
                onClick={() => handleToggleStep(idx)}
                className={`p-4 border rounded-2xl flex items-start space-x-4 transition cursor-pointer select-none ${
                  isCompleted 
                    ? 'bg-emerald-950/10 border-emerald-500/20 opacity-70'
                    : 'bg-zinc-900/20 border-zinc-900 hover:border-cyan-500/20'
                }`}
              >
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
                }`}>
                  {isCompleted ? '✓' : `0${idx + 1}`}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className={`text-xs font-bold ${isCompleted ? 'text-zinc-500 line-through' : 'text-white'}`}>{step.title}</h4>
                    <span className="text-[9px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">
                      {timeframe === '3 Months' ? 'Month ' + (idx + 1) : timeframe === '12 Months' ? 'Months ' + (idx * 4 + 1) + '-' + (idx * 4 + 4) : step.duration}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone checklist counters */}
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono border-t border-zinc-900 pt-4">
          <span>Completion: {completedSteps.length} of {activeSteps.length} phases</span>
          <span className="text-cyan-400 font-bold">{Math.round((completedSteps.length / activeSteps.length) * 100)}% Done</span>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   3. InterviewQuestions
   ========================================== */
export const InterviewQuestions: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questions, setQuestions] = useState<Record<'Easy' | 'Medium' | 'Hard', string[]>>({
    Easy: [
      "Explain the differences between CSS grid and flex layout modules.",
      "How does localStorage differ from session storage parameters?",
      "What is semantic HTML and why is it important for SEO audits?"
    ],
    Medium: [
      "How do you approach scaling a database when you experience sudden spikes in traffic?",
      "Describe a time when you had to resolve high-friction architectural debates in an engineering team.",
      "Explain the security configurations you set when designing cloud-based APIs."
    ],
    Hard: [
      "Explain the memory heap optimizations used when garbage collecting on Node backend worker clusters.",
      "How would you architect a real-time collaborative whiteboarding canvas sync schema using WebSockets?",
      "Design a multi-region distributed load-balancing proxy configuration for 100M RPM."
    ]
  });
  const [newQuestion, setNewQuestion] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  // Stopwatch state
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions(prev => ({
      ...prev,
      [difficulty]: [...prev[difficulty], newQuestion.trim()]
    }));
    setNewQuestion('');
    triggerAdminAction(`[INTERVIEW] Added custom question in ${difficulty} category.`);
  };

  const handleSaveNote = (val: string) => {
    if (selectedIdx === null) return;
    const key = `${difficulty}-${selectedIdx}`;
    setNotes(prev => ({ ...prev, [key]: val }));
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeQuestionsList = questions[difficulty];

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-pink-400" />
            <span>Interview Questions Generator</span>
          </h2>
          <p className="text-xs text-zinc-500">Predict custom interview technical challenges.</p>
        </div>
      </div>

      {/* Difficulty Tabs & Timer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-950 p-3 border border-zinc-900 rounded-2xl">
        <div className="flex space-x-2">
          {(['Easy', 'Medium', 'Hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => {
                setDifficulty(diff);
                setSelectedIdx(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition uppercase ${
                difficulty === diff
                  ? 'bg-pink-600/20 text-pink-300 border border-pink-500/30'
                  : 'text-zinc-500 hover:text-zinc-350 border border-transparent'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Practice Timer */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-zinc-500 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>Practice Timer:</span>
          </span>
          <span className="font-mono text-sm font-bold text-white">{formatTime(time)}</span>
          <button
            onClick={() => setTimerActive(!timerActive)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
              timerActive ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {timerActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => {
              setTime(0);
              setTimerActive(false);
            }}
            className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 rounded hover:text-white"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 bg-zinc-950/20">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Question Bank ({difficulty})</h3>
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 no-scrollbar">
              {activeQuestionsList.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`p-3 border rounded-xl cursor-pointer transition text-left ${
                    selectedIdx === idx
                      ? 'bg-pink-950/20 border-pink-500/30'
                      : 'bg-zinc-900/30 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <p className="text-[10px] text-zinc-300 font-bold leading-normal truncate">{q}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add custom question */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Inject Custom Challenge</h3>
            <textarea 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Paste a custom question..."
              rows={2}
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-pink-500"
            />
            <button onClick={addQuestion} className="w-full py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition">
              Add Question
            </button>
          </div>
        </div>

        {/* Selected question practice details */}
        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          {selectedIdx !== null && activeQuestionsList[selectedIdx] ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-xl text-left">
                <span className="text-[8px] uppercase font-bold text-pink-400 font-mono tracking-widest block mb-1">Active Question Challenge</span>
                <p className="text-xs font-bold text-white leading-relaxed">{activeQuestionsList[selectedIdx]}</p>
              </div>

              {/* Sandbox draft notes */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Sandbox Answer Notes Draft</span>
                <textarea
                  value={notes[`${difficulty}-${selectedIdx}`] || ''}
                  onChange={(e) => handleSaveNote(e.target.value)}
                  placeholder="Draft your bullet responses (Star method: Situation, Task, Action, Result)..."
                  rows={8}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-pink-500 resize-none font-sans"
                />
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-zinc-600 text-xs">
              Select a question from the left bank to practice.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   4. CareerTimeline
   ========================================== */
export const CareerTimeline: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [milestones, setMilestones] = useState([
    { year: "2026", role: "Lead Full-Stack Developer", company: "CloudVibe Solutions", desc: "Deploy React 19 architecture to production." },
    { year: "2028", role: "Principal System Architect", company: "NextGen Enterprise", desc: "Oversee complete migrations of multi-cloud architectures." },
    { year: "2030", role: "VP of Software Engineering", company: "CoreSaaS Global", desc: "Lead team directories of 50+ engineers globally." }
  ]);
  const [yearInput, setYearInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [descInput, setDescInput] = useState('');

  const [pivotSelect, setPivotSelect] = useState('Default Route');

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yearInput || !roleInput || !companyInput) return;
    const newM = { year: yearInput, role: roleInput, company: companyInput, desc: descInput };
    setMilestones(prev => [...prev, newM].sort((a, b) => Number(a.year) - Number(b.year)));
    setYearInput('');
    setRoleInput('');
    setCompanyInput('');
    setDescInput('');
    triggerAdminAction(`[TIMELINE] Appended milestone for ${yearInput}.`);
  };

  const handlePivotSimulation = (pivot: string) => {
    setPivotSelect(pivot);
    triggerAdminAction(`[TIMELINE] Pivoted career timeline simulation: ${pivot}`);
    if (pivot === 'AI Engineering') {
      setMilestones([
        { year: "2026", role: "AI Integration Lead", company: "CloudVibe Solutions", desc: "Deploy automated RAG agent pipelines." },
        { year: "2028", role: "LLM Systems Specialist", company: "NeuroCore Tech", desc: "Refine vector embedding lookups at scale." },
        { year: "2030", role: "VP of AI Systems", company: "CognitiveSaaS", desc: "Orchestrate next-gen model training cycles." }
      ]);
    } else if (pivot === 'Management') {
      setMilestones([
        { year: "2026", role: "Engineering Team Lead", company: "CloudVibe Solutions", desc: "Coordinate scrums and manage sprint velocities." },
        { year: "2028", role: "Director of Software Engineering", company: "NextGen SaaS", desc: "Orchestrate staffing plans for 3 product squads." },
        { year: "2030", role: "VP of Technology", company: "GlobalScale Corp", desc: "Define functional product scopes and resource margins." }
      ]);
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
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Interactive Career Timeline</span>
          </h2>
          <p className="text-xs text-zinc-500">Plan and visualize your long-term career growth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Planner Inputs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 bg-zinc-950/20 text-left">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Timeline Pivots Simulator</span>
            <select
              value={pivotSelect}
              onChange={(e) => handlePivotSimulation(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2.5 text-zinc-350 outline-none mt-1"
            >
              <option value="Default Route">Default Software Engineering Route</option>
              <option value="AI Engineering">Pivot to AI & LLM Systems</option>
              <option value="Management">Pivot to Leadership & Management</option>
            </select>
          </div>

          <form onSubmit={handleAddMilestone} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Add Timeline Target</span>
            
            <div className="space-y-2 text-xs">
              <input
                type="text" placeholder="Year (e.g. 2027)" value={yearInput}
                onChange={(e) => setYearInput(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-emerald-500"
              />
              <input
                type="text" placeholder="Target Role" value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-emerald-500"
              />
              <input
                type="text" placeholder="Target Company" value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-emerald-500"
              />
              <textarea
                placeholder="Description of outcomes" value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <button type="submit" className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition">
              Inject Milestone
            </button>
          </form>
        </div>

        {/* Timeline Visualization */}
        <div className="lg:col-span-8 glass-panel border-zinc-900 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 bottom-0 left-12 sm:left-1/2 -translate-x-1/2 w-[2px] bg-zinc-900" />

          <div className="space-y-8 relative w-full pr-4 pl-16 sm:pl-0 sm:max-w-xl">
            {milestones.map((m, idx) => {
              return (
                <div key={idx} className={`flex w-full items-center justify-between flex-row sm:flex-row sm:even:flex-row-reverse`}>
                  <div className="hidden sm:block w-[45%]" />
                  <div className="absolute left-12 sm:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-[10px] font-mono font-bold text-emerald-400 z-10">
                    {idx + 1}
                  </div>
                  <div className="w-full sm:w-[45%] glass-panel border-zinc-900 rounded-2xl p-4 bg-zinc-950/20 hover:border-emerald-500/20 transition text-left">
                    <span className="text-[9px] font-bold text-emerald-400 font-mono">{m.year}</span>
                    <h4 className="text-xs font-bold text-white">{m.role}</h4>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest">{m.company}</p>
                    <p className="text-[10px] text-zinc-400 leading-relaxed mt-1">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   5. ScoreBenchmarks
   ========================================== */
export const ScoreBenchmarks: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [sector, setSector] = useState<'Big Tech' | 'Finance' | 'Startups'>('Big Tech');

  // Simulated benchmark values based on selected sector
  const statsBySector = {
    'Big Tech': [
      { category: "ATS Compliance", userScore: 88, industryAvg: 78, status: "Ideal" },
      { category: "Keyword Matches", userScore: 85, industryAvg: 80, status: "Ideal" },
      { category: "Grammar & Syntax", userScore: 92, industryAvg: 85, status: "Ideal" },
      { category: "Style Formatting", userScore: 90, industryAvg: 88, status: "Ideal" }
    ],
    'Finance': [
      { category: "ATS Compliance", userScore: 88, industryAvg: 85, status: "Matched" },
      { category: "Keyword Matches", userScore: 85, industryAvg: 72, status: "Ideal" },
      { category: "Grammar & Syntax", userScore: 92, industryAvg: 90, status: "Ideal" },
      { category: "Style Formatting", userScore: 90, industryAvg: 94, status: "Weak" }
    ],
    'Startups': [
      { category: "ATS Compliance", userScore: 88, industryAvg: 62, status: "Ideal" },
      { category: "Keyword Matches", userScore: 85, industryAvg: 60, status: "Ideal" },
      { category: "Grammar & Syntax", userScore: 92, industryAvg: 75, status: "Ideal" },
      { category: "Style Formatting", userScore: 90, industryAvg: 70, status: "Ideal" }
    ]
  };

  const handleSectorChange = (sec: any) => {
    setSector(sec);
    triggerAdminAction(`[BENCHMARK] Switched comparison sector standard to: ${sec}`);
  };

  const activeStats = statsBySector[sector];

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <span>Industry Score Benchmarks</span>
          </h2>
          <p className="text-xs text-zinc-500">Benchmark your parameters against recruiter standards.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Resume Metrics vs. Global Standards</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">Compare parameters across sectors</p>
          </div>

          <div className="flex p-0.5 bg-zinc-950 border border-zinc-900 rounded-lg text-[10px]">
            {(['Big Tech', 'Finance', 'Startups'] as const).map(sec => (
              <button
                key={sec}
                onClick={() => handleSectorChange(sec)}
                className={`px-3 py-1 font-bold rounded transition ${
                  sector === sec 
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'text-zinc-550 border border-transparent'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 text-xs">
          {activeStats.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300">{item.category}</span>
                <span className="font-mono text-[10px] text-zinc-500">
                  Your Score: <b className="text-yellow-400">{item.userScore}%</b> vs Avg: <b>{item.industryAvg}%</b>
                  <span className={`ml-2 px-1.5 py-0.2 rounded font-bold uppercase text-[8px] ${
                    item.status === 'Ideal' ? 'bg-emerald-500/10 text-emerald-400' :
                    item.status === 'Matched' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {item.status}
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-850">
                <div 
                  style={{ width: `${item.userScore}%` }} 
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full absolute z-10 transition-all duration-500" 
                />
                <div 
                  style={{ width: `${item.industryAvg}%` }} 
                  className="h-full bg-zinc-800 rounded-full absolute border-r border-white/40 transition-all duration-500" 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Priority Suggestion Badge */}
        <div className="p-3 bg-yellow-950/10 border border-yellow-500/10 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-yellow-400 uppercase font-mono">Gap analysis recommendation</p>
            <p className="text-[10px] text-zinc-400 mt-1">
              {sector === 'Finance' 
                ? 'Your resume formatting requires strict classical PDF nodes. Swapping template to Corporate Layout.' 
                : 'Improve ATS compliance matches. Integrate more DevOps tags like CI/CD pipelines to exceed standards.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   6. TargetCompanies
   ========================================== */
export const TargetCompanies: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [tier, setTier] = useState<'All' | 'FAANG' | 'Finance'>('All');
  const [companies, setCompanies] = useState([
    { name: "Google", role: "Software Engineer", match: 88, status: "Active Application", tier: "FAANG", deadline: "2026-07-15" },
    { name: "Stripe", role: "Staff Frontend Developer", match: 92, status: "Interview Scheduled", tier: "Finance", deadline: "2026-06-30" },
    { name: "Meta", role: "Senior Engineer", match: 81, status: "Applied", tier: "FAANG", deadline: "2026-08-01" },
    { name: "Goldman Sachs", role: "VP Architect", match: 78, status: "Prospect", tier: "Finance", deadline: "2026-07-20" }
  ]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newMatch, setNewMatch] = useState(85);

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRole) return;
    const newComp = {
      name: newName,
      role: newRole,
      match: newMatch,
      status: "Added Prospect",
      tier: "All",
      deadline: "2026-12-31"
    };
    setCompanies(prev => [newComp, ...prev]);
    setNewName('');
    setNewRole('');
    triggerAdminAction(`[COMPANY] Inserted target pipeline company: ${newName}`);
  };

  const activeCompanies = tier === 'All' ? companies : companies.filter(c => c.tier === tier);

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-400" />
            <span>Target Companies Explorer</span>
          </h2>
          <p className="text-xs text-zinc-500">Match credentials directly against hiring values of targeted firms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Adder panel */}
        <div className="lg:col-span-4 space-y-4">
          <form onSubmit={handleAddCompany} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Add Target Pipeline</span>
            <div className="space-y-2 text-xs">
              <input
                type="text" placeholder="Company Name" value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-blue-500"
              />
              <input
                type="text" placeholder="Target Role" value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-blue-500"
              />
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold">
                  <span>Match rating</span>
                  <span className="text-blue-400 font-bold font-mono">{newMatch}%</span>
                </div>
                <input
                  type="range" min="50" max="100" value={newMatch}
                  onChange={(e) => setNewMatch(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-zinc-900 h-1.5 rounded-full"
                />
              </div>
            </div>
            <button type="submit" className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition">
              Inject Company
            </button>
          </form>
        </div>

        {/* List of target companies */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tier filters tabs */}
          <div className="flex justify-between items-center bg-zinc-950 p-2.5 border border-zinc-900 rounded-xl">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sector Tiers:</span>
            <div className="flex space-x-2 text-[10px]">
              {(['All', 'FAANG', 'Finance'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`px-3 py-1 font-bold rounded-md transition ${
                    tier === t 
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : 'text-zinc-550 border border-transparent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeCompanies.map((c, i) => (
              <div key={i} className="p-4 bg-zinc-900/20 border border-zinc-900 hover:border-blue-500/20 rounded-2xl space-y-3 relative overflow-hidden text-left transition">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white">{c.name}</h4>
                  <span className="text-[10px] font-bold font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{c.match}% Fit</span>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-semibold">{c.role}</p>
                  <p className="text-[9px] text-zinc-500 mt-1 font-mono">{c.status}</p>
                </div>
                <div className="pt-2 border-t border-zinc-900/60 flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>Deadline:</span>
                  <span>{c.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   7. HiringTrends
   ========================================== */
export const HiringTrends: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [growthMode, setGrowthMode] = useState(25); // simulated slider %
  const [remoteRatio, setRemoteRatio] = useState(64); // %

  const trendingSkills = [
    { skill: "React 19 & NextJS", rate: "+38% YoY Demand", color: "text-purple-400" },
    { skill: "Go & High-Concurrency APIs", rate: "+29% YoY Demand", color: "text-cyan-400" },
    { skill: "LLM Agents Architecture", rate: "+82% YoY Demand", color: "text-pink-400" }
  ];

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-400" />
            <span>Hiring Trends Explorer</span>
          </h2>
          <p className="text-xs text-zinc-500">Real-time mock analytics of developer hiring trends globally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left adjusters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Growth Projections</h3>
            
            {/* Projected market growth slider */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold">
                <span>Expected Sector Hiring Growth:</span>
                <span className="text-orange-400 font-bold font-mono">+{growthMode}%</span>
              </div>
              <input
                type="range" min="5" max="80" value={growthMode}
                onChange={(e) => {
                  setGrowthMode(Number(e.target.value));
                  triggerAdminAction(`[MARKET] Adjusted hiring growth projections to +${e.target.value}%`);
                }}
                className="w-full accent-orange-500 bg-zinc-900 h-1.5 rounded-full"
              />
            </div>

            {/* Remote ratio slider */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold">
                <span>Remote / Hybrid job ratios:</span>
                <span className="text-orange-400 font-bold font-mono">{remoteRatio}% Remote</span>
              </div>
              <input
                type="range" min="10" max="90" value={remoteRatio}
                onChange={(e) => setRemoteRatio(Number(e.target.value))}
                className="w-full accent-orange-500 bg-zinc-900 h-1.5 rounded-full"
              />
            </div>
          </div>

          {/* Top cities tags */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Top Tech Cities</span>
            <div className="flex flex-wrap gap-2 text-[10px]">
              {['San Francisco', 'New York', 'Austin', 'London', 'Tokyo', 'Berlin'].map(city => (
                <span key={city} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg font-bold font-mono">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Trends Display */}
        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Trending Core Proficiencies</h3>
          <div className="space-y-3">
            {trendingSkills.map((trend, i) => (
              <div key={i} className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-2xl flex items-center justify-between text-left">
                <div className="space-y-0.5">
                  <span className={`text-xs font-bold ${trend.color}`}>{trend.skill}</span>
                  <p className="text-[10px] text-zinc-400 leading-normal">{trend.rate}</p>
                </div>
                <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-bold">trending</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   8. NegotiationGuide
   ========================================== */
export const NegotiationGuide: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [copiedTemplate, setCopiedTemplate] = useState<number | null>(null);

  // Counter offer calculator states
  const [baseOffer, setBaseOffer] = useState(120000);
  const [equityMultiplier, setEquityMultiplier] = useState(1.15); // 15% increase target

  const emailTemplates = [
    {
      title: "Salary Increment Counter Offer",
      subject: "Response to Offer - [Your Name] - [Job Title]",
      body: (comp: number) => `Dear Hiring Team,\n\nThank you so much for the offer for the [Job Title] role. I am very excited about the opportunity to join the team and deliver immediate outcomes.\n\nBased on my 6+ years of specialized web architecture and system performance audits, I would like to discuss adjusting the base salary allocation to $${comp.toLocaleString()}, aligning closer with standard local benchmarks.\n\nBest regards,\n[Your Name]`
    },
    {
      title: "Signing Bonus Request",
      subject: "Signing Bonus Inquiry - [Your Name]",
      body: () => `Dear Team,\n\nI appreciate the competitive offer package. To offset transition costs and early vesting distributions from my current firm, I would like to propose a one-time signing bonus of $15,000.\n\nBest,\n[Your Name]`
    }
  ];

  const handleCopy = (bodyFunc: () => string, idx: number) => {
    navigator.clipboard.writeText(bodyFunc());
    setCopiedTemplate(idx);
    triggerAdminAction(`[NEGOTIATION] Copied negotiation template ${idx + 1}.`);
    setTimeout(() => setCopiedTemplate(null), 3000);
  };

  const targetComp = Math.round(baseOffer * equityMultiplier);

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <span>Salary Negotiation Guide</span>
          </h2>
          <p className="text-xs text-zinc-500">Email drafts and guides to counter salary proposals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calculator */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-left">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Counter Offer Targeter</span>
            
            {/* Base Offer input */}
            <div className="space-y-1 text-xs">
              <label className="text-[10px] text-zinc-500 uppercase font-bold">Base Offer Salary ($)</label>
              <input
                type="number" value={baseOffer}
                onChange={(e) => setBaseOffer(Number(e.target.value))}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-teal-500"
              />
            </div>

            {/* Target increment multiplier */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold">
                <span>Target Increment:</span>
                <span className="text-teal-400 font-bold font-mono">{Math.round((equityMultiplier - 1) * 100)}%</span>
              </div>
              <input
                type="range" min="1.05" max="1.40" step="0.05" value={equityMultiplier}
                onChange={(e) => setEquityMultiplier(Number(e.target.value))}
                className="w-full accent-teal-600 bg-zinc-900 h-1.5 rounded-full"
              />
            </div>

            <div className="pt-2 border-t border-zinc-900 flex justify-between items-baseline text-xs">
              <span className="text-zinc-500">Target Counter Salary:</span>
              <span className="text-sm font-mono font-bold text-white">${targetComp.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Draft list */}
        <div className="lg:col-span-8 space-y-4">
          {emailTemplates.map((template, idx) => {
            const bodyText = idx === 0 ? () => template.body(targetComp) : () => (template.body as any)();
            return (
              <div key={idx} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">{template.title}</span>
                  <button 
                    onClick={() => handleCopy(bodyText, idx)}
                    className="text-[10px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedTemplate === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    <span>{copiedTemplate === idx ? "Copied" : "Copy Draft"}</span>
                  </button>
                </div>
                <div className="p-3 bg-zinc-955 rounded-lg border border-zinc-900 font-mono text-[9px] text-zinc-400 whitespace-pre-wrap leading-relaxed">
                  <b>Subject:</b> {template.subject}<br/><br/>
                  {bodyText()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
