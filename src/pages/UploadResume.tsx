import React, { useState } from 'react';
import { useApp, type CVData } from '../context/AppContext';
import { 
  CloudUpload, CheckCircle, Loader2, ArrowLeft, 
  Settings, Info, HardDrive
} from 'lucide-react';

export const UploadResume: React.FC = () => {
  const { addCVToHistory, setCurrentCVData, setActiveTab, triggerAdminAction } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [fileName, setFileName] = useState('');
  
  // New interactive states
  const [cloudProvider, setCloudProvider] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [strictMode, setStrictMode] = useState(true);
  const [grammarScan, setGrammarScan] = useState(true);
  const [ocrEngine, setOcrEngine] = useState('Standard Tesseract');
  const [sslActive, setSslActive] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [parsedMetadata, setParsedMetadata] = useState<{ creator?: string; words?: number; lines?: number } | null>(null);
  const [freeQuota, setFreeQuota] = useState(8);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const sizeMb = parseFloat((files[0].size / (1024 * 1024)).toFixed(2));
      setFileSize(sizeMb);
      startMockProcessing(files[0].name, sizeMb);
    }
  };

  const triggerUpload = () => {
    const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const loadFromCloud = (provider: string) => {
    setCloudProvider(provider);
    setFileSize(1.2);
    triggerAdminAction(`[CLOUD] Connected to ${provider} API node.`);
    startMockProcessing(`${provider}_Resume_Import.pdf`, 1.2);
  };

  const startMockProcessing = (name: string, size: number) => {
    setFileName(name);
    setIsUploading(true);
    setUploadStep(1);

    // Step 1: Uploading
    setTimeout(() => {
      setUploadStep(2);
      triggerAdminAction(`[FILE] Received upload request for: ${name} (${size}MB)`);
      
      // Step 2: Extracting text
      setTimeout(() => {
        setUploadStep(3);
        
        // Step 3: Compiling scores
        setTimeout(() => {
          setUploadStep(4);
          
          // Step 4: Finished
          setTimeout(() => {
            setParsedMetadata({
              creator: "Acrobat PDF Writer",
              words: 382,
              lines: 48
            });
            setFreeQuota(prev => Math.max(0, prev - 1));
            finalizeUpload(name);
          }, 800);
        }, 1200);
      }, 1500);
    }, 1000);
  };

  const finalizeUpload = (name: string) => {
    setIsUploading(false);
    
    // Choose mock profile depending on name
    let mockData: CVData;
    const lowerName = name.toLowerCase();

    if (lowerName.includes('developer') || lowerName.includes('engineer') || lowerName.includes('software') || lowerName.includes('code') || lowerName.includes('import')) {
      mockData = {
        name: "Marcus Aurelius",
        title: "Staff Frontend Engineer",
        email: "marcus.dev@techstack.io",
        phone: "+1 (555) 489-3281",
        website: "github.com/marcusdev",
        location: "Seattle, WA",
        summary: "High-performing Staff Frontend Developer with 8 years of experience building responsive client interfaces. Master in React 19, Tailwind CSS v4, NextJS, and GraphQL. Focused on visual aesthetics, core rendering speed, and accessible components.",
        experience: [
          {
            id: "exp-1",
            role: "Staff Frontend Developer",
            company: "WebVibe Corp",
            duration: "2022 - Present",
            bullets: [
              "Engineered modular React 19 UI component library used across 12 product divisions.",
              "Implemented core rendering performance configurations, cutting bundle sizes by 45%.",
              "Spearheaded redesign of checkout page flow, lifting conversions by 14%."
            ]
          },
          {
            id: "exp-2",
            role: "Senior UI Developer",
            company: "Pixellated Inc",
            duration: "2018 - 2022",
            bullets: [
              "Optimized mobile performance, improving core web vitals rating by 40%.",
              "Mentored 6 developers on modern CSS methodologies, flex grids, and component reusability."
            ]
          }
        ],
        education: [
          {
            id: "edu-1",
            degree: "B.S. in Software Engineering",
            school: "University of Washington",
            duration: "2014 - 2018"
          }
        ],
        skills: ["React 19", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL", "Webpack", "CSS Grid", "Jest", "Git"],
        projects: [
          {
            id: "proj-1",
            name: "React Aurora Renderer",
            description: "High-performance canvas animations wrapper library for landing pages.",
            tech: ["React", "WebGL", "TypeScript"]
          }
        ],
        certifications: ["Meta Frontend Developer Professional Cert", "Certified Scrum Product Owner"],
        achievements: ["Featured on React newsletter as author of the year 2024", "Speaker at JSConf 2023"],
        languages: ["English (Native)", "German (Conversational)"],
        interests: ["UI/UX Design", "Generative Art", "Climbing", "Coffee Brewing"],
        atsScore: 92,
        grammarScore: 94,
        keywordScore: 90,
        formattingScore: 95,
        leadershipScore: 85,
        technicalScore: 96
      };
    } else if (lowerName.includes('finance') || lowerName.includes('bank') || lowerName.includes('money') || lowerName.includes('analyst')) {
      mockData = {
        name: "Charlotte Vance",
        title: "Senior Financial Analyst",
        email: "charlotte.vance@capitalgrowth.com",
        phone: "+1 (555) 302-8942",
        website: "linkedin.com/in/charlottev",
        location: "New York, NY",
        summary: "Analytically-driven Senior Financial Analyst with 6+ years of expertise in corporate budgeting, investment audits, and capital risk management. Expert in financial forecasting models, Excel spreadsheets, SQL databases, and PowerBI visuals.",
        experience: [
          {
            id: "exp-1",
            role: "Senior Financial Analyst",
            company: "Capital Growth Group",
            duration: "2021 - Present",
            bullets: [
              "Managed $14M yearly operational budget forecasting, resolving $450k overhead leaks.",
              "Designed SQL dashboard auditing investment portfolio gains, speeding up weekly reporting by 60%.",
              "Conducted risk assessment on 4 potential acquisitions, delivering projections adopted by executives."
            ]
          }
        ],
        education: [
          {
            id: "edu-1",
            degree: "M.S. in Finance",
            school: "Columbia University",
            duration: "2018 - 2020"
          }
        ],
        skills: ["Financial Modeling", "Corporate Budgeting", "SQL", "Excel (VBA)", "PowerBI", "Risk Audits", "Tableau", "Python"],
        projects: [],
        certifications: ["Chartered Financial Analyst (CFA) Level II", "FMVA Certified"],
        achievements: ["Corporate Excellence Award 2023"],
        languages: ["English (Native)"],
        interests: ["Sailing", "Economics Podcast", "Chess"],
        atsScore: 84,
        grammarScore: 90,
        keywordScore: 78,
        formattingScore: 88,
        leadershipScore: 80,
        technicalScore: 86
      };
    } else {
      // Default: Product Manager
      mockData = {
        name: "Sarah Jenkins",
        title: "Lead Product Manager",
        email: "sarah.jenkins@productcore.io",
        phone: "+1 (555) 789-0123",
        website: "sarahjenkins.co",
        location: "Austin, TX",
        summary: "Product Leader with 7+ years of experience launching mobile app SaaS features. Proven expertise defining product roadmaps, auditing user metrics, and coordinating Agile developers. Lifted daily active users (DAU) by 25% on last launch.",
        experience: [
          {
            id: "exp-1",
            role: "Lead Product Manager",
            company: "ProductCore Tech",
            duration: "2022 - Present",
            bullets: [
              "Owned product roadmap for mobile checkout application with $4.5M ARR volume.",
              "Coordinated 12 developers and 2 UI/UX designers to launch 8 core features in 6 months.",
              "Audited SQL databases to identify user churn funnels, implementing retargeting systems."
            ]
          }
        ],
        education: [
          {
            id: "edu-1",
            degree: "B.A. in Business Administration",
            school: "University of Texas at Austin",
            duration: "2013 - 2017"
          }
        ],
        skills: ["Product Roadmap", "Agile methodologies", "User Telemetry", "A/B Testing", "SQL", "Figma", "Jira", "Market Research"],
        projects: [],
        certifications: ["Pragmatic Certified Product Manager (Level IV)", "Certified Scrum Product Owner (CSPO)"],
        achievements: ["Product Executive Panelist 2024"],
        languages: ["English (Native)", "French (Conversational)"],
        interests: ["Running", "Podcasting", "Gourmet Cooking"],
        atsScore: 89,
        grammarScore: 93,
        keywordScore: 86,
        formattingScore: 92,
        leadershipScore: 88,
        technicalScore: 80
      };
    }

    setCurrentCVData(mockData);
    addCVToHistory(name, mockData.atsScore || 85, mockData.atsScore || 85, mockData);
    setActiveTab('analysis');
  };

  const stepsList = [
    { title: "Uploading File to Sandbox", desc: "Establishing secure SSL upload buffer..." },
    { title: "Extracting Content Nodes", desc: "Parsing text and stripping formatting flags..." },
    { title: "Validating Schema Layout", desc: "Comparing layout hierarchies to ATS templates..." },
    { title: "Evaluating Competency Ratings", desc: "Running metrics and keywords matching..." }
  ];

  return (
    <div className="space-y-6 select-none text-left">
      <div className="pb-4 border-b border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            <h2 className="text-xl font-bold tracking-tight text-white">Upload Resume</h2>
            <p className="text-xs text-zinc-500 mt-1">Submit your PDF or DOCX file to run a deep AI audit.</p>
          </div>
        </div>
        
        {/* Remaining Quota indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono font-bold bg-zinc-900 border border-zinc-850 p-2 rounded-xl">
          <HardDrive className="w-4 h-4 text-purple-400" />
          <span>Quota: <b className="text-purple-400">{freeQuota}</b> free parses left</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Upload Box */}
        <div className="lg:col-span-7 space-y-6">
          {!isUploading ? (
            <div className="glass-panel border-zinc-800 rounded-3xl p-6 space-y-6">
              
              {/* Drag Drop Area */}
              <div 
                onClick={triggerUpload}
                className="border-2 border-dashed border-zinc-800 hover:border-purple-500/40 rounded-2xl p-4 py-10 sm:p-8 sm:py-16 flex flex-col items-center justify-center bg-zinc-950/20 text-center cursor-pointer transition relative overflow-hidden"
              >
                {/* Size Progress Indicator */}
                {fileSize && (
                  <div className="absolute top-2 left-2 right-2 text-center text-[9px] text-zinc-500">
                    Size: {fileSize}MB / 10MB limit
                    <div className="w-full h-1 bg-zinc-900 rounded-full mt-1 overflow-hidden border border-zinc-850">
                      <div style={{ width: `${Math.min(100, (fileSize / 10) * 100)}%` }} className="h-full bg-purple-500" />
                    </div>
                  </div>
                )}
                
                <CloudUpload className="w-16 h-16 text-zinc-700 hover:text-purple-500 mb-4 transition" />
                <h4 className="text-sm font-bold text-zinc-300">Drag & Drop Resume File</h4>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-[200px] leading-relaxed">
                  Accepts PDF, DOCX formatting structures. Maximum filesize 10MB.
                </p>
                
                <button 
                  type="button"
                  className="mt-6 px-4 py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-xs font-bold rounded-xl text-zinc-300 transition"
                >
                  Browse Local Files
                </button>

                <input 
                  id="file-upload-input"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Cloud mock integrations */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider block">Mock Cloud Connectors</span>
                  {cloudProvider && (
                    <span className="text-[9px] text-purple-400 font-bold">Connected: {cloudProvider}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => loadFromCloud('GoogleDrive')} className="py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-800 rounded-xl text-xs text-zinc-300 transition cursor-pointer flex items-center justify-center gap-1.5 font-semibold">
                    <span>Google Drive</span>
                  </button>
                  <button onClick={() => loadFromCloud('Dropbox')} className="py-2 bg-zinc-900 border border-zinc-850 hover:border-zinc-800 rounded-xl text-xs text-zinc-300 transition cursor-pointer flex items-center justify-center gap-1.5 font-semibold">
                    <span>Dropbox</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel border-zinc-800 rounded-3xl p-8 space-y-6">
              <div className="text-center space-y-1">
                <h4 className="text-md font-bold text-white">Auditing: {fileName}</h4>
                <p className="text-xs text-zinc-500">Please do not refresh the dashboard threads.</p>
              </div>

              <div className="space-y-4">
                {stepsList.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isDone = uploadStep > stepNum;
                  const isActive = uploadStep === stepNum;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition duration-300 ${
                        isDone 
                          ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400' 
                          : isActive 
                          ? 'bg-purple-950/20 border-purple-500/30 text-white' 
                          : 'bg-zinc-900/20 border-zinc-950 text-zinc-650'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-xs font-mono font-bold">0{stepNum}</div>
                        <div>
                          <h5 className="text-xs font-bold leading-none">{step.title}</h5>
                          <p className={`text-[9px] mt-1 ${isActive ? 'text-zinc-400' : 'text-zinc-650'}`}>{step.desc}</p>
                        </div>
                      </div>
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-zinc-800" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Configuration Side-panel */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel border-zinc-800 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Custom Scan Settings</span>
              </span>
              <button onClick={() => setShowConfig(!showConfig)} className="text-[10px] text-zinc-500 hover:text-white font-bold">{showConfig ? 'Hide' : 'Configure'}</button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Strict ATS Compliance scans</span>
                <input type="checkbox" checked={strictMode} onChange={() => setStrictMode(!strictMode)} className="accent-purple-500" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Grammar & spelling analysis</span>
                <input type="checkbox" checked={grammarScan} onChange={() => setGrammarScan(!grammarScan)} className="accent-purple-500" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">SSL Sandbox Encryption active</span>
                <input type="checkbox" checked={sslActive} onChange={() => setSslActive(!sslActive)} className="accent-purple-500" />
              </div>
              
              {showConfig && (
                <div className="pt-2 border-t border-zinc-900 space-y-2 animate-slide-in">
                  <label className="text-[9px] uppercase font-bold text-zinc-550 block">OCR Scanning Engine</label>
                  <select 
                    value={ocrEngine} 
                    onChange={(e) => setOcrEngine(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-1.5 text-zinc-400 outline-none"
                  >
                    <option>Standard Tesseract</option>
                    <option>Google Cloud Vision OCR</option>
                    <option>Offline local fallback</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {parsedMetadata && (
            <div className="glass-panel border-zinc-800 rounded-3xl p-5 space-y-3 animate-slide-in">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Parsed Document Metadata</span>
              </span>
              <div className="space-y-1.5 font-mono text-[10px] text-zinc-400">
                <p>Creator Tool: <b className="text-white">{parsedMetadata.creator}</b></p>
                <p>Parsed Word Count: <b className="text-white">{parsedMetadata.words}</b></p>
                <p>Total Line count: <b className="text-white">{parsedMetadata.lines}</b></p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
