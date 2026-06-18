import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RadialGauge, RadarChart, LineChart } from '../components/CustomCharts';
import { 
  Sparkles, FileText, ChevronRight, AlertCircle, 
  Download, RefreshCw, CheckCircle2, ThumbsUp, ThumbsDown, 
  Plus, Trash2, Edit2, Calendar
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentCV, setActiveTab, setCurrentCVData, triggerAdminAction } = useApp();

  // New states for interactive features
  const [targetScore, setTargetScore] = useState(90);
  const [weeklyScans] = useState([3, 4, 2, 5, 3, 2, 4]);
  const [activeNotifIndex, setActiveNotifIndex] = useState(0);
  const [notes, setNotes] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboard_user_notes');
    return saved ? JSON.parse(saved) : ["Prepare for Google technical interview.", "Incorporate Kubernetes metrics."];
  });
  const [newNote, setNewNote] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileName, setProfileName] = useState(currentCV.name);
  const [profileTitle, setProfileTitle] = useState(currentCV.title);
  const [feedbackRates, setFeedbackRates] = useState<Record<string, 'up' | 'down' | null>>({});

  const saveNotes = (updated: string[]) => {
    setNotes(updated);
    localStorage.setItem('dashboard_user_notes', JSON.stringify(updated));
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updated = [...notes, newNote.trim()];
    saveNotes(updated);
    setNewNote('');
    triggerAdminAction(`[NOTE] Added dashboard task note.`);
  };

  const handleDeleteNote = (idx: number) => {
    const updated = notes.filter((_, i) => i !== idx);
    saveNotes(updated);
  };

  const handleProfileUpdate = () => {
    setCurrentCVData({
      ...currentCV,
      name: profileName,
      title: profileTitle
    });
    setEditMode(false);
    triggerAdminAction(`[PROFILE] Updated quick dashboard stats for ${profileName}.`);
  };

  const handleFeedback = (id: string, rate: 'up' | 'down') => {
    setFeedbackRates(prev => ({
      ...prev,
      [id]: prev[id] === rate ? null : rate
    }));
  };

  // Radar data
  const radarData = [
    { label: "Content", score: currentCV.grammarScore || 92 },
    { label: "Structure", score: currentCV.formattingScore || 90 },
    { label: "Keywords", score: currentCV.keywordScore || 85 },
    { label: "Readability", score: currentCV.grammarScore || 92 },
    { label: "Impact", score: currentCV.leadershipScore || 82 },
    { label: "Technical", score: currentCV.technicalScore || 94 }
  ];

  // Line chart trend data
  const lineChartData = [
    { label: "May 10", score: 65 },
    { label: "May 17", score: 68 },
    { label: "May 24", score: 75 },
    { label: "June 01", score: 82 },
    { label: "June 17", score: currentCV.atsScore || 88 }
  ];

  const aiSuggestions = [
    { id: "sug-1", text: "Replace weak bullets in Experience with impact outcomes.", category: "Impact", actionTab: "accuracy" },
    { id: "sug-2", text: "Target job lists require 'Kubernetes' and 'CI/CD' skills.", category: "Keywords", actionTab: "jobmatch" },
    { id: "sug-3", text: "The profile is missing a portfolio website link in Header.", category: "Formatting", actionTab: "builder" }
  ];

  const notificationsCarousel = [
    "AWS Cert expiring in 3 months. Plan rotation soon.",
    "Resume readability grade matches Senior Recruiter benchmarks.",
    "Google authentication session secure handshake active."
  ];

  const exportReport = (format: string) => {
    triggerAdminAction(`[EXPORT] Exported dashboard report in ${format} format.`);
    alert(`Mock report downloaded in ${format} format!`);
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-zinc-900 gap-4">
        <div className="space-y-1">
          {editMode ? (
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-1.5 text-white" 
              />
              <input 
                type="text" 
                value={profileTitle} 
                onChange={(e) => setProfileTitle(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs rounded-lg p-1.5 text-white" 
              />
              <button onClick={handleProfileUpdate} className="px-2.5 py-1 bg-purple-600 text-white rounded text-[10px] font-bold">Save</button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-tight text-white">{currentCV.name}</h2>
              <button onClick={() => setEditMode(true)} className="p-1 text-zinc-550 hover:text-white transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-xs text-zinc-500">{currentCV.title} • Session Active</p>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => setActiveTab('upload')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Analyze New CV</span>
          </button>

          <div className="flex bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden text-xs">
            <button onClick={() => exportReport('PDF')} className="p-2 px-3 text-zinc-400 hover:text-white hover:bg-zinc-850 transition flex items-center gap-1 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button onClick={() => exportReport('JSON')} className="p-2 px-3 text-zinc-400 hover:text-white hover:bg-zinc-850 border-l border-zinc-800 transition flex items-center gap-1 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ticker Notifications Ticker */}
      <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-xl flex items-center justify-between gap-4 text-left">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-[10px] text-zinc-400 font-semibold">{notificationsCarousel[activeNotifIndex]}</span>
        </div>
        <button 
          onClick={() => setActiveNotifIndex((activeNotifIndex + 1) % notificationsCarousel.length)}
          className="p-1 hover:bg-zinc-900 rounded text-zinc-500 hover:text-white transition shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target Goal Tracker & Readiness Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Goal tracker card */}
        <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
          <h3 className="text-xs font-black uppercase text-purple-400 tracking-wider font-mono">ATS Target Goal Tracker</h3>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Target Score</span>
              <span className="font-mono font-bold text-white">{targetScore}%</span>
            </div>
            <input 
              type="range" 
              min={70} 
              max={99} 
              value={targetScore} 
              onChange={(e) => setTargetScore(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
            />
            <div className="p-2.5 bg-purple-950/20 border border-purple-500/20 rounded-xl text-[10px] text-purple-300 leading-normal flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <span>
                You need <b className="text-white">+{targetScore - (currentCV.atsScore || 88)}%</b> score lift to hit target. Apply accuracy suggestions to proceed.
              </span>
            </div>
          </div>
        </div>

        {/* Career readiness index */}
        <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
          <h3 className="text-xs font-black uppercase text-cyan-400 tracking-wider font-mono">Career Readiness Index</h3>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Target: {currentCV.title}</span>
              <span className="font-mono font-bold text-white">85% Fit</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
              <div style={{ width: '85%' }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Readiness calculated from target keywords, education rank, and action verbs parameters.
            </p>
          </div>
        </div>

        {/* Aesthetic score card */}
        <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
          <h3 className="text-xs font-black uppercase text-pink-400 tracking-wider font-mono">Aesthetic Formatting Rating</h3>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-medium">Layout Density</span>
              <span className="font-mono font-bold text-white">Optimal (90%)</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
              <div style={{ width: '90%' }} className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              No graphics, text boxes, or non-standard fonts detected in active document formats.
            </p>
          </div>
        </div>

      </div>

      {/* Top 3 Score Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center bg-zinc-900/10">
          <RadialGauge score={currentCV.atsScore || 88} label="ATS Compliance" gradientColors={["#a855f7", "#c084fc"]} />
        </div>
        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center bg-zinc-900/10">
          <RadialGauge score={currentCV.grammarScore || 92} label="Content & Grammar" gradientColors={["#06b6d4", "#22d3ee"]} />
        </div>
        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center bg-zinc-900/10">
          <RadialGauge score={currentCV.formattingScore || 90} label="Formatting Rating" gradientColors={["#ec4899", "#f472b6"]} />
        </div>
      </div>

      {/* Score Trend & Radar Strengths Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-sm font-bold text-white">Score Improvement Trend</h3>
              <p className="text-[10px] text-zinc-500">History tracking metrics</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold font-mono">+23%</span>
              <span className="text-[10px] text-zinc-500 font-mono">Weekly Scans: {weeklyScans.reduce((a, b) => a + b, 0)}</span>
            </div>
          </div>
          <div className="pt-2 flex justify-center">
            <LineChart data={lineChartData} width={420} height={200} />
          </div>
        </div>

        {/* Radar Strengths */}
        <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <div className="text-left">
            <h3 className="text-sm font-bold text-white">AI Strengths Mapping</h3>
            <p className="text-[10px] text-zinc-500">6-axis resume competency audit</p>
          </div>
          <div className="flex justify-center">
            <RadarChart data={radarData} size={250} />
          </div>
        </div>
      </div>

      {/* Horizontal Skills Carousel */}
      <div className="glass-panel border-zinc-900 rounded-2xl p-4 text-left space-y-2.5">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-mono">Parsed Skill Tags Registry</span>
        <div className="flex flex-wrap gap-2 pt-1">
          {currentCV.skills.map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-zinc-900 border border-zinc-850 rounded-lg text-[10px] font-semibold text-zinc-400">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* AI Suggestions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Suggestions */}
        <div className="lg:col-span-2 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4.5 h-4.5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Top AI Insights & Suggestions</h3>
          </div>
          
          <div className="space-y-2.5">
            {aiSuggestions.map((sug) => (
              <div 
                key={sug.id}
                className="p-3 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-900 hover:border-purple-500/20 rounded-xl flex items-center justify-between transition"
              >
                <div 
                  onClick={() => setActiveTab(sug.actionTab)}
                  className="flex items-center space-x-3 pr-2 cursor-pointer flex-1 text-left"
                >
                  <div className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 shrink-0">
                    <AlertCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-cyan-400 font-mono tracking-wider">{sug.category}</span>
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{sug.text}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0">
                  <button 
                    onClick={() => handleFeedback(sug.id, 'up')}
                    className={`p-1.5 hover:bg-zinc-850 rounded-lg transition ${feedbackRates[sug.id] === 'up' ? 'text-purple-400' : 'text-zinc-550'}`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleFeedback(sug.id, 'down')}
                    className={`p-1.5 hover:bg-zinc-850 rounded-lg transition ${feedbackRates[sug.id] === 'down' ? 'text-purple-400' : 'text-zinc-550'}`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight onClick={() => setActiveTab(sug.actionTab)} className="w-4 h-4 text-zinc-650 shrink-0 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Notebook & Action Heatmap */}
        <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 text-left">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4.5 h-4.5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Custom Goal Notebook</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <input 
                type="text" 
                placeholder="Add new task..." 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-xs rounded-xl p-2 flex-1 outline-none text-zinc-300 focus:border-purple-500"
              />
              <button onClick={handleAddNote} className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 no-scrollbar text-xs">
              {notes.map((note, idx) => (
                <div key={idx} className="p-2.5 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between gap-2">
                  <span className="text-zinc-300">{note}</span>
                  <button onClick={() => handleDeleteNote(idx)} className="text-zinc-550 hover:text-red-400 transition cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-center py-6 text-zinc-600">No notes saved.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
