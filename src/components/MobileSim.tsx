import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, FileText, BarChart2, CheckCircle, Smartphone, 
  ChevronRight, ArrowLeft, Send, Mic, 
  Layers, Settings, User, Bell, TrendingUp, Cpu, Award
} from 'lucide-react';

export const MobileSim: React.FC = () => {
  const { 
    currentCV, 
    user, 
    login, 
    logout, 
    cvHistory, 
    activeMobileScreen, 
    setActiveMobileScreen, 
    notifications,
    isMobileSimOpen,
    setIsMobileSimOpen
  } = useApp();

  const [onboardingStep, setOnboardingStep] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [chatFeed, setChatFeed] = useState([
    { sender: 'bot', text: 'Hello! Ask me any career or resume-related question.' }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);

  // List of all 16 mobile screens for quick navigation
  const mobileScreens = [
    { id: '01_splash', name: '01. Splash Screen' },
    { id: '02_onboarding', name: '02. Onboarding' },
    { id: '03_login', name: '03. Login Screen' },
    { id: '04_dashboard', name: '04. Dashboard' },
    { id: '05_upload', name: '05. Upload Resume' },
    { id: '06_analysis', name: '06. CV Analysis' },
    { id: '07_ats', name: '07. ATS Report' },
    { id: '08_builder', name: '08. CV Builder' },
    { id: '09_templates', name: '09. Templates' },
    { id: '10_jobmatch', name: '10. Job Match' },
    { id: '11_interview', name: '11. Interview Coach' },
    { id: '12_aichat', name: '12. AI Chat Assistant' },
    { id: '13_insights', name: '13. Career Insights' },
    { id: '14_notifications', name: '14. Notifications' },
    { id: '15_profile', name: '15. Profile Page' },
    { id: '16_settings', name: '16. Settings' }
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = { sender: 'user', text: chatMessage };
    setChatFeed(prev => [...prev, userMsg]);
    setChatMessage('');

    setTimeout(() => {
      let reply = "I can help you audit that. Ensure your bullet points start with strong action verbs like 'spearheaded' or 'architected'.";
      if (chatMessage.toLowerCase().includes('ats')) {
        reply = "ATS (Applicant Tracking Systems) screen resumes for keywords. Your current resume has a high keywords density match of 85%!";
      } else if (chatMessage.toLowerCase().includes('experience')) {
        reply = "Try listing quantifiable results in your experience section, e.g. 'Increased client retention by 15%'.";
      }
      setChatFeed(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  const runJobMatch = () => {
    if (!jobDescription.trim()) return;
    setMatchScore(null);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 20) + 72; // 72 to 92
      setMatchScore(score);
    }, 1200);
  };

  // Rendering screen layouts inside simulator
  const renderMobileContent = () => {
    switch (activeMobileScreen) {
      case '01_splash':
        return (
          <div 
            onClick={() => setActiveMobileScreen('02_onboarding')} 
            className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-zinc-950 via-purple-950 to-cyan-950 text-center p-6 cursor-pointer select-none"
          >
            <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg border border-purple-500/30 animate-pulse-glow mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 tracking-tight">CV Analyzer</h2>
            <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-mono">Resume Intelligence</p>
            <div className="absolute bottom-16 text-zinc-500 text-xs animate-pulse">Tap screen to continue</div>
          </div>
        );

      case '02_onboarding':
        const slides = [
          { title: "AI-Powered Parsing", desc: "Instantly extract details and audit keywords alignment with enterprise accuracy.", icon: <Cpu className="w-10 h-10 text-purple-400" /> },
          { title: "ATS Optimization", desc: "Gain critical analysis breakdowns and score insights of formatting, syntax, and headings.", icon: <BarChart2 className="w-10 h-10 text-cyan-400" /> },
          { title: "Interview Ready", desc: "Build tailored cover letters and practice mock interviews with real-time feedback.", icon: <Award className="w-10 h-10 text-pink-400" /> }
        ];
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white p-6 justify-between select-none">
            <div className="flex justify-between items-center text-xs text-zinc-500">
              <span>ONBOARDING</span>
              <button onClick={() => setActiveMobileScreen('03_login')} className="hover:text-white font-semibold">SKIP</button>
            </div>
            <div className="flex flex-col items-center text-center my-auto py-4">
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                {slides[onboardingStep].icon}
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white mb-3">{slides[onboardingStep].title}</h3>
              <p className="text-zinc-400 text-xs px-2 leading-relaxed">{slides[onboardingStep].desc}</p>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-center space-x-1.5">
                {slides.map((_, i) => (
                  <span 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${onboardingStep === i ? 'w-5 bg-purple-500' : 'w-1.5 bg-zinc-800'}`} 
                  />
                ))}
              </div>
              <button 
                onClick={() => {
                  if (onboardingStep < 2) {
                    setOnboardingStep(prev => prev + 1);
                  } else {
                    setActiveMobileScreen('03_login');
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 py-3 rounded-xl text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition"
              >
                {onboardingStep === 2 ? "Get Started" : "Continue"}
              </button>
            </div>
          </div>
        );

      case '03_login':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white p-6 justify-between select-none">
            <div>
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center mt-6 mb-8 border border-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">Welcome to CV Analyzer</h3>
              <p className="text-zinc-400 text-xs">Unlock all premium career features for 100% free forever.</p>
            </div>

            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => { login('Google'); setActiveMobileScreen('04_dashboard'); }}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition active:scale-95"
              >
                <span>Continue with Google</span>
              </button>
              <button 
                onClick={() => { login('GitHub'); setActiveMobileScreen('04_dashboard'); }}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition active:scale-95"
              >
                <span>Continue with GitHub</span>
              </button>
              <button 
                onClick={() => { login('LinkedIn'); setActiveMobileScreen('04_dashboard'); }}
                className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition active:scale-95"
              >
                <span>Continue with LinkedIn</span>
              </button>
            </div>

            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
              By clicking continue, you agree to our terms of service and anonymous parsing telemetry policy.
            </p>
          </div>
        );

      case '04_dashboard':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            {/* Header */}
            <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/60 backdrop-blur">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                  <img src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt="Avatar" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 leading-none">Welcome back</p>
                  <p className="text-xs font-bold leading-tight truncate max-w-[120px]">{user?.name || 'Guest User'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setActiveMobileScreen('14_notifications')} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg relative">
                  <Bell className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />
                </button>
                <button onClick={() => setActiveMobileScreen('16_settings')} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <Settings className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {/* Score card widget */}
              <div className="bg-gradient-to-r from-purple-950/40 to-cyan-950/40 border border-purple-500/20 rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-cyan-400 tracking-wider">Overall AI Rating</span>
                  <h4 className="text-lg font-extrabold">{currentCV.atsScore || 85}% Score</h4>
                  <p className="text-[10px] text-zinc-400">Your profile matches high standards.</p>
                </div>
                <div className="w-12 h-12 bg-zinc-900/60 rounded-full border border-purple-500/30 flex items-center justify-center font-bold text-md text-white font-mono shadow-inner shadow-purple-500/10">
                  {currentCV.atsScore || 85}
                </div>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 space-y-1">
                  <span className="text-[9px] text-zinc-500 font-semibold uppercase">ATS Score</span>
                  <p className="text-xl font-bold font-mono text-white">{currentCV.atsScore || 85}%</p>
                  <div className="h-1 bg-zinc-850 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${currentCV.atsScore || 85}%` }} />
                  </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 space-y-1">
                  <span className="text-[9px] text-zinc-500 font-semibold uppercase">Keywords Match</span>
                  <p className="text-xl font-bold font-mono text-white">{currentCV.keywordScore || 80}%</p>
                  <div className="h-1 bg-zinc-850 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${currentCV.keywordScore || 80}%` }} />
                  </div>
                </div>
              </div>

              {/* Navigation list */}
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 space-y-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Quick Actions</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => setActiveMobileScreen('05_upload')} className="bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-lg flex flex-col items-center justify-center space-y-1 border border-zinc-800 text-center">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Upload CV</span>
                  </button>
                  <button onClick={() => setActiveMobileScreen('06_analysis')} className="bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-lg flex flex-col items-center justify-center space-y-1 border border-zinc-800 text-center">
                    <BarChart2 className="w-4 h-4 text-cyan-400" />
                    <span>Analysis</span>
                  </button>
                  <button onClick={() => setActiveMobileScreen('08_builder')} className="bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-lg flex flex-col items-center justify-center space-y-1 border border-zinc-800 text-center">
                    <Layers className="w-4 h-4 text-pink-400" />
                    <span>CV Builder</span>
                  </button>
                  <button onClick={() => setActiveMobileScreen('10_jobmatch')} className="bg-zinc-900 hover:bg-zinc-850 p-2.5 rounded-lg flex flex-col items-center justify-center space-y-1 border border-zinc-800 text-center">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                    <span>Job Match</span>
                  </button>
                </div>
              </div>

              {/* Bot Promo Banner */}
              <div 
                onClick={() => setActiveMobileScreen('12_aichat')}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-zinc-850"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Need Resume Rewrites?</h5>
                    <p className="text-[9px] text-zinc-500">Ask the AI Chat Assistant questions.</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              </div>
            </div>

            {/* Bottom Navigation tab-bar */}
            <div className="border-t border-zinc-900 bg-zinc-950/80 backdrop-blur p-2 grid grid-cols-4 text-center text-zinc-500">
              <button onClick={() => setActiveMobileScreen('04_dashboard')} className="flex flex-col items-center py-1 text-purple-500">
                <Cpu className="w-4 h-4" />
                <span className="text-[8px] mt-0.5 font-bold">Home</span>
              </button>
              <button onClick={() => setActiveMobileScreen('08_builder')} className="flex flex-col items-center py-1 hover:text-white">
                <FileText className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Builder</span>
              </button>
              <button onClick={() => setActiveMobileScreen('12_aichat')} className="flex flex-col items-center py-1 hover:text-white">
                <Send className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Chat</span>
              </button>
              <button onClick={() => setActiveMobileScreen('15_profile')} className="flex flex-col items-center py-1 hover:text-white">
                <User className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Profile</span>
              </button>
            </div>
          </div>
        );

      case '05_upload':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center space-x-3">
              <button onClick={() => setActiveMobileScreen('04_dashboard')}><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-sm font-bold">Upload Resume</h3>
            </div>
            
            <div className="flex-1 p-6 flex flex-col justify-center space-y-6">
              <div className="border border-dashed border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center bg-zinc-900/20 py-12 text-center">
                <FileText className="w-12 h-12 text-purple-500 mb-4 animate-bounce" />
                <h4 className="text-sm font-bold text-white">Select Resume File</h4>
                <p className="text-zinc-500 text-[10px] mt-1 max-w-[180px]">Supports PDF or DOCX up to 10MB sizing.</p>
                <button 
                  onClick={() => setActiveMobileScreen('06_analysis')}
                  className="mt-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 rounded-xl text-xs font-bold shadow-md"
                >
                  Browse Device Files
                </button>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-3 space-y-2">
                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Note</span>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Your files are parsed securely on local threads. No formatting or contents are cached on global servers.
                </p>
              </div>
            </div>
          </div>
        );

      case '06_analysis':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button onClick={() => setActiveMobileScreen('04_dashboard')}><ArrowLeft className="w-4 h-4" /></button>
                <h3 className="text-sm font-bold">Resume Analysis</h3>
              </div>
              <button onClick={() => setActiveMobileScreen('07_ats')} className="text-xs text-cyan-400 font-semibold">ATS Report</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {/* radial ring */}
              <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl py-6">
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-purple-500/20">
                  <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-3xl font-extrabold text-white">{currentCV.atsScore || 85}</span>
                </div>
                <h4 className="text-sm font-bold mt-4">Great Resume Rating</h4>
                <p className="text-zinc-500 text-[10px] mt-1 text-center">Score outperforms 82% of sector competitors.</p>
              </div>

              {/* breakdown bars */}
              <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3.5 space-y-3">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Metrics Breakdown</span>
                
                {/* Meter 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">ATS Formatting</span>
                    <span>{currentCV.formattingScore || 90}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${currentCV.formattingScore || 90}%` }} />
                  </div>
                </div>

                {/* Meter 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">Grammar & Syntax</span>
                    <span>{currentCV.grammarScore || 92}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${currentCV.grammarScore || 92}%` }} />
                  </div>
                </div>

                {/* Meter 3 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-400">Technical Skills</span>
                    <span>{currentCV.technicalScore || 94}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${currentCV.technicalScore || 94}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case '07_ats':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center space-x-3">
              <button onClick={() => setActiveMobileScreen('06_analysis')}><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-sm font-bold">ATS Audit Report</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-3.5 space-y-2">
                <span className="text-[9px] uppercase font-bold text-yellow-400 tracking-widest font-mono">1 Critical Issue</span>
                <h4 className="text-xs font-bold text-white">Missing Job keywords</h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Your resume lacks keywords matching 'Kubernetes' and 'CI/CD' which were present in target job profiles.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-3.5 space-y-2">
                <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-widest font-mono">3 Checks Passed</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-zinc-300">Layout Parseable (Single-column layout)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-zinc-300">No complex visual tables or graphs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-zinc-300">Chronological format followed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case '08_builder':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex justify-between items-center">
              <h3 className="text-sm font-bold">Mobile Resume Builder</h3>
              <button onClick={() => setActiveMobileScreen('09_templates')} className="text-xs text-purple-400 font-bold">Presets</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={currentCV.name} 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs focus:border-purple-500 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Job Title</label>
                  <input 
                    type="text" 
                    defaultValue={currentCV.title} 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs focus:border-purple-500 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Summary</label>
                  <textarea 
                    defaultValue={currentCV.summary} 
                    rows={3} 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs focus:border-purple-500 outline-none resize-none" 
                  />
                </div>
              </div>

              <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl text-xs font-bold">
                Save Resume Changes
              </button>
            </div>

            {/* Bottom Tab Bar */}
            <div className="border-t border-zinc-900 bg-zinc-950/80 backdrop-blur p-2 grid grid-cols-4 text-center text-zinc-500">
              <button onClick={() => setActiveMobileScreen('04_dashboard')} className="flex flex-col items-center py-1 hover:text-white">
                <Cpu className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Home</span>
              </button>
              <button onClick={() => setActiveMobileScreen('08_builder')} className="flex flex-col items-center py-1 text-purple-500">
                <FileText className="w-4 h-4" />
                <span className="text-[8px] mt-0.5 font-bold">Builder</span>
              </button>
              <button onClick={() => setActiveMobileScreen('12_aichat')} className="flex flex-col items-center py-1 hover:text-white">
                <Send className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Chat</span>
              </button>
              <button onClick={() => setActiveMobileScreen('15_profile')} className="flex flex-col items-center py-1 hover:text-white">
                <User className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Profile</span>
              </button>
            </div>
          </div>
        );

      case '09_templates':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center space-x-3">
              <button onClick={() => setActiveMobileScreen('08_builder')}><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-sm font-bold">Select Template</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 no-scrollbar">
              {['Modern', 'Corporate', 'Executive', 'Software', 'Creative', 'Finance'].map((tpl, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveMobileScreen('08_builder')}
                  className="border border-zinc-800 rounded-xl p-3 bg-zinc-900/40 text-center hover:border-purple-500/50 cursor-pointer transition"
                >
                  <div className="w-full h-20 bg-zinc-850 rounded-lg border border-zinc-800 mb-2 flex flex-col justify-center items-center">
                    <FileText className="w-6 h-6 text-zinc-650" />
                  </div>
                  <span className="text-xs font-bold">{tpl} Style</span>
                </div>
              ))}
            </div>
          </div>
        );

      case '10_jobmatch':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center space-x-3">
              <button onClick={() => setActiveMobileScreen('04_dashboard')}><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-sm font-bold">Job Match Scanner</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase">Job Description</label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job listing text here..."
                  rows={4} 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs focus:border-purple-500 outline-none resize-none" 
                />
              </div>

              <button 
                onClick={runJobMatch}
                disabled={!jobDescription.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
              >
                Scan Match Rating
              </button>

              {matchScore !== null && (
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-4 text-center space-y-2 animate-float">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Scan results</span>
                  <div className="text-3xl font-extrabold text-white">{matchScore}% Match</div>
                  <p className="text-[10px] text-zinc-400">Hiring Probability is highly favorable.</p>
                </div>
              )}
            </div>
          </div>
        );

      case '11_interview':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center space-x-3">
              <button onClick={() => setActiveMobileScreen('04_dashboard')}><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-sm font-bold">AI Interview Practice</h3>
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between items-center text-center">
              <div className="space-y-2 mt-4">
                <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Question 01 of 05</span>
                <p className="text-sm font-semibold px-2">"Can you describe a challenging bug you resolved and how you audited it?"</p>
              </div>

              {/* Pulsing indicator */}
              <div className="w-24 h-24 relative flex items-center justify-center">
                {isRecording && (
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
                )}
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border transition ${isRecording ? 'bg-red-500 border-red-400' : 'bg-purple-600 border-purple-500 hover:bg-purple-700'}`}
                >
                  {isRecording ? <div className="w-4 h-4 bg-white rounded-sm" /> : <Mic className="w-6 h-6 text-white" />}
                </button>
              </div>

              <div className="w-full">
                <p className="text-xs text-zinc-400 mb-4">{isRecording ? "Listening to your response... (Speak now)" : "Tap microphone to record voice response"}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg font-semibold">Skip Question</button>
                  <button onClick={() => alert('Mock recording evaluated! Score: 85/100')} className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg font-semibold text-purple-400">Finish and Score</button>
                </div>
              </div>
            </div>
          </div>
        );

      case '12_aichat':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            {/* Header */}
            <div className="p-4 border-b border-zinc-900 flex items-center space-x-2 bg-zinc-950/60 backdrop-blur">
              <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-xs font-bold">AI Chat Assistant</h3>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-xs">
              {chatFeed.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-purple-600 text-white rounded-br-none' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-zinc-900 bg-zinc-950 flex items-center space-x-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder="Ask details..." 
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-500"
              />
              <button 
                onClick={handleSendMessage}
                className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center hover:bg-purple-700 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Bottom Tab Bar */}
            <div className="border-t border-zinc-900 bg-zinc-950/80 backdrop-blur p-2 grid grid-cols-4 text-center text-zinc-500">
              <button onClick={() => setActiveMobileScreen('04_dashboard')} className="flex flex-col items-center py-1 hover:text-white">
                <Cpu className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Home</span>
              </button>
              <button onClick={() => setActiveMobileScreen('08_builder')} className="flex flex-col items-center py-1 hover:text-white">
                <FileText className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Builder</span>
              </button>
              <button onClick={() => setActiveMobileScreen('12_aichat')} className="flex flex-col items-center py-1 text-purple-500">
                <Send className="w-4 h-4" />
                <span className="text-[8px] mt-0.5 font-bold">Chat</span>
              </button>
              <button onClick={() => setActiveMobileScreen('15_profile')} className="flex flex-col items-center py-1 hover:text-white">
                <User className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Profile</span>
              </button>
            </div>
          </div>
        );

      case '13_insights':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center space-x-3">
              <button onClick={() => setActiveMobileScreen('04_dashboard')}><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-sm font-bold">AI Career Insights</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-3.5 space-y-1">
                <span className="text-[9px] uppercase font-bold text-cyan-400 font-mono">Salary Predictor</span>
                <h4 className="text-lg font-bold font-mono">$130,000 - $165,000</h4>
                <p className="text-[9px] text-zinc-500">Based on location: San Francisco, CA & skills</p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-900 rounded-xl p-3.5 space-y-2">
                <span className="text-[9px] uppercase font-bold text-purple-400 font-mono">Development Roadmap</span>
                <div className="space-y-3 text-xs pt-1">
                  <div className="border-l border-zinc-800 pl-3 relative pb-2">
                    <span className="absolute -left-1.5 top-0.5 w-3 h-3 bg-purple-500 rounded-full border border-zinc-950" />
                    <h5 className="font-bold">Master Kubernetes (Skills Gap)</h5>
                    <p className="text-[10px] text-zinc-500">Suggested course: CKAD Bootcamp</p>
                  </div>
                  <div className="border-l border-zinc-800 pl-3 relative pb-2">
                    <span className="absolute -left-1.5 top-0.5 w-3 h-3 bg-cyan-400 rounded-full border border-zinc-950" />
                    <h5 className="font-bold">System Architect Cert</h5>
                    <p className="text-[10px] text-zinc-500">Estimated duration: 3 weeks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case '14_notifications':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button onClick={() => setActiveMobileScreen('04_dashboard')}><ArrowLeft className="w-4 h-4" /></button>
                <h3 className="text-sm font-bold">Notifications</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded-lg border text-xs relative ${notif.unread ? 'bg-purple-950/20 border-purple-500/20' : 'bg-zinc-900/30 border-zinc-900'}`}
                >
                  {notif.unread && <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-purple-500 rounded-full" />}
                  <h4 className="font-bold text-white mb-0.5">{notif.title}</h4>
                  <p className="text-zinc-400 text-[10px] leading-relaxed">{notif.message}</p>
                  <span className="text-[8px] text-zinc-600 block mt-1 font-mono">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case '15_profile':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex justify-between items-center">
              <h3 className="text-sm font-bold">User Profile</h3>
              <button onClick={logout} className="text-xs text-red-400 font-semibold">Sign Out</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-center">
              <div className="flex flex-col items-center py-4 space-y-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/40">
                  <img src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt="Avatar" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{user?.name || 'Guest User'}</h4>
                  <p className="text-[10px] text-zinc-500">{user?.email || 'not.authenticated@free.com'}</p>
                </div>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 text-left space-y-2.5">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Account Metrics</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-zinc-900 p-2.5 rounded-lg">
                    <p className="text-[10px] text-zinc-500">Resumes Uploaded</p>
                    <p className="text-md font-bold text-white mt-1">{cvHistory.length}</p>
                  </div>
                  <div className="bg-zinc-900 p-2.5 rounded-lg">
                    <p className="text-[10px] text-zinc-500">Average Rating</p>
                    <p className="text-md font-bold text-purple-400 mt-1">{currentCV.atsScore || 85}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Tab Bar */}
            <div className="border-t border-zinc-900 bg-zinc-950/80 backdrop-blur p-2 grid grid-cols-4 text-center text-zinc-500">
              <button onClick={() => setActiveMobileScreen('04_dashboard')} className="flex flex-col items-center py-1 hover:text-white">
                <Cpu className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Home</span>
              </button>
              <button onClick={() => setActiveMobileScreen('08_builder')} className="flex flex-col items-center py-1 hover:text-white">
                <FileText className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Builder</span>
              </button>
              <button onClick={() => setActiveMobileScreen('12_aichat')} className="flex flex-col items-center py-1 hover:text-white">
                <Send className="w-4 h-4" />
                <span className="text-[8px] mt-0.5">Chat</span>
              </button>
              <button onClick={() => setActiveMobileScreen('15_profile')} className="flex flex-col items-center py-1 text-purple-500">
                <User className="w-4 h-4" />
                <span className="text-[8px] mt-0.5 font-bold">Profile</span>
              </button>
            </div>
          </div>
        );

      case '16_settings':
        return (
          <div className="flex flex-col h-full bg-zinc-950 text-white select-none">
            <div className="p-4 border-b border-zinc-900 flex items-center space-x-3">
              <button onClick={() => setActiveMobileScreen('04_dashboard')}><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="text-sm font-bold">Mobile Settings</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div className="space-y-3 text-xs">
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold">System Dark Mode</h5>
                    <p className="text-[9px] text-zinc-500">Always enabled on device</p>
                  </div>
                  <span className="w-8 h-4 bg-purple-600 rounded-full relative flex items-center justify-end px-0.5"><span className="w-3.5 h-3.5 bg-white rounded-full" /></span>
                </div>

                <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold">Push Alerts</h5>
                    <p className="text-[9px] text-zinc-500">Receive alerts when scans complete</p>
                  </div>
                  <span className="w-8 h-4 bg-purple-600 rounded-full relative flex items-center justify-end px-0.5"><span className="w-3.5 h-3.5 bg-white rounded-full" /></span>
                </div>

                <button 
                  onClick={() => { localStorage.clear(); alert('Local storage cleared!'); window.location.reload(); }}
                  className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 rounded-xl font-bold text-red-400 text-center"
                >
                  Clear Cached Telemetries
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isMobileSimOpen) {
    return (
      <button 
        onClick={() => setIsMobileSimOpen(true)}
        className="hidden lg:flex fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-purple-600 to-cyan-500 text-white p-4 rounded-full shadow-lg border border-purple-400/30 hover:scale-105 active:scale-95 transition items-center space-x-2 font-bold text-xs"
      >
        <Smartphone className="w-4 h-4" />
        <span>Mobile App (16 Screens)</span>
      </button>
    );
  }

  return (
    <div className="w-[340px] hidden lg:block shrink-0 sticky top-24 select-none mr-2">
      {/* Selector drop-down wrapper */}
      <div className="glass-panel border border-zinc-800/80 rounded-2xl p-3 mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-wider flex items-center space-x-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Simulator</span>
          </span>
          <button 
            onClick={() => setIsMobileSimOpen(false)} 
            className="text-[10px] text-zinc-500 hover:text-white font-semibold"
          >
            HIDE
          </button>
        </div>
        
        <div className="space-y-1">
          <label className="text-[9px] text-zinc-500 font-bold uppercase block">Mobile Screen Selector</label>
          <select 
            value={activeMobileScreen} 
            onChange={(e) => setActiveMobileScreen(e.target.value)}
            className="w-full bg-zinc-900/90 text-xs border border-zinc-800 rounded-lg p-1.5 font-medium outline-none text-zinc-300 focus:border-purple-500"
          >
            {mobileScreens.map(scr => (
              <option key={scr.id} value={scr.id}>{scr.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* iPhone Outer Chassis Shell */}
      <div className="w-[280px] h-[550px] mx-auto bg-zinc-900 border-4 border-zinc-800 rounded-[36px] relative overflow-hidden phone-shadow select-none">
        {/* Notch Speaker and Camera */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-800 rounded-b-xl z-50 flex justify-center items-center">
          <span className="w-8 h-1 bg-zinc-900 rounded-full mr-2" />
          <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
        </div>

        {/* Top Status Bar */}
        <div className="absolute top-4 inset-x-0 h-4 px-5 z-40 flex justify-between items-center text-[9px] font-mono text-zinc-500 select-none">
          <span>9:41</span>
          <div className="flex space-x-1 items-center">
            <span>5G</span>
            <span className="w-4 h-2 border border-zinc-600 rounded-sm relative flex items-center p-0.5"><span className="h-full w-2.5 bg-zinc-500 rounded-[1px]" /></span>
          </div>
        </div>

        {/* Glossy glare screen wrapper */}
        <div className="absolute inset-0 z-30 pointer-events-none phone-glare" />

        {/* Screen container view */}
        <div className="w-full h-full pt-8 pb-3 relative z-10">
          {renderMobileContent()}
        </div>

        {/* iPhone Home Swipe Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-zinc-800 rounded-full z-40" />
      </div>
    </div>
  );
};
