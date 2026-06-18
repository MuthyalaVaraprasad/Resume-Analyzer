import React, { useState, useRef } from 'react';
import { useApp, type CVData } from '../context/AppContext';
import { 
  Printer, Plus, Trash, Upload, Download, ArrowLeft, Copy, Check
} from 'lucide-react';

export const Builder: React.FC = () => {
  const { 
    currentCV, 
    updateCurrentCV, 
    setCurrentCVData,
    activeTemplate, 
    setActiveTemplate, 
    activeFont, 
    setActiveFont,
    addNotification,
    setActiveTab: setGlobalActiveTab,
    triggerAdminAction
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'exp' | 'edu' | 'skills' | 'custom' | 'print'>('info');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Print Style States
  const [margins, setMargins] = useState(24); // px
  const [fontSize, setFontSize] = useState(11); // px
  const [printTheme, setPrintTheme] = useState<'Classic' | 'Warm' | 'Cool'>('Classic');
  const [previewMode, setPreviewMode] = useState<'default' | 'markdown' | 'latex'>('default');
  const [isCopied, setIsCopied] = useState(false);
  const [summaryTone, setSummaryTone] = useState('Professional');

  const fontsList = [
    'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Nunito', 'Lato', 
    'Open Sans', 'Merriweather', 'Playfair Display', 'DM Sans', 
    'Ubuntu', 'Work Sans', 'Raleway', 'Lora'
  ];

  const templatesList = [
    'Modern', 'Corporate', 'Executive', 'Software', 'Full Stack', 
    'Frontend', 'Backend', 'Data Analyst', 'Data Scientist', 'AI Engineer', 
    'Creative', 'Startup', 'Internship'
  ];

  const skillSuggestions = [
    "Kubernetes", "Docker", "AWS", "CI/CD", "GraphQL", "Next.js", "Tailwind CSS", "TypeScript", "System Design", "Go", "Redis"
  ];

  // Dynamic ATS Score Predictor logic
  const calculatePredictedScore = () => {
    let score = 50; // base score
    if (currentCV.summary.length > 100) score += 10;
    if (currentCV.experience.length >= 2) score += 15;
    if (currentCV.skills.length >= 8) score += 15;
    
    // Check for target keywords
    const keywords = ["kubernetes", "docker", "aws", "ci/cd", "graphql", "system design"];
    const textLower = JSON.stringify(currentCV).toLowerCase();
    keywords.forEach(kw => {
      if (textLower.includes(kw)) score += 3;
    });

    return Math.min(100, score);
  };

  const predictedScore = calculatePredictedScore();

  // Metrics and Counters
  const summaryWordCount = currentCV.summary.split(/\s+/).filter(Boolean).length;
  const summaryCharCount = currentCV.summary.length;
  const totalCVWords = JSON.stringify(currentCV).split(/\s+/).filter(Boolean).length;
  const visualClutterIndex = Math.min(100, Math.round((totalCVWords / 600) * 100)); // Target ~600 words for single page

  // Custom summary tone adjustment
  const handleToneChange = (tone: string) => {
    setSummaryTone(tone);
    triggerAdminAction(`[TONE] Switching resume summary to ${tone} tonality.`);
    
    let updatedSummary = currentCV.summary;
    if (tone === 'Startup') {
      updatedSummary = "High-velocity builder and software engineer specializing in scaling zero-to-one SaaS apps. Expert at React 19, GraphQL, and deploying clean code stacks to AWS.";
    } else if (tone === 'Executive') {
      updatedSummary = "Principal Architect with a proven track record of orchestrating enterprise digital transformations, managing $2M hardware budgets, and mentoring multi-disciplinary squads.";
    } else {
      updatedSummary = "Driven and innovative Senior Software Engineer with over 6 years of experience building scalable web applications. Expert in React, TypeScript, Node.js, and cloud architectures.";
    }
    
    updateCurrentCV(prev => ({
      ...prev,
      summary: updatedSummary
    }));
    addNotification("Summary Tone Shifted", `Updated professional summary to a ${tone} tone.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const addExperience = () => {
    updateCurrentCV(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: 'exp-' + Date.now(),
          role: "Senior Developer",
          company: "Tech Corp",
          duration: "2024 - Present",
          bullets: ["Spearheaded scaling of UI endpoints, boosting core page load benchmarks by 20%."]
        }
      ]
    }));
    triggerAdminAction("[BUILDER] Added new work experience block.");
  };

  const deleteExperience = (id: string) => {
    updateCurrentCV(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
    triggerAdminAction("[BUILDER] Deleted work experience block.");
  };

  const addEducation = () => {
    updateCurrentCV(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: 'edu-' + Date.now(),
          degree: "B.S. in Computer Science",
          school: "State University",
          duration: "2020",
          gpa: "3.8"
        }
      ]
    }));
  };

  const deleteEducation = (id: string) => {
    updateCurrentCV(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  const addSkillChip = (skillName: string) => {
    if (currentCV.skills.includes(skillName)) return;
    updateCurrentCV(prev => ({
      ...prev,
      skills: [...prev.skills, skillName]
    }));
    addNotification("Skill Added", `Added '${skillName}' tag to skills grid.`);
    triggerAdminAction(`[BUILDER] Added skill tag: ${skillName}`);
  };

  // Export JSON Schema
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCV, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentCV.name.replace(/\s+/g, '_')}_Schema.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addNotification("Export Successful", "Downloaded CV JSON schema.");
  };

  // Import JSON Schema
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.name && parsed.experience) {
            setCurrentCVData(parsed);
            addNotification("Import Successful", `Loaded CV schema for: ${parsed.name}`);
            triggerAdminAction(`[BUILDER] Loaded raw JSON schema for user: ${parsed.name}`);
          } else {
            alert("Invalid JSON format. Must contain standard CV schemas.");
          }
        } catch (err) {
          alert("Error reading JSON file.");
        }
      };
      reader.readAsText(files[0]);
    }
  };

  // Profile templates auto-fill triggers
  const handleAutoFill = (type: 'dev' | 'finance' | 'pm') => {
    let mockData: CVData;
    if (type === 'dev') {
      mockData = {
        name: "Marcus Aurelius",
        title: "Staff Frontend Engineer",
        email: "marcus.dev@techstack.io",
        phone: "+1 (555) 489-3281",
        website: "github.com/marcusdev",
        location: "Seattle, WA",
        summary: "High-performing Staff Frontend Developer with 8 years of experience building responsive client interfaces. Master in React 19, Tailwind CSS v4, NextJS, and GraphQL.",
        experience: [
          { id: "exp-1", role: "Staff Frontend Developer", company: "WebVibe Corp", duration: "2022 - Present", bullets: ["Engineered modular React 19 UI component library used across 12 product divisions.", "Implemented core rendering performance configurations, cutting bundle sizes by 45%."] }
        ],
        education: [{ id: "edu-1", degree: "B.S. in Software Engineering", school: "University of Washington", duration: "2014 - 2018" }],
        skills: ["React 19", "TypeScript", "Tailwind CSS", "Next.js", "GraphQL", "Webpack", "CSS Grid"],
        projects: [], certifications: ["AWS Solutions Certified"], achievements: [], languages: [], interests: []
      };
    } else if (type === 'finance') {
      mockData = {
        name: "Charlotte Vance",
        title: "Senior Financial Analyst",
        email: "charlotte.vance@capitalgrowth.com",
        phone: "+1 (555) 302-8942",
        website: "linkedin.com/in/charlottev",
        location: "New York, NY",
        summary: "Analytically-driven Senior Financial Analyst with 6+ years of expertise in corporate budgeting, investment audits, and capital risk management.",
        experience: [
          { id: "exp-1", role: "Senior Financial Analyst", company: "Capital Growth Group", duration: "2021 - Present", bullets: ["Managed $14M yearly operational budget forecasting, resolving $450k overhead leaks.", "Designed SQL dashboard auditing investment portfolio gains, speeding up weekly reporting by 60%."] }
        ],
        education: [{ id: "edu-1", degree: "M.S. in Finance", school: "Columbia University", duration: "2018 - 2020" }],
        skills: ["Financial Modeling", "Corporate Budgeting", "SQL", "Excel", "PowerBI", "Risk Audits"],
        projects: [], certifications: [], achievements: [], languages: [], interests: []
      };
    } else {
      mockData = {
        name: "Sarah Jenkins",
        title: "Lead Product Manager",
        email: "sarah.jenkins@productcore.io",
        phone: "+1 (555) 789-0123",
        website: "sarahjenkins.co",
        location: "Austin, TX",
        summary: "Product Leader with 7+ years of experience launching mobile app SaaS features. Proven expertise defining product roadmaps, auditing user metrics, and coordinating Agile developers.",
        experience: [
          { id: "exp-1", role: "Lead Product Manager", company: "ProductCore Tech", duration: "2022 - Present", bullets: ["Owned product roadmap for mobile checkout application with $4.5M ARR volume.", "Coordinated 12 developers and 2 UI/UX designers to launch 8 core features in 6 months."] }
        ],
        education: [{ id: "edu-1", degree: "B.A. in Business Administration", school: "University of Texas", duration: "2013 - 2017" }],
        skills: ["Product Roadmap", "Agile methodologies", "User Telemetry", "A/B Testing", "SQL", "Figma"],
        projects: [], certifications: [], achievements: [], languages: [], interests: []
      };
    }
    setCurrentCVData(mockData);
    addNotification("Builder Auto-Filled", `Loaded ${mockData.name} (${mockData.title}) profile.`);
    triggerAdminAction(`[BUILDER] Auto-filled mock template for: ${mockData.name}`);
  };

  // Custom list modifiers for certifications
  const handleAddCert = () => {
    updateCurrentCV(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), "New Professional Certification"]
    }));
  };

  const handleUpdateCert = (idx: number, val: string) => {
    updateCurrentCV(prev => {
      const certs = [...(prev.certifications || [])];
      certs[idx] = val;
      return { ...prev, certifications: certs };
    });
  };

  const handleDeleteCert = (idx: number) => {
    updateCurrentCV(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx)
    }));
  };

  // Bullet point verb validator check
  const checkBulletQuality = (text: string) => {
    const passiveWords = ["responsible", "helped", "assisted", "did"];
    const textLower = text.toLowerCase();
    const hasPassive = passiveWords.some(w => textLower.includes(w));
    if (text.length < 15) return "bg-red-500"; // Too short
    if (hasPassive) return "bg-yellow-500"; // Weak verb
    return "bg-emerald-500"; // Strong verb
  };

  // Markdown builder
  const generateMarkdown = () => {
    return `# ${currentCV.name}
## ${currentCV.title}

- Email: ${currentCV.email}
- Phone: ${currentCV.phone}
- Location: ${currentCV.location}
- Website: ${currentCV.website || 'N/A'}

### PROFESSIONAL SUMMARY
${currentCV.summary}

### WORK EXPERIENCE
${currentCV.experience.map(exp => `#### ${exp.role} @ ${exp.company} (${exp.duration})
${exp.bullets.map(b => `- ${b}`).join('\n')}`).join('\n\n')}

### EDUCATION
${currentCV.education.map(edu => `- ${edu.degree} from ${edu.school} (${edu.duration})`).join('\n')}

### TECHNICAL SKILLS
${currentCV.skills.join(', ')}
`;
  };

  // LaTeX builder
  const generateLatex = () => {
    return `\\documentclass{article}
\\usepackage{geometry}
\\geometry{margin=1in}
\\begin{document}
\\textbf{\\Huge ${currentCV.name}} \\\\
\\textit{${currentCV.title}} \\\\
\\rule{\\linewidth}{0.4pt}

\\textbf{Contact:} ${currentCV.email} | ${currentCV.phone} | ${currentCV.location}

\\section*{Professional Summary}
${currentCV.summary}

\\section*{Work Experience}
${currentCV.experience.map(exp => `\\textbf{${exp.role}} at \\textbf{${exp.company}} (${exp.duration}) \\\\
\\begin{itemize}
${exp.bullets.map(b => `  \\item ${b}`).join('\n')}
\\end{itemize}`).join('\n\n')}

\\section*{Education}
${currentCV.education.map(edu => `\\textbf{${edu.degree}} -- ${edu.school} (${edu.duration})`).join('\n')}

\\section*{Skills}
${currentCV.skills.join(', ')}
\\end{document}`;
  };

  const handleCopySchemaText = () => {
    const text = previewMode === 'markdown' ? generateMarkdown() : generateLatex();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    triggerAdminAction(`[COPY] Copied ${previewMode} schema output.`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Style logic for print themes
  const getStyleForTheme = () => {
    if (printTheme === 'Warm') {
      return {
        fontFamily: "'Georgia', serif",
        color: "#27272a",
        backgroundColor: "#fafaf9",
        padding: `${margins}px`,
        fontSize: `${fontSize}px`
      };
    }
    if (printTheme === 'Cool') {
      return {
        fontFamily: "'Trebuchet MS', sans-serif",
        color: "#18181b",
        backgroundColor: "#f4f4f5",
        padding: `${margins}px`,
        fontSize: `${fontSize}px`
      };
    }
    return {
      fontFamily: `'${activeFont}', 'Segoe UI', sans-serif`,
      color: "#09090b",
      backgroundColor: "#ffffff",
      padding: `${margins}px`,
      fontSize: `${fontSize}px`
    };
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-900 gap-4 text-left">
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => setGlobalActiveTab('dashboard')}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition flex items-center justify-center font-bold text-xs"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div className="text-left">
            <h2 className="text-xl font-bold tracking-tight text-white">Live Resume Builder</h2>
            <p className="text-xs text-zinc-500 mt-1">Real-time auto-saves cached on local threads.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <div className="px-2.5 py-1.5 bg-purple-950/20 border border-purple-500/20 text-purple-400 font-bold font-mono text-[10px] rounded-lg">
            Predictive ATS: {predictedScore}%
          </div>

          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition"
            title="Import JSON Schema"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={importJSON} 
            accept=".json" 
            className="hidden" 
          />

          <button 
            type="button"
            onClick={exportJSON}
            className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-400 hover:text-white transition"
            title="Export JSON Schema"
          >
            <Download className="w-4 h-4" />
          </button>

          <button 
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-350 hover:text-white rounded-xl text-xs font-bold transition flex items-center space-x-2"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Editor Form Columns (5/12 width) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="flex border-b border-zinc-900 text-xs font-semibold overflow-x-auto no-scrollbar gap-2">
            {[
              { id: 'info', label: 'Contact' },
              { id: 'exp', label: 'Experience' },
              { id: 'edu', label: 'Education' },
              { id: 'skills', label: 'Skills' },
              { id: 'custom', label: 'Certifications' },
              { id: 'print', label: 'Print & Extras' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 px-1 border-b-2 transition shrink-0 ${
                  activeTab === tab.id 
                    ? 'border-purple-500 text-white' 
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/50">
            {activeTab === 'info' && (
              <div className="space-y-3">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={currentCV.name} 
                    onChange={(e) => updateCurrentCV(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs focus:border-purple-500 outline-none text-white" 
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Job Title</label>
                  <input 
                    type="text" 
                    value={currentCV.title} 
                    onChange={(e) => updateCurrentCV(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs focus:border-purple-500 outline-none text-white" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Email</label>
                    <input 
                      type="email" 
                      value={currentCV.email} 
                      onChange={(e) => updateCurrentCV(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs focus:border-purple-500 outline-none text-white" 
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Phone</label>
                    <input 
                      type="text" 
                      value={currentCV.phone} 
                      onChange={(e) => updateCurrentCV(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs focus:border-purple-500 outline-none text-white" 
                    />
                  </div>
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase">
                    <label>Professional Summary</label>
                    <span>{summaryWordCount} words / {summaryCharCount} chars</span>
                  </div>
                  <textarea 
                    value={currentCV.summary} 
                    onChange={(e) => updateCurrentCV(prev => ({ ...prev, summary: e.target.value }))}
                    rows={4} 
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs focus:border-purple-500 outline-none resize-none leading-relaxed text-white" 
                  />
                </div>
              </div>
            )}

            {activeTab === 'exp' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Experience list</span>
                  <button 
                    type="button"
                    onClick={addExperience}
                    className="p-1.5 text-purple-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Position</span>
                  </button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar text-left">
                  {currentCV.experience.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-2 relative">
                      <button 
                        type="button"
                        onClick={() => deleteExperience(item.id)}
                        className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="Role" 
                          value={item.role} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentCV(prev => {
                              const exp = [...prev.experience];
                              exp[idx].role = val;
                              return { ...prev, experience: exp };
                            });
                          }}
                          className="bg-zinc-955 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none focus:border-purple-500 text-white"
                        />
                        <input 
                          type="text" 
                          placeholder="Company" 
                          value={item.company} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentCV(prev => {
                              const exp = [...prev.experience];
                              exp[idx].company = val;
                              return { ...prev, experience: exp };
                            });
                          }}
                          className="bg-zinc-955 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none focus:border-purple-500 text-white"
                        />
                      </div>
                      
                      <input 
                        type="text" 
                        placeholder="Duration" 
                        value={item.duration} 
                        onChange={(e) => {
                          const val = e.target.value;
                          updateCurrentCV(prev => {
                            const exp = [...prev.experience];
                            exp[idx].duration = val;
                            return { ...prev, experience: exp };
                          });
                        }}
                        className="w-full bg-zinc-955 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none focus:border-purple-500 text-white"
                      />

                      {/* Bullet point with Quality indicators */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-bold">
                          <span>Outcomes description</span>
                          <span className="flex items-center space-x-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${checkBulletQuality(item.bullets.join(' '))}`} />
                            <span>Quality Check</span>
                          </span>
                        </div>
                        <textarea 
                          placeholder="Bullet point outcomes" 
                          value={item.bullets.join('\n')} 
                          rows={2}
                          onChange={(e) => {
                            const val = e.target.value.split('\n');
                            updateCurrentCV(prev => {
                              const exp = [...prev.experience];
                              exp[idx].bullets = val;
                              return { ...prev, experience: exp };
                            });
                          }}
                          className="w-full bg-zinc-955 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none resize-none focus:border-purple-500 font-sans leading-normal text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'edu' && (
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Education list</span>
                  <button 
                    type="button"
                    onClick={addEducation}
                    className="p-1.5 text-purple-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                  {currentCV.education.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-zinc-900/25 border border-zinc-900 rounded-xl space-y-2 relative">
                      <button 
                        type="button"
                        onClick={() => deleteEducation(item.id)}
                        className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="Degree" 
                          value={item.degree} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentCV(prev => {
                              const edu = [...prev.education];
                              edu[idx].degree = val;
                              return { ...prev, education: edu };
                            });
                          }}
                          className="bg-zinc-955 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none focus:border-purple-500 text-white"
                        />
                        <input 
                          type="text" 
                          placeholder="School" 
                          value={item.school} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentCV(prev => {
                              const edu = [...prev.education];
                              edu[idx].school = val;
                              return { ...prev, education: edu };
                            });
                          }}
                          className="bg-zinc-955 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none focus:border-purple-500 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          placeholder="Duration" 
                          value={item.duration} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentCV(prev => {
                              const edu = [...prev.education];
                              edu[idx].duration = val;
                              return { ...prev, education: edu };
                            });
                          }}
                          className="bg-zinc-955 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none focus:border-purple-500 text-white"
                        />
                        <input 
                          type="text" 
                          placeholder="GPA" 
                          value={item.gpa || ''} 
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentCV(prev => {
                              const edu = [...prev.education];
                              edu[idx].gpa = val;
                              return { ...prev, education: edu };
                            });
                          }}
                          className="bg-zinc-955 border border-zinc-800 rounded-lg p-1.5 text-xs outline-none focus:border-purple-500 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4 text-left">
                {/* Clickable Quick Skills Chips */}
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Add Target Skills Chips</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillSuggestions.map(skillItem => (
                      <button
                        key={skillItem}
                        type="button"
                        onClick={() => addSkillChip(skillItem)}
                        className="px-2.5 py-1 bg-zinc-900 border border-zinc-850 hover:border-purple-500/20 text-zinc-400 hover:text-white rounded-lg text-[9px] font-semibold transition"
                      >
                        + {skillItem}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Technical Skills (Comma separated)</span>
                  <textarea 
                    value={currentCV.skills.join(', ')} 
                    onChange={(e) => {
                      const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                      updateCurrentCV(prev => ({ ...prev, skills: skillsArray }));
                    }}
                    rows={4} 
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2 text-xs focus:border-purple-500 outline-none resize-none leading-relaxed text-white" 
                  />
                </div>
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Professional Certifications</span>
                  <button 
                    type="button"
                    onClick={handleAddCert}
                    className="p-1.5 text-cyan-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg flex items-center space-x-1 text-[10px] font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Certificate</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                  {(currentCV.certifications || []).map((cert, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-zinc-950 p-2 border border-zinc-900 rounded-xl">
                      <input 
                        type="text" 
                        value={cert} 
                        onChange={(e) => handleUpdateCert(idx, e.target.value)}
                        className="flex-1 bg-transparent text-xs text-white outline-none" 
                      />
                      <button 
                        type="button"
                        onClick={() => handleDeleteCert(idx)}
                        className="text-zinc-550 hover:text-red-400 transition"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(currentCV.certifications || []).length === 0 && (
                    <p className="text-[10px] text-zinc-650 text-center py-8 border border-dashed border-zinc-900 rounded-xl">
                      No certifications listed. Add to boost your credibility.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'print' && (
              <div className="space-y-4 text-left">
                {/* Auto-Fill Pre-sets */}
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Auto-Fill Mock Profile Templates</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleAutoFill('dev')} className="py-1.5 bg-zinc-900 border border-zinc-800 hover:border-purple-500/20 text-[9px] font-bold rounded-lg text-zinc-300">Software Eng</button>
                    <button onClick={() => handleAutoFill('finance')} className="py-1.5 bg-zinc-900 border border-zinc-800 hover:border-purple-500/20 text-[9px] font-bold rounded-lg text-zinc-300">Financial Analyst</button>
                    <button onClick={() => handleAutoFill('pm')} className="py-1.5 bg-zinc-900 border border-zinc-800 hover:border-purple-500/20 text-[9px] font-bold rounded-lg text-zinc-300">Product Mgr</button>
                  </div>
                </div>

                {/* Margins adjuster */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400 font-semibold">Print Canvas Padding:</span>
                    <span className="font-bold font-mono text-purple-400">{margins} px</span>
                  </div>
                  <input
                    type="range" min="10" max="60" value={margins}
                    onChange={(e) => setMargins(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer bg-zinc-900 h-1.5 rounded-full"
                  />
                </div>

                {/* Font sizes adjuster */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400 font-semibold">Print Font Scale Size:</span>
                    <span className="font-bold font-mono text-purple-400">{fontSize} px</span>
                  </div>
                  <input
                    type="range" min="8" max="18" value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer bg-zinc-900 h-1.5 rounded-full"
                  />
                </div>

                {/* Print Layout presets */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Layout Style Template</span>
                  <select 
                    value={activeTemplate}
                    onChange={(e) => setActiveTemplate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 outline-none focus:border-purple-500"
                  >
                    {templatesList.map(tpl => (
                      <option key={tpl} value={tpl}>{tpl} Layout</option>
                    ))}
                  </select>
                </div>

                {/* Font family selection */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Typography font</span>
                  <select 
                    value={activeFont}
                    onChange={(e) => setActiveFont(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 outline-none focus:border-purple-500"
                  >
                    {fontsList.map(fnt => (
                      <option key={fnt} value={fnt}>{fnt}</option>
                    ))}
                  </select>
                </div>

                {/* Print Themes Switcher */}
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Print Paper Theme Rule</span>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    {(['Classic', 'Warm', 'Cool'] as const).map(theme => (
                      <button
                        key={theme}
                        onClick={() => setPrintTheme(theme)}
                        className={`py-1.5 rounded-lg border font-bold transition ${
                          printTheme === theme 
                            ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary tone adjuster */}
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Summary Tone Optimizer</span>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    {(['Professional', 'Startup', 'Executive'] as const).map(tone => (
                      <button
                        key={tone}
                        onClick={() => handleToneChange(tone)}
                        className={`py-1.5 rounded-lg border font-bold transition ${
                          summaryTone === tone 
                            ? 'bg-purple-600/20 text-purple-300 border-purple-500/30'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual density indicator */}
                <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 uppercase">
                    <span>Layout Density Index</span>
                    <span className={visualClutterIndex <= 90 ? 'text-emerald-400' : 'text-red-400'}>
                      {visualClutterIndex}% ({visualClutterIndex <= 90 ? 'Ideal' : 'Crowded'})
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${visualClutterIndex <= 90 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                      style={{ width: `${visualClutterIndex}%` }} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Paper Canvas (7/12 width) */}
        <div className="xl:col-span-7 bg-zinc-950/20 border border-zinc-900 rounded-2xl p-4 space-y-4">
          {/* Preview selector tabs */}
          <div className="flex justify-between items-center px-1">
            <div className="flex space-x-2 p-0.5 bg-zinc-950 border border-zinc-900 rounded-lg">
              {(['default', 'markdown', 'latex'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPreviewMode(mode)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold transition uppercase ${
                    previewMode === mode
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-zinc-500 hover:text-zinc-350 border border-transparent'
                  }`}
                >
                  {mode === 'default' ? 'PDF Canvas' : mode}
                </button>
              ))}
            </div>

            {previewMode !== 'default' && (
              <button
                type="button"
                onClick={handleCopySchemaText}
                className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-350 rounded-lg text-[9px] font-bold flex items-center space-x-1.5"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-purple-400" />
                    <span>Copy Schema</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-white text-zinc-900 rounded-2xl shadow-2xl relative select-text border border-zinc-200 min-h-[600px] max-h-[720px] overflow-y-auto print:p-0 print:border-none print:shadow-none no-scrollbar">
            {previewMode === 'default' ? (
              <div style={getStyleForTheme()} className="space-y-5 text-left text-xs transition-all duration-300">
                {/* Header depending on activeTemplate layout structure */}
                <div className={`space-y-1 ${
                  activeTemplate === 'Corporate' ? 'text-center border-b pb-3 border-zinc-300' :
                  activeTemplate === 'Executive' ? 'bg-zinc-900 text-white p-4 rounded-xl -m-4 mb-4' :
                  'border-l-4 pl-3 border-purple-500'
                }`}>
                  <h3 className="text-xl font-extrabold tracking-tight">{currentCV.name}</h3>
                  <p className={`font-semibold ${activeTemplate === 'Executive' ? 'text-purple-300' : 'text-purple-600'}`}>{currentCV.title}</p>
                  
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-zinc-500 font-mono mt-1.5">
                    <span>{currentCV.email}</span>
                    <span>•</span>
                    <span>{currentCV.phone}</span>
                    <span>•</span>
                    <span>{currentCV.location}</span>
                    {currentCV.website && (
                      <>
                        <span>•</span>
                        <span>{currentCV.website}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Professional Summary</h4>
                  <p className="leading-relaxed text-[11px] text-zinc-700">{currentCV.summary}</p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Work Experience</h4>
                  <div className="space-y-3">
                    {currentCV.experience.map(item => (
                      <div key={item.id} className="space-y-1">
                        <div className="flex justify-between items-baseline font-semibold text-zinc-800 text-[11px]">
                          <span>{item.role} @ <span className="text-zinc-900">{item.company}</span></span>
                          <span className="text-[9px] text-zinc-500 font-mono font-normal">{item.duration}</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-zinc-650 leading-relaxed">
                          {item.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Education</h4>
                  <div className="space-y-1">
                    {currentCV.education.map(item => (
                      <div key={item.id} className="flex justify-between items-baseline text-[11px] text-zinc-700">
                        <span><strong className="text-zinc-900">{item.degree}</strong> – {item.school}</span>
                        {item.gpa && <span className="text-[9px] text-zinc-500 font-mono pl-1">GPA: {item.gpa}</span>}
                        <span className="text-[9px] text-zinc-500 font-mono ml-auto">{item.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications if any */}
                {(currentCV.certifications || []).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Certifications</h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-zinc-650 leading-relaxed">
                      {(currentCV.certifications || []).map((cert, idx) => (
                        <li key={idx}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Technical Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentCV.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-800 text-[9px] font-semibold rounded font-mono">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-zinc-950 text-emerald-400 font-mono text-[10px] text-left overflow-x-auto min-h-[600px] max-h-[720px] shadow-inner">
                <pre className="whitespace-pre-wrap select-all font-semibold leading-relaxed">
                  {previewMode === 'markdown' ? generateMarkdown() : generateLatex()}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
