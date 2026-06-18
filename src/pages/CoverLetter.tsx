import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Copy, Printer, Check, ArrowLeft } from 'lucide-react';

export const CoverLetter: React.FC = () => {
  const { currentCV, addNotification, triggerAdminAction, setActiveTab } = useApp();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterText, setLetterText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = () => {
    if (!company || !role) return;
    setIsGenerating(true);
    setLetterText('');
    triggerAdminAction(`[AI] Cover letter request: ${role} at ${company}`);

    setTimeout(() => {
      setIsGenerating(false);
      const letter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${role} position at ${company}. With over 6 years of experience building scalable web applications and a proven track record of optimizing system structures, I am confident in my ability to deliver immediate value to your engineering team.

In my recent position as a Lead Engineer, I spearheaded the development of 5 high-traffic microservices handling over 10M daily API requests. Additionally, I refactored legacy code layouts, reducing UI bundle sizes by 35% and improving overall client response speeds. These outcomes align directly with the targets outline for the role at ${company}.

I admire ${company}'s commitment to technology innovations and would love the opportunity to contribute my skills in React, TypeScript, Node.js, and automated pipelines. Thank you for your time and consideration.

Sincerely,
${currentCV.name}
${currentCV.email} • ${currentCV.phone}`;

      setLetterText(letter);
      addNotification("Cover Letter Created", `Generated letter for ${role} at ${company} using a ${tone} tone.`);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button 
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition flex items-center justify-center font-bold text-xs"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div className="text-left">
          <h2 className="text-xl font-bold tracking-tight text-white">Cover Letter Generator</h2>
          <p className="text-xs text-zinc-500 mt-1">Generate custom cover letters tailored to targeted companies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Creator Form */}
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/40">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Target Details</span>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Company Name</label>
              <input 
                type="text" 
                placeholder="Google, Meta, etc." 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs focus:border-purple-500 outline-none" 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Target Position</label>
              <input 
                type="text" 
                placeholder="Software Engineer, Product Manager, etc." 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs focus:border-purple-500 outline-none" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Tone Style</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 outline-none focus:border-purple-500"
              >
                <option value="Professional">Professional</option>
                <option value="Creative">Creative / Startup</option>
                <option value="Confident">Confident / Bold</option>
                <option value="Academic">Academic / Plain</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !company || !role}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 active:scale-95"
          >
            {isGenerating ? "Compiling Letter..." : "Generate AI Cover Letter"}
          </button>
        </div>

        {/* Output letter */}
        <div className="lg:col-span-7 space-y-4">
          {isGenerating && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
              <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-bold">Assembling custom sections...</p>
            </div>
          )}

          {!isGenerating && !letterText && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-8 text-center text-zinc-650 text-xs py-16 min-h-[300px] flex items-center justify-center">
              Enter targeted details on the left to write an optimized letter.
            </div>
          )}

          {!isGenerating && letterText && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-6 bg-white text-zinc-900 min-h-[400px] shadow-2xl relative select-text flex flex-col justify-between">
              
              {/* Tool bar floating */}
              <div className="absolute top-4 right-4 flex space-x-2 print:hidden select-none">
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-200 transition"
                  title="Copy Text"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button 
                  onClick={handlePrint}
                  className="p-2 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 hover:bg-zinc-200 transition"
                  title="Print PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Letter text body */}
              <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-zinc-800 pr-12 pt-6">
                {letterText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
