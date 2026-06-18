import React from 'react';
import { useApp } from '../context/AppContext';
import { Check, ArrowLeft } from 'lucide-react';

export const Templates: React.FC = () => {
  const { activeTemplate, setActiveTemplate, setActiveTab } = useApp();

  const templates = [
    { name: "Modern", category: "General", desc: "Minimalist side-accent layouts for digital applications." },
    { name: "Corporate", category: "Enterprise", desc: "Centered, elegant header blocks suited for traditional sectors." },
    { name: "Executive", category: "Leadership", desc: "Classy header bars with deep charcoal styles." },
    { name: "Software Engineer", category: "Tech", desc: "Highlighting technical grids and commit linkages." },
    { name: "Full Stack", category: "Tech", desc: "Optimal layouts for multi-language developer arrays." },
    { name: "Frontend", category: "Tech", desc: "Stresses design tokens, styling skills, and layout speeds." },
    { name: "Backend", category: "Tech", desc: "Prioritizes cloud stacks, API scales, and DB matrices." },
    { name: "Data Analyst", category: "Analytics", desc: "Stresses SQL structures, visual gauges, and statistics." },
    { name: "Data Scientist", category: "Analytics", desc: "Highlights Python scripts, modelling engines, and algorithms." },
    { name: "AI Engineer", category: "AI & ML", desc: "Displays LLM integrations, fine-tuning scripts, and CUDA builds." },
    { name: "Cybersecurity", category: "Security", desc: "Lists audit compliances, networking shields, and hack scopes." },
    { name: "Cloud Engineer", category: "DevOps", desc: "Focuses on AWS structures, Terraform scripts, and Docker grids." },
    { name: "UI UX", category: "Design", desc: "Maximizes portfolio screenshots and font grids." },
    { name: "Product Manager", category: "Management", desc: "Features user metrics, ARR scales, and lifecycle models." },
    { name: "Marketing", category: "Growth", desc: "Highlights CPC budgets, conversion lists, and SEO stats." },
    { name: "Finance", category: "Corporate", desc: "Displays investment calculations, auditing scales, and excel details." },
    { name: "Academic", category: "Research", desc: "Classic LaTeX style for citation structures and journals." },
    { name: "Research", category: "Research", desc: "Stresses lab projects, publishing metrics, and grant sizes." },
    { name: "Government", category: "General", desc: "Extremely simple, compliance-first layout matching federal grids." },
    { name: "Startup", category: "Growth", desc: "Dynamic formatting highlighting multi-role executions." },
    { name: "Creative", category: "Design", desc: "Bold colors and unique typography grids for portfolios." },
    { name: "Luxury", category: "Aesthetics", desc: "Thin classic borders and high-end typography structures." },
    { name: "Internship", category: "Academic", desc: "Accents course lists, labs, and academy GPA metrics." },
    { name: "Fresher", category: "Academic", desc: "Focuses on bootcamps, project listings, and code grades." },
    { name: "International", category: "General", desc: "Global compliance layout including visa statuses." }
  ];

  const handleSelectTemplate = (name: string) => {
    setActiveTemplate(name);
    setActiveTab('builder');
  };

  return (
    <div className="space-y-6 select-none">
      <div className="pb-4 border-b border-zinc-900 flex items-center space-x-3">
        <button 
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition flex items-center justify-center font-bold text-xs"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-left">
          <h2 className="text-xl font-bold tracking-tight text-white">Resume Template Library</h2>
          <p className="text-xs text-zinc-500 mt-1">Select from 25 premium visual structures compiled in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl, i) => {
          const isSelected = activeTemplate === tpl.name;
          return (
            <div 
              key={i}
              onClick={() => handleSelectTemplate(tpl.name)}
              className={`glass-panel rounded-2xl p-5 cursor-pointer relative group flex flex-col justify-between transition ${
                isSelected 
                  ? 'border-purple-500 bg-purple-950/5 shadow-[0_0_20px_rgba(168,85,247,0.08)]' 
                  : 'glass-panel-hover'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded">
                    {tpl.category}
                  </span>
                  {isSelected && <span className="text-xs text-purple-400 font-bold flex items-center space-x-1"><Check className="w-3.5 h-3.5" /> <span>Active</span></span>}
                </div>
                
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition">{tpl.name} Style</h4>
                  <p className="text-zinc-400 text-[11px] leading-relaxed mt-1.5">{tpl.desc}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-bold">
                <span>1-Page Compliant</span>
                <span className="text-purple-400 group-hover:translate-x-0.5 transition font-sans">Choose Layout →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
