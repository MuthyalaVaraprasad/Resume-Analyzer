import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Globe, Edit, FileText, ArrowLeft, 
  CheckCircle2, Type, MessageCircle, AlertTriangle, Check, Copy, RefreshCw
} from 'lucide-react';

/* ==========================================
   1. ResumeTranslator
   ========================================== */
export const ResumeTranslator: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [lang, setLang] = useState('Spanish');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const translateResume = () => {
    setIsTranslating(true);
    triggerAdminAction(`[TRANSLATOR] Switched translation queue target language to: ${lang}`);
    
    setTimeout(() => {
      setIsTranslating(false);
      if (lang === 'Spanish') {
        setTranslatedText("[TRADUCCIÓN] Alex Morgan - Ingeniero de Software Senior. Líder de desarrollo full-stack con más de 6 años de experiencia en la creación de aplicaciones web escalables. Experto en React, TypeScript y arquitecturas en la nube.");
      } else if (lang === 'French') {
        setTranslatedText("[TRADUCTION] Alex Morgan - Ingénieur Logiciel Senior. Développeur Full-Stack chevronné avec plus de 6 ans d'expérience dans la création d'applications web scalables. Expert en React, TypeScript et architectures cloud.");
      } else if (lang === 'German') {
        setTranslatedText("[ÜBERSETZUNG] Alex Morgan - Senior Software Engineer. Full-Stack-Entwickler mit über 6 Jahren Erfahrung im Aufbau skalierbarer Webanwendungen. Experte für React, TypeScript und Cloud-Architekturen.");
      } else {
        setTranslatedText("[翻訳] アレックス・モーガン - シニアソフトウェアエンジニア。スケーラブルなWebアプリケーションの構築に6年以上の経験を持つフルスタック開発者。React、TypeScript、クラウドアーキテクチャの専門家。");
      }
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <span>AI Resume Translator</span>
          </h2>
          <p className="text-xs text-zinc-500">Translate your resume structure to target regional formats.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Select Destination Language</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">We support regional localization layouts.</p>
          </div>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2.5 outline-none text-zinc-300"
          >
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Japanese</option>
          </select>
        </div>

        <button 
          onClick={translateResume} 
          disabled={isTranslating}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isTranslating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Translating Document Nodes...</span>
            </>
          ) : (
            <span>Generate Translation Matrix</span>
          )}
        </button>

        {translatedText && (
          <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Translated Successfully to {lang}</span>
              </span>
              <button
                onClick={handleCopy}
                className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap">
              {translatedText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================
   2. BulletEnhancer
   ========================================== */
export const BulletEnhancer: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [bullet, setBullet] = useState('I was responsible for writing React code.');
  const [verbCategory, setVerbCategory] = useState<'Leadership' | 'Technical' | 'Execution'>('Technical');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const enhanceBullet = () => {
    setIsEnhancing(true);
    triggerAdminAction(`[BULLET] Optimizing bullet point with ${verbCategory} category verbs.`);
    
    setTimeout(() => {
      setIsEnhancing(false);
      if (verbCategory === 'Technical') {
        setSuggestions([
          "Architected and deployed responsive React 19 component library, cutting render latency by 35%.",
          "Engineered reusable modular client modules in TypeScript, boosting system test coverage to 92%.",
          "Automated frontend build configurations, speeding up feature delivery cycles by 20%."
        ]);
      } else if (verbCategory === 'Leadership') {
        setSuggestions([
          "Spearheaded redesign of checkout page flow, lifting user conversion metrics by 14%.",
          "Led team of 4 software developers, introducing CI/CD deployment pipelines and code reviews.",
          "Guided frontend development squads in adopting unified components strategies."
        ]);
      } else {
        setSuggestions([
          "Overhauled legacy client dashboard modules, reducing bundle loading footprint by 45%.",
          "Consolidated state management architectures using Redux, preventing runtime performance drops.",
          "Maximized Core Web Vitals audit ratings by restructuring CSS layout assets."
        ]);
      }
    }, 1000);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>AI Bullet Point Enhancer</span>
          </h2>
          <p className="text-xs text-zinc-500">Transform passive phrases into active, metric-based impacts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Paste Weak Bullet Point</h3>
          <div className="space-y-3 text-xs">
            <textarea 
              value={bullet} 
              onChange={(e) => setBullet(e.target.value)}
              rows={4}
              placeholder="Enter passive phrase..."
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500 resize-none leading-relaxed" 
            />

            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Target Verb Tone</label>
              <select
                value={verbCategory}
                onChange={(e) => setVerbCategory(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2 outline-none text-zinc-300"
              >
                <option value="Technical">Technical/Architectural</option>
                <option value="Leadership">Leadership/Ownership</option>
                <option value="Execution">Execution/Performance</option>
              </select>
            </div>

            <button 
              onClick={enhanceBullet} 
              disabled={isEnhancing || !bullet.trim()}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isEnhancing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <span>Optimize with Action Verbs</span>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {suggestions.length > 0 && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Suggestions</h3>
              <div className="space-y-3">
                {suggestions.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-zinc-900/35 border border-zinc-900 hover:border-cyan-500/20 rounded-xl transition text-left flex justify-between items-center gap-3">
                    <p className="text-[10px] text-zinc-300 leading-relaxed font-semibold">{s}</p>
                    <button
                      onClick={() => handleCopy(s, idx)}
                      className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-md text-[9px] font-bold shrink-0 transition"
                    >
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   3. HeadlineGen
   ========================================== */
export const HeadlineGen: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [headline, setHeadline] = useState('');
  const [charLimit, setCharLimit] = useState(120);
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleAddKeyword = (kw: string) => {
    if (keywords.includes(kw)) {
      setKeywords(prev => prev.filter(k => k !== kw));
    } else {
      setKeywords(prev => [...prev, kw]);
    }
  };

  const generateHeadline = () => {
    triggerAdminAction(`[HEADLINE] LinkedIn headline generate requested.`);
    const kwText = keywords.length > 0 ? ` | Expert in ${keywords.join(' & ')}` : '';
    const output = `Senior Software Engineer${kwText} | React 19 & Cloud Architectures | Reducing System Latency by 40%`;
    setHeadline(output.substring(0, charLimit));
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-pink-400" />
            <span>LinkedIn Headline Generator</span>
          </h2>
          <p className="text-xs text-zinc-500">Draft professional headlines optimized for recruiter search algorithms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Custom Settings</span>
          
          {/* Slider for character limit */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
              <span>Headline Character Limit:</span>
              <span className="font-mono text-pink-400">{charLimit} Chars</span>
            </div>
            <input
              type="range" min="60" max="220" value={charLimit}
              onChange={(e) => setCharLimit(Number(e.target.value))}
              className="w-full accent-pink-600 bg-zinc-900 h-1.5 rounded-full"
            />
          </div>

          {/* Keyword tags selection */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-zinc-500 block">Inject Competency Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {['Next.js', 'Kubernetes', 'AWS', 'System Design', 'Figma', 'TypeScript'].map(kw => {
                const isActive = keywords.includes(kw);
                return (
                  <button
                    key={kw}
                    onClick={() => handleAddKeyword(kw)}
                    className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border transition ${
                      isActive 
                        ? 'bg-pink-600/20 text-pink-300 border-pink-500/30'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isActive ? '✓ ' + kw : kw}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={generateHeadline} className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition">
            Generate LinkedIn Headline
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {headline && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
              <span className="text-[9px] uppercase font-bold text-pink-400 font-mono tracking-widest block">Output Headline</span>
              <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl">
                <p className="text-xs text-zinc-200 font-bold leading-relaxed">"{headline}"</p>
              </div>
              <p className="text-[9px] text-zinc-500">Character count: {headline.length} chars (Algorithm limit: 220 chars)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   4. ColdEmail
   ========================================== */
export const ColdEmail: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [email, setEmail] = useState('');
  const [recipient, setRecipient] = useState('Recruiter');
  const [companyName, setCompanyName] = useState('Google');
  const [copied, setCopied] = useState(false);

  const generateEmail = () => {
    triggerAdminAction(`[EMAIL] Cold outreach email template generated for ${companyName} (${recipient}).`);
    let body = "";
    if (recipient === 'Recruiter') {
      body = `Subject: Inquiry: Software Engineer vacancies - [Your Name]\n\nDear Recruitment Specialist,\n\nI hope you are having a wonderful week.\n\nI recently completed updates to my technical resume highlighting core achievements in frontend architectures and AWS migrations. Having spearheaded React migrations cutting render latency by 35% at CloudVibe Solutions, I would love to explore if my skills align with any active software positions at ${companyName}.\n\nThank you for your time,\n[Your Name]`;
    } else {
      body = `Subject: Engineering alignment inquiry - [Your Name]\n\nDear Engineering Manager,\n\nI hope this message finds you well.\n\nI have been following the product updates at ${companyName} and would love to connect. Over the past 6 years, I have built distributed microservices handling 10M daily requests, and engineered modular component systems. I would appreciate the opportunity to brief you on how my credentials align with your active initiatives.\n\nBest regards,\n[Your Name]`;
    }
    setEmail(body);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-teal-400" />
            <span>Cold Email Writer</span>
          </h2>
          <p className="text-xs text-zinc-500">Draft outreach messages for managers and recruiters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Template Parameters</span>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block">Outreach Recipient</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2.5 outline-none text-zinc-300 mt-1"
              >
                <option>Recruiter</option>
                <option>Engineering Manager</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block">Company Name</label>
              <input
                type="text" value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl p-2 text-white outline-none focus:border-teal-500 mt-1"
              />
            </div>
          </div>

          <button onClick={generateEmail} className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition">
            Generate Outreach Template
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {email && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase font-bold text-teal-400 font-mono tracking-widest">Outreach Draft</span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-805 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-[9px] font-bold flex items-center space-x-1.5 transition active:scale-95"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Draft'}</span>
                </button>
              </div>
              <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl font-mono text-[9px] text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {email}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   5. ElevatorPitch
   ========================================== */
export const ElevatorPitch: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [pitch, setPitch] = useState('');
  const [speechPace, setSpeechPace] = useState<'Slow' | 'Medium' | 'Fast'>('Medium');

  const generatePitch = () => {
    triggerAdminAction(`[PITCH] Elevator pitch generated with ${speechPace} speech parameters.`);
    
    let text = "";
    if (speechPace === 'Slow') {
      text = "I am Alex Morgan. Over the past 6 years, my focus has been on building highly scalable frontend applications. I specialize in React, TypeScript, and cloud setups. At my last role, I led microservices deployments and cut rendering times by 35%. I am looking to bring this technical expertise to your engineering team.";
    } else if (speechPace === 'Fast') {
      text = "Hi, I am Alex Morgan, Senior Engineer. Expert in React 19, TypeScript, and AWS architecture. I have managed event brokers handling 10M daily events and optimized bundle packaging down by 45%. Ready to immediately scale up your SaaS pipelines!";
    } else {
      text = "I am a Senior Software Engineer specializing in frontend scale. Over the past six years, I have spearheaded React architecture migrations, cutting render times by 35% and building clean code configurations that help teams launch features faster. Now, I am looking to bring my microservices and platform skills to high-velocity SaaS teams.";
    }
    setPitch(text);
  };

  const getEstDuration = () => {
    if (!pitch) return 0;
    const words = pitch.split(/\s+/).length;
    // Words per minute: Slow = 120, Medium = 150, Fast = 180
    const wpm = speechPace === 'Slow' ? 120 : speechPace === 'Fast' ? 180 : 150;
    return Math.round((words / wpm) * 60);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>Elevator Pitch Builder</span>
          </h2>
          <p className="text-xs text-zinc-500">Draft a 30-second networking pitch.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Pitch Parameters</span>
          
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Estimated Vocal Speed</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Slow', 'Medium', 'Fast'] as const).map(pace => (
                <button
                  key={pace}
                  onClick={() => setSpeechPace(pace)}
                  className={`py-1.5 rounded-lg border font-bold text-[10px] transition ${
                    speechPace === pace 
                      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {pace}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generatePitch} className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl text-xs font-bold transition">
            Generate Pitch Script
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {pitch && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-[9px] uppercase font-bold text-yellow-400 font-mono tracking-widest">Pitch Script</span>
                <span className="text-[10px] text-zinc-500 font-mono">Est: <b className="text-yellow-400">{getEstDuration()} seconds</b> speak duration</span>
              </div>
              <p className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl leading-relaxed text-xs text-zinc-300">
                {pitch}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   6. CoverLetterHelper
   ========================================== */
export const CoverLetterHelper: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [bullets, setBullets] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState<'Bold' | 'Professional'>('Professional');

  const generateCoverLetterBullets = () => {
    setIsGenerating(true);
    triggerAdminAction(`[COVERLETTER] Generate cover letter bullets requested. Tone: ${tone}`);
    
    setTimeout(() => {
      setIsGenerating(false);
      if (tone === 'Bold') {
        setBullets([
          "Disrupted latency metrics: Led engineering transformation scaling UI speed metrics by 35%.",
          "Engineered components architecture: Designed highly modular component patterns that boosted user interaction rates by 25%."
        ]);
      } else {
        setBullets([
          "Quantified impact: Led development on high-traffic nodes, boosting performance by 35%.",
          "Tailored values: Experienced designing modular design layouts that align with corporate priorities."
        ]);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Cover Letter Assistant</span>
          </h2>
          <p className="text-xs text-zinc-500">Generate supporting letter bullet configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Custom Settings</span>
          
          <div>
            <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Tone Archetype</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Bold', 'Professional'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`py-1.5 rounded-lg border font-bold text-[10px] transition ${
                    tone === t 
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={generateCoverLetterBullets} 
            disabled={isGenerating}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating bullets...</span>
              </>
            ) : (
              <span>Generate Supporting Bullets</span>
            )}
          </button>
        </div>

        <div className="lg:col-span-7">
          {bullets.length > 0 && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
              <span className="text-[9px] uppercase font-bold text-blue-400 font-mono tracking-widest block">Output Bullets</span>
              <div className="space-y-3">
                {bullets.map((b, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl text-left text-xs text-zinc-350 leading-relaxed font-semibold">
                    {b}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   7. GrammarTuner
   ========================================== */
export const GrammarTuner: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [issues, setIssues] = useState<Array<{ word: string; suggestion: string; reason: string }>>([]);
  const [isScanning, setIsScanning] = useState(false);

  const checkGrammar = () => {
    setIsScanning(true);
    triggerAdminAction("[GRAMMAR] Initialized spelling check audit scans.");
    
    setTimeout(() => {
      setIsScanning(false);
      setIssues([
        { word: "utilised", suggestion: "utilized / spearheaded", reason: "Avoid passive British spellings in target US locales." },
        { word: "responsible for coding", suggestion: "engineered / architected", reason: "Avoid weak responsibilities descriptors." }
      ]);
    }, 1200);
  };

  const handleFixIssue = (idx: number, suggestion: string) => {
    triggerAdminAction(`[GRAMMAR] Swapped target typo suggestion: ${suggestion}`);
    setIssues(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>Grammar & Spelling Tuner</span>
          </h2>
          <p className="text-xs text-zinc-500">Scan and polish phrasing mechanics.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20">
        <button 
          onClick={checkGrammar} 
          disabled={isScanning}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Scanning phrasing grammar...</span>
            </>
          ) : (
            <span>Run Grammar Check</span>
          )}
        </button>

        {issues.length > 0 && (
          <div className="space-y-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Grammatical anomalies</span>
            {issues.map((issue, idx) => (
              <div key={idx} className="p-3.5 bg-zinc-900/30 border border-zinc-850 rounded-xl flex items-start justify-between gap-3 text-left">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-4.5 h-4.5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-white">Issue: <span className="text-red-400 font-mono">"{issue.word}"</span></p>
                    <p className="text-[10px] text-zinc-400 mt-1">Suggested: <span className="text-emerald-400 font-bold">"{issue.suggestion}"</span></p>
                    <p className="text-[9px] text-zinc-500 mt-0.5">{issue.reason}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFixIssue(idx, issue.suggestion)}
                  className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md text-[9px] font-bold shrink-0 transition"
                >
                  Quick-Fix
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================
   8. SummaryTuner
   ========================================== */
export const SummaryTuner: React.FC = () => {
  const { setActiveTab, triggerAdminAction } = useApp();
  const [tone, setTone] = useState('Corporate');
  const [summary, setSummary] = useState('');
  const [wordLength, setWordLength] = useState(60); // simulated slider
  const [isTuning, setIsTuning] = useState(false);

  const tuneSummary = () => {
    setIsTuning(true);
    triggerAdminAction(`[SUMMARY] Tune bio summary phrasing to ${tone} setting.`);
    
    setTimeout(() => {
      setIsTuning(false);
      let text = "";
      if (tone === 'Corporate') {
        text = "Result-driven Senior Software Engineer with a 6-year history of leading high-performance frontend migrations and system performance audits.";
      } else if (tone === 'Startup') {
        text = "High-velocity full-stack engineer and React enthusiast. Love shipping features fast, hacking system pipelines, and cutting API render times.";
      } else {
        text = "Highly technical frontend lead experienced in compiler optimizations, system benchmarks, and modular component reusability.";
      }
      setSummary(text.substring(0, wordLength * 5)); // truncate mock based on slider value length
    }, 900);
  };

  return (
    <div className="space-y-6 select-none animate-slide-in text-left">
      <div className="flex items-center space-x-3 pb-4 border-b border-zinc-900">
        <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-orange-400" />
            <span>AI Executive Summary Tuner</span>
          </h2>
          <p className="text-xs text-zinc-500">Tune the tone of your bio section.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/20 text-xs">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Tuner Settings</span>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Tone Setting</label>
              <div className="flex space-x-2">
                {['Corporate', 'Startup', 'Technical'].map((t) => (
                  <button 
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                      tone === t 
                        ? 'bg-orange-600 text-white shadow-md' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* slider for length */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                <span>Target Word Count Constraint:</span>
                <span className="font-mono text-orange-400">{wordLength} words</span>
              </div>
              <input
                type="range" min="30" max="120" value={wordLength}
                onChange={(e) => setWordLength(Number(e.target.value))}
                className="w-full accent-orange-500 bg-zinc-900 h-1.5 rounded-full"
              />
            </div>
          </div>

          <button 
            onClick={tuneSummary} 
            disabled={isTuning}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isTuning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Tuning Summary Phrasing...</span>
              </>
            ) : (
              <span>Tune Summary Phrasing</span>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {summary && (
            <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-3">
              <span className="text-[9px] uppercase font-bold text-orange-400 font-mono tracking-widest block">Tuned Summary Bio</span>
              <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl leading-relaxed text-xs text-zinc-300">
                {summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
