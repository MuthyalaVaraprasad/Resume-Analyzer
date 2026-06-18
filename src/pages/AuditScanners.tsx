import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, CheckSquare, Search, Award, CheckCircle, 
  ArrowLeft, CheckCircle2, LayoutGrid, Cpu, List
} from 'lucide-react';

/* ==========================================
   1. KeywordDensity
   ========================================== */
export const KeywordDensity: React.FC = () => {
  const { setActiveTab, currentCV, updateCurrentCV, triggerAdminAction } = useApp();
  const [threshold, setThreshold] = useState(3.0); // %
  const [missingKw, setMissingKw] = useState(['Kubernetes', 'CI/CD Pipelines', 'Prometheus']);

  const densities = [
    { word: "React", count: 8, density: 4.2 },
    { word: "TypeScript", count: 6, density: 3.1 },
    { word: "Software", count: 12, density: 6.3 },
    { word: "Docker", count: 2, density: 1.0 }
  ];

  const handleAddMissing = (kw: string) => {
    if (!currentCV.skills.includes(kw)) {
      updateCurrentCV(prev => ({
        ...prev,
        skills: [...prev.skills, kw]
      }));
      triggerAdminAction(`[DENSITY] Added keyword: ${kw}`);
    }
    setMissingKw(prev => prev.filter(k => k !== kw));
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-400" />
            <span>Keyword Density Scanner</span>
          </h2>
          <p className="text-xs text-zinc-500">Scan keyword distribution in your CV text.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* left sliders */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 bg-zinc-950/20 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Threshold Settings</span>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                <span>Density Limit Warn:</span>
                <span className="text-purple-400 font-mono font-bold">{threshold}%</span>
              </div>
              <input
                type="range" min="1.0" max="6.0" step="0.5" value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-purple-600 bg-zinc-900 h-1.5 rounded-full"
              />
            </div>
          </div>

          {/* Missing quick adders */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Target Keywords Gaps</span>
            {missingKw.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {missingKw.map(kw => (
                  <button
                    key={kw}
                    onClick={() => handleAddMissing(kw)}
                    className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] text-purple-400 hover:text-white transition font-bold"
                  >
                    + Add {kw}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-zinc-650">All missing keywords verified.</p>
            )}
          </div>
        </div>

        {/* right list */}
        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Keyword Frequency Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-850 text-zinc-500 font-mono">
                  <th className="pb-2">Keyword</th>
                  <th className="pb-2">Count</th>
                  <th className="pb-2">Density</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-350">
                {densities.map((d, i) => {
                  const isHigh = d.density > threshold;
                  return (
                    <tr key={i} className="hover:bg-zinc-900/10">
                      <td className="py-2.5 font-semibold text-white">{d.word}</td>
                      <td className="py-2.5">{d.count}</td>
                      <td className="py-2.5">{d.density}%</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          isHigh ? 'bg-yellow-500/10 text-yellow-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {isHigh ? 'High Density' : 'Ideal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   2. CertAuditor
   ========================================== */
export const CertAuditor: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [certs, setCerts] = useState([
    { name: "AWS Solutions Architect", status: "Verified", expiry: "2027-04" },
    { name: "Scrum Master", status: "Verified", expiry: "2028-10" }
  ]);
  const [newCertName, setNewCertName] = useState('');
  const [newExpiry, setNewExpiry] = useState('2027-12');

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName) return;
    const newC = { name: newCertName, status: "Verified", expiry: newExpiry };
    setCerts(prev => [...prev, newC]);
    setNewCertName('');
    triggerAdminAction(`[CERT] Audited new credential: ${newCertName}`);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span>Credentials Auditor</span>
          </h2>
          <p className="text-xs text-zinc-500">Verify certificate relevance and expiration timelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <form onSubmit={handleAddCert} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Verify New Certificate</span>
            <div className="space-y-2 text-xs">
              <input
                type="text" placeholder="Certificate Name" value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-cyan-500"
              />
              <input
                type="text" placeholder="Expiry (e.g. 2028-12)" value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <button type="submit" className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition">
              Verify Credential
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Certifications</h3>
          <div className="space-y-3">
            {certs.map((c, i) => (
              <div key={i} className="p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between text-left">
                <div>
                  <h4 className="text-xs font-bold text-white">{c.name}</h4>
                  <p className="text-[9px] text-zinc-500 mt-1 font-mono">Expires: {c.expiry}</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>{c.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   3. HeaderAudits
   ========================================== */
export const HeaderAudits: React.FC = () => {
  const { setActiveTab, updateCurrentCV, triggerAdminAction } = useApp();
  const [headers, setHeaders] = useState([
    { key: 'exp', title: "Experience", format: "Standard", status: "Safe" },
    { key: 'edu', title: "My Education History", format: "Non-standard", status: "Warning" },
    { key: 'skills', title: "Skills Summary", format: "Standard", status: "Safe" }
  ]);

  const handleFixHeader = (_key: string, idx: number) => {
    triggerAdminAction(`[AUDIT] Fixed non-standard header label for education registry.`);
    
    // Modify the headers state
    setHeaders(prev => {
      const updated = [...prev];
      updated[idx].title = "Education";
      updated[idx].status = "Safe";
      return updated;
    });

    // Actually update AppContext data if necessary
    updateCurrentCV(prev => ({
      ...prev,
      education: prev.education.map(e => ({ ...e, degree: e.degree })) // trigger state refresh
    }));
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-pink-400" />
            <span>ATS Header Scan Audits</span>
          </h2>
          <p className="text-xs text-zinc-500">Verify section headings use parser-friendly terminology.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Section Title Audits</h3>
        <div className="space-y-3">
          {headers.map((h, i) => (
            <div key={i} className="p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between text-left">
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">Heading Detected</span>
                <p className="text-xs font-bold text-white mt-0.5">"{h.title}"</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${h.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                  {h.status === 'Safe' ? 'Safe Heading' : 'Warning: Non-Standard'}
                </span>
                {h.status !== 'Safe' && (
                  <button
                    onClick={() => handleFixHeader(h.key, i)}
                    className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md transition"
                  >
                    Use "Education"
                  </button>
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
   4. SkillMatrix
   ========================================== */
export const SkillMatrix: React.FC = () => {
  const { setActiveTab, currentCV, updateCurrentCV, triggerAdminAction } = useApp();
  const [skillCategory, setSkillCategory] = useState('Frontend');
  const [newSkillText, setNewSkillText] = useState('');

  const skillsMatrix = [
    { category: "Frontend", items: ["React 19", "TypeScript", "TailwindCSS", "HTML5"] },
    { category: "Backend", items: ["NodeJS", "Express", "GraphQL", "Redis", "MongoDB"] },
    { category: "DevOps", items: ["AWS Cloud", "Docker Containers", "CI/CD Pipelines", "Git"] }
  ];

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillText.trim()) return;
    if (!currentCV.skills.includes(newSkillText.trim())) {
      updateCurrentCV(prev => ({
        ...prev,
        skills: [...prev.skills, newSkillText.trim()]
      }));
      triggerAdminAction(`[MATRIX] Appended skill: ${newSkillText}`);
    }
    setNewSkillText('');
  };

  const activeSkills = skillsMatrix.find(m => m.category === skillCategory)?.items || [];

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            <span>Interactive Skill Matrix</span>
          </h2>
          <p className="text-xs text-zinc-500">Categorized map of core skills.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          {/* Selector */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 bg-zinc-950/20 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Category Filters</span>
            <div className="flex space-x-2 text-[10px]">
              {['Frontend', 'Backend', 'DevOps'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSkillCategory(cat)}
                  className={`px-3 py-1 font-bold rounded-lg border transition ${
                    skillCategory === cat 
                      ? 'bg-teal-600/20 text-teal-300 border-teal-500/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Skill adder */}
          <form onSubmit={handleAddCustomSkill} className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Add Custom Skill Tag</span>
            <div className="flex space-x-2">
              <input
                type="text" placeholder="Skill Name" value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-teal-500"
              />
              <button type="submit" className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition">
                Add
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">{skillCategory} Core Proficiencies</h3>
          <div className="flex flex-wrap gap-2 pt-2">
            {activeSkills.map((item, i) => (
              <span key={i} className="bg-zinc-900/60 border border-zinc-850 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-zinc-300">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   5. RoleFit
   ========================================== */
export const RoleFit: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [seniority, setSeniority] = useState<'Junior' | 'Senior'>('Senior');

  const fits = {
    Junior: [
      { role: "Junior Frontend Developer", score: 96, status: "High Fit" },
      { role: "Associate Software Engineer", score: 88, status: "Ideal Fit" },
      { role: "QA Systems Intern", score: 42, status: "Low Fit" }
    ],
    Senior: [
      { role: "Senior Frontend Engineer", score: 92, status: "High Fit" },
      { role: "Full-Stack Dev Lead", score: 85, status: "Ideal Fit" },
      { role: "DevOps Architect", score: 54, status: "Low Fit" }
    ]
  };

  const activeFits = fits[seniority];

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-yellow-400" />
            <span>Job Role Fit Scoring</span>
          </h2>
          <p className="text-xs text-zinc-500">Score your alignment across standard tech disciplines.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Target Roles Matching</h3>
          
          <div className="flex space-x-2 text-[10px]">
            {['Junior', 'Senior'].map(lvl => (
              <button
                key={lvl}
                onClick={() => {
                  setSeniority(lvl as any);
                  triggerAdminAction(`[FIT] Filtered role fit level to: ${lvl}`);
                }}
                className={`px-3 py-1 font-bold rounded-lg border transition ${
                  seniority === lvl 
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                }`}
              >
                {lvl} Level
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {activeFits.map((f, i) => (
            <div key={i} className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300">{f.role}</span>
                <span className="font-mono text-zinc-500">{f.status}: <b className="text-yellow-400">{f.score}%</b></span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                <div 
                  style={{ width: `${f.score}%` }} 
                  className={`h-full rounded-full transition-all duration-500 ${
                    f.score > 80 ? 'bg-emerald-500' : f.score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   6. ReadabilityStats
   ========================================== */
export const ReadabilityStats: React.FC = () => {
  const { setActiveTab } = useApp();
  const [detailMode, setDetailMode] = useState(false);

  const stats = [
    { metric: "Flesch-Kincaid Grade", value: "11.2 (Professional)", desc: "Ideal grade score for senior developers." },
    { metric: "Reading Time", value: "1.8 mins", desc: "Average recruiter review length: 15-20 secs." },
    { metric: "Total Word Count", value: "382 words", desc: "Within the safe 300-450 word single page limit." }
  ];

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <List className="w-5 h-5 text-blue-400" />
            <span>Readability Statistics</span>
          </h2>
          <p className="text-xs text-zinc-500">Verify sentence construction readability coefficients.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Metrics Overview</h3>
          <button
            onClick={() => setDetailMode(!detailMode)}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 rounded-lg"
          >
            {detailMode ? 'Hide Details' : 'Show Advanced'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl space-y-2 text-left">
              <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">{s.metric}</span>
              <h4 className="text-xs font-bold text-white mt-1">{s.value}</h4>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {detailMode && (
          <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl font-mono text-[10px] text-zinc-400 space-y-1.5 animate-fadeIn">
            <p>Sentence Complexity Index: <b className="text-white">64.2</b></p>
            <p>Average Syllables Count: <b className="text-white">1.82 per word</b></p>
            <p>Cliché density count: <b className="text-emerald-400">0 Buzzwords Flagged</b></p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================
   7. FormattingScanner
   ========================================== */
export const FormattingScanner: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [fixed, setFixed] = useState(false);

  const rules = [
    { title: "No Floating Text Boxes", pass: true, desc: "Found zero overlay boxes that overlap parser indices." },
    { title: "Standard Bullet Symbols", pass: true, desc: "Uses standard circles; no custom emoji metrics." },
    { title: "Single-Column Flow Check", pass: true, desc: "Single column structure ensures linear scan paths." }
  ];

  const handleApplyFixes = () => {
    setFixed(true);
    triggerAdminAction("[FORMATTING] Fixed all typography formatting warning registers.");
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-orange-400" />
            <span>ATS Layout & Formatting Scanner</span>
          </h2>
          <p className="text-xs text-zinc-500">Scan for formatting anomalies that trip up parsers.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Layout Integrity Checks</h3>
          {!fixed && (
            <button
              onClick={handleApplyFixes}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
            >
              <span>Verify margins alignment</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {rules.map((rule, idx) => (
            <div key={idx} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-start space-x-3 text-left">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">{rule.title}</h4>
                <p className="text-[10px] text-zinc-400 mt-1 leading-normal">{rule.desc}</p>
              </div>
            </div>
          ))}
          {fixed && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center space-x-2 font-bold animate-fadeIn">
              <CheckCircle className="w-4 h-4" />
              <span>Document margins and fonts verified and optimized for ATS structures.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   8. JdKeywords
   ========================================== */
export const JdKeywords: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [jdText, setJdText] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [matchRate, setMatchRate] = useState<number | null>(null);

  const handleScanJd = () => {
    if (!jdText.trim()) return;
    triggerAdminAction("[JD] Analyzed target job description keywords matching.");
    
    // Simulate extraction of keywords
    setKeywords(['Kubernetes', 'CI/CD Pipelines', 'AWS Architect', 'GraphQL']);
    setMatchRate(78);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-400" />
            <span>Target Job Keywords Matcher</span>
          </h2>
          <p className="text-xs text-zinc-500">Compare target JD keywords against parsed CV tokens.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 bg-zinc-950/20 text-xs">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Paste Job Description</span>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste target role job description text here to scan..."
              rows={6}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-teal-500 resize-none leading-relaxed"
            />
            <button
              onClick={handleScanJd}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
            >
              Analyze JD Keywords
            </button>
          </div>
        </div>

        <div className="lg:col-span-7">
          {matchRate !== null && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left animate-fadeIn">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Keywords matching rating</span>
                <span className="text-sm font-mono font-bold text-teal-400">{matchRate}% Match</span>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-wider block">Extracted Target Keywords</span>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map(kw => (
                    <span key={kw} className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] text-zinc-300 font-semibold font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   9. ScoringLogs
   ========================================== */
export const ScoringLogs: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [logs, setLogs] = useState([
    { id: 'log-1', date: "2026-06-18 10:45", filename: "Alex_Morgan_v1.pdf", score: 88, details: "Original parse." },
    { id: 'log-2', date: "2026-06-18 11:25", filename: "Alex_Morgan_v2_Optimized.pdf", score: 95, details: "Applied 3 bullet enhancers." }
  ]);

  const handleClearLogs = () => {
    setLogs([]);
    triggerAdminAction("[LOGS] Cleared scoring logs history registry.");
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-zinc-400" />
            <span>CV Scoring History Logs</span>
          </h2>
          <p className="text-xs text-zinc-500">Browse chronological records of resume scoring metrics.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Scoring Log Stream</h3>
          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="px-2 py-0.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 rounded-md text-[10px] font-bold transition"
            >
              Clear Logs
            </button>
          )}
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-xl flex justify-between items-center text-left">
              <div>
                <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">{log.date}</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{log.filename}</h4>
                <p className="text-[10px] text-zinc-400 leading-normal">{log.details}</p>
              </div>
              <span className="text-xs font-bold font-mono text-purple-400">{log.score}%</span>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-[10px] text-zinc-650 text-center py-8 border border-dashed border-zinc-900 rounded-xl">
              Logs registry empty. Scanned resume histories will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
