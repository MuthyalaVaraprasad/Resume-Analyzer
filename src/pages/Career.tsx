import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft 
} from 'lucide-react';

export const Career: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [targetRole, setTargetRole] = useState('Staff Engineer');
  const [experienceYears, setExperienceYears] = useState(5);
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [colIndex, setColIndex] = useState(1.2); // Cost of Living
  const [completedRoadmap, setCompletedRoadmap] = useState<number[]>([]);
  const [skillGapFilter, setSkillGapFilter] = useState<'All' | 'Missing' | 'Matched'>('All');

  // Simple dynamic mock salary calculator
  const baseSalary = targetRole === 'Staff Engineer' ? 140000 : 110000;
  const rawSalary = (baseSalary + experienceYears * 6000) * colIndex;
  const calculatedSalary = currency === 'EUR' ? rawSalary * 0.92 : rawSalary;

  const skillsGaps = [
    { skill: "Kubernetes & Docker orchestration", status: "Missing", suggest: "Deploy containerized applications on AWS EKS." },
    { skill: "CI/CD automated testing logic", status: "Weak", suggest: "Integrate jest code coverage in GitHub workflows." },
    { skill: "GraphQL APIs query architectures", status: "Matched", suggest: "Fully documented in experience sections." }
  ];

  const roadmapSteps = [
    { title: "Master Container Ecosystems", detail: "Take CKAD Kubernetes bootcamp & dockerize 3 portfolio repos.", time: "1-2 Weeks" },
    { title: "Architect CI/CD Automation", detail: "Configure GitHub workflows testing scripts on every branch commit.", time: "1 Week" },
    { title: "Acquire Cloud Certifications", detail: "Pass AWS Solutions Architect certification exams.", time: "3 Weeks" }
  ];

  const handleToggleRoadmap = (idx: number) => {
    if (completedRoadmap.includes(idx)) {
      setCompletedRoadmap(prev => prev.filter(i => i !== idx));
    } else {
      setCompletedRoadmap(prev => [...prev, idx]);
      triggerAdminAction(`[CAREER] Checked roadmap step ${idx + 1}`);
    }
  };

  const filteredGaps = skillGapFilter === 'All' 
    ? skillsGaps 
    : skillsGaps.filter(g => skillGapFilter === 'Matched' ? g.status === 'Matched' : g.status !== 'Matched');

  return (
    <div className="space-y-6 select-none text-left">
      {/* Header Banner */}
      <div className="pb-4 border-b border-zinc-900 flex flex-col md:flex-row justify-between md:items-center gap-4">
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
            <h2 className="text-xl font-bold tracking-tight text-white">AI Career Insights</h2>
            <p className="text-xs text-zinc-500 mt-1">Track target salary scales, skill roadmaps, and sector demands.</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select 
            value={targetRole}
            onChange={(e) => {
              setTargetRole(e.target.value);
              triggerAdminAction(`[CAREER] Target role set to: ${e.target.value}`);
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 outline-none focus:border-purple-500 w-max"
          >
            <option value="Staff Engineer">Staff Frontend/Fullstack Engineer</option>
            <option value="Product Manager">Lead Product Manager</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COMPONENT: Salary Predictor (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/40">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Salary Predictor Scale</span>
              <div className="flex p-0.5 bg-zinc-950 border border-zinc-900 rounded-lg text-[9px] font-bold">
                <button 
                  onClick={() => setCurrency('USD')} 
                  className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-purple-600/20 text-purple-300' : 'text-zinc-500'}`}
                >
                  USD
                </button>
                <button 
                  onClick={() => setCurrency('EUR')} 
                  className={`px-2 py-0.5 rounded ${currency === 'EUR' ? 'bg-purple-600/20 text-purple-300' : 'text-zinc-500'}`}
                >
                  EUR
                </button>
              </div>
            </div>
            
            <div className="space-y-3 py-2 text-center">
              <h4 className="text-3xl font-extrabold text-white font-mono">
                {currency === 'EUR' ? '€' : '$'}{Math.round(calculatedSalary).toLocaleString()}
              </h4>
              <p className="text-[10px] text-zinc-500">Estimated base salary benchmark scale</p>
            </div>

            {/* Slider 1: Years experience */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-semibold">
                <span className="text-zinc-400">Experience Scale:</span>
                <span className="text-purple-400 font-mono font-bold">{experienceYears} Years</span>
              </div>
              <input 
                type="range" min="0" max="15" value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-zinc-900 h-1.5 rounded-full" 
              />
            </div>

            {/* Slider 2: Cost of living scale */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-semibold">
                <span className="text-zinc-400">Cost of Living Multiplier:</span>
                <span className="text-purple-400 font-mono font-bold">{colIndex.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0.8" max="1.6" step="0.1" value={colIndex}
                onChange={(e) => setColIndex(Number(e.target.value))}
                className="w-full accent-purple-500 bg-zinc-900 h-1.5 rounded-full" 
              />
            </div>
          </div>

          {/* Hiring Trends Widget */}
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Hiring Velocity Index</span>
            <div className="flex justify-between items-center text-xs">
              <div className="text-left">
                <p className="text-white font-bold">Active Demand Index</p>
                <p className="text-[9px] text-zinc-500 mt-0.5">Updated real-time from job listings</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono font-bold text-[9px]">+38% High</span>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: Learning Roadmap checklist (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Recommended Learning Roadmap</span>
              <span className="text-[9px] text-zinc-500 font-mono">{completedRoadmap.length}/{roadmapSteps.length} Done</span>
            </div>

            <div className="space-y-4 relative pl-4 border-l border-zinc-900">
              {roadmapSteps.map((step, idx) => {
                const isCompleted = completedRoadmap.includes(idx);
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleToggleRoadmap(idx)}
                    className="relative pb-1 cursor-pointer select-none group"
                  >
                    <span className={`absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border border-zinc-950 flex items-center justify-center shadow-md transition ${
                      isCompleted ? 'bg-purple-600 text-white' : 'bg-zinc-900 hover:bg-zinc-800'
                    }`}>
                      {isCompleted && <span className="w-1.5 h-1.5 bg-white rounded-full animate-scale" />}
                    </span>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline text-xs font-bold">
                        <h5 className={`transition ${isCompleted ? 'text-zinc-500 line-through' : 'text-white group-hover:text-purple-300'}`}>{step.title}</h5>
                        <span className="text-[9px] text-zinc-500 font-mono font-normal">{step.time}</span>
                      </div>
                      <p className={`text-[10px] leading-relaxed transition ${isCompleted ? 'text-zinc-650' : 'text-zinc-400'}`}>{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Gap Analysis */}
      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-3">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Target Skills Gap Analysis</span>
          <div className="flex p-0.5 bg-zinc-950 border border-zinc-900 rounded-lg text-[9px] font-bold">
            {(['All', 'Missing', 'Matched'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSkillGapFilter(f)}
                className={`px-2.5 py-0.5 rounded transition ${
                  skillGapFilter === f 
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-zinc-550 border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredGaps.map((gap, i) => (
            <div key={i} className="p-4 bg-zinc-900/35 border border-zinc-900 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white font-mono truncate max-w-[120px]">{gap.skill.split(' ')[0]}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded font-mono ${
                  gap.status === 'Matched' ? 'bg-emerald-500/10 text-emerald-400' :
                  gap.status === 'Weak' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {gap.status}
                </span>
              </div>
              <div>
                <p className="text-zinc-400 text-[10px] leading-relaxed">{gap.suggest}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
