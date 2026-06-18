import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomCursor } from './CustomCursor';
import { 
  Sparkles, Bell, LogOut, ChevronRight, Settings,
  Cpu, FileText, BarChart2, ShieldAlert, Edit, LayoutGrid,
  Type, CheckSquare, FileSignature, Mic, TrendingUp,
  MessageSquare, Linkedin, Github, History, Database, Menu, X,
  DollarSign, Map, Award, Calendar, BarChart3, Building, Compass,
  Globe, AlertTriangle, Columns, User, FileCheck, Key, Mail, Search, List
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    user, 
    logout, 
    activeTab, 
    setActiveTab, 
    notifications, 
    markAllNotificationsRead,
    isMobileSimOpen,
    setIsMobileSimOpen
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Cpu className="w-4 h-4" />, category: 'dashboards' },
    { id: 'upload', name: 'Upload CV', icon: <FileText className="w-4 h-4" />, category: 'dashboards' },
    { id: 'analysis', name: 'AI CV Analysis', icon: <BarChart2 className="w-4 h-4" />, category: 'dashboards' },
    { id: 'accuracy', name: 'Accuracy Solutions', icon: <ShieldAlert className="w-4 h-4" />, category: 'dashboards' },

    { id: 'builder', name: 'Resume Builder', icon: <Edit className="w-4 h-4" />, category: 'builder' },
    { id: 'templates', name: 'Templates', icon: <LayoutGrid className="w-4 h-4" />, category: 'builder' },
    { id: 'fonts', name: 'Font Library', icon: <Type className="w-4 h-4" />, category: 'builder' },
    { id: 'jobmatch', name: 'Job Match Analyzer', icon: <CheckSquare className="w-4 h-4" />, category: 'builder' },
    { id: 'coverletter', name: 'Cover Letter Gen', icon: <FileSignature className="w-4 h-4" />, category: 'builder' },
    { id: 'interview', name: 'AI Interview Coach', icon: <Mic className="w-4 h-4" />, category: 'builder' },
    { id: 'career', name: 'AI Career Insights', icon: <TrendingUp className="w-4 h-4" />, category: 'builder' },
    { id: 'chat', name: 'AI Chat Assistant', icon: <MessageSquare className="w-4 h-4" />, category: 'builder' },

    { id: 'linkedin', name: 'LinkedIn Analyzer', icon: <Linkedin className="w-4 h-4" />, category: 'integrations' },
    { id: 'github', name: 'GitHub Portfolio', icon: <Github className="w-4 h-4" />, category: 'integrations' },
    { id: 'history', name: 'Resume History', icon: <History className="w-4 h-4" />, category: 'integrations' },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" />, category: 'integrations' },
    { id: 'admin', name: 'Admin Dashboard', icon: <Database className="w-4 h-4" />, category: 'integrations' },

    // Career insights (Group 1)
    { id: 'salary', name: 'Salary Predictor', icon: <DollarSign className="w-4 h-4" />, category: 'career-insights' },
    { id: 'roadmap', name: 'Skill Gap Roadmap', icon: <Map className="w-4 h-4" />, category: 'career-insights' },
    { id: 'interview-questions', name: 'Interview Prompts', icon: <Award className="w-4 h-4" />, category: 'career-insights' },
    { id: 'timeline', name: 'Career Timeline', icon: <Calendar className="w-4 h-4" />, category: 'career-insights' },
    { id: 'benchmarks', name: 'Industry Benchmarks', icon: <BarChart3 className="w-4 h-4" />, category: 'career-insights' },
    { id: 'target-companies', name: 'Target Companies', icon: <Building className="w-4 h-4" />, category: 'career-insights' },
    { id: 'hiring-trends', name: 'Hiring Trends', icon: <Compass className="w-4 h-4" />, category: 'career-insights' },
    { id: 'negotiation-guide', name: 'Negotiation Guide', icon: <DollarSign className="w-4 h-4" />, category: 'career-insights' },

    // AI rewriters (Group 2)
    { id: 'translator', name: 'Resume Translator', icon: <Globe className="w-4 h-4" />, category: 'ai-rewriters' },
    { id: 'bullet-enhancer', name: 'Bullet Enhancer', icon: <Sparkles className="w-4 h-4" />, category: 'ai-rewriters' },
    { id: 'headline', name: 'LinkedIn Headline Gen', icon: <Type className="w-4 h-4" />, category: 'ai-rewriters' },
    { id: 'cold-email', name: 'Cold Email Writer', icon: <Mail className="w-4 h-4" />, category: 'ai-rewriters' },
    { id: 'elevator-pitch', name: 'Elevator Pitch', icon: <User className="w-4 h-4" />, category: 'ai-rewriters' },
    { id: 'cover-letter-helper', name: 'Cover Letter Bullets', icon: <FileText className="w-4 h-4" />, category: 'ai-rewriters' },
    { id: 'grammar-tuner', name: 'Grammar Checker', icon: <AlertTriangle className="w-4 h-4" />, category: 'ai-rewriters' },
    { id: 'summary-tuner', name: 'Summary Tuner', icon: <Edit className="w-4 h-4" />, category: 'ai-rewriters' },

    // Audit Scanners (Group 3)
    { id: 'density', name: 'Keyword Density', icon: <Search className="w-4 h-4" />, category: 'audit-scanners' },
    { id: 'cert-auditor', name: 'Certifications Auditor', icon: <Award className="w-4 h-4" />, category: 'audit-scanners' },
    { id: 'header-audits', name: 'ATS Header Scan', icon: <LayoutGrid className="w-4 h-4" />, category: 'audit-scanners' },
    { id: 'skill-matrix', name: 'Skill Matrix', icon: <Cpu className="w-4 h-4" />, category: 'audit-scanners' },
    { id: 'role-fit', name: 'Job Role Fit', icon: <CheckSquare className="w-4 h-4" />, category: 'audit-scanners' },
    { id: 'readability-stats', name: 'Readability Stats', icon: <List className="w-4 h-4" />, category: 'audit-scanners' },
    { id: 'formatting-scanner', name: 'Formatting Scanner', icon: <CheckSquare className="w-4 h-4" />, category: 'audit-scanners' },
    { id: 'jd-keywords', name: 'JD Keywords Match', icon: <Search className="w-4 h-4" />, category: 'audit-scanners' },
    { id: 'scoring-logs', name: 'Scoring History Logs', icon: <History className="w-4 h-4" />, category: 'audit-scanners' },

    // Job Search & Dev (Group 4)
    { id: 'tracker', name: 'Kanban Tracker', icon: <Columns className="w-4 h-4" />, category: 'job-search' },
    { id: 'portfolio', name: 'AI Portfolio Site', icon: <User className="w-4 h-4" />, category: 'job-search' },
    { id: 'references', name: 'References Sheet', icon: <FileCheck className="w-4 h-4" />, category: 'job-search' },
    { id: 'portal-sync', name: 'Portal Sync Helper', icon: <FileCheck className="w-4 h-4" />, category: 'job-search' },
    { id: 'api-keys', name: 'API manager Keys', icon: <Key className="w-4 h-4" />, category: 'job-search' },
    { id: 'activity-log', name: 'Edit Activity Grid', icon: <Calendar className="w-4 h-4" />, category: 'job-search' },
    { id: 'recruiter-connect', name: 'Recruiter Connect', icon: <Mail className="w-4 h-4" />, category: 'job-search' },
    { id: 'action-verbs', name: 'Action Verbs Catalog', icon: <FileText className="w-4 h-4" />, category: 'job-search' }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      markAllNotificationsRead();
    }
  };

  const renderNavSection = (title: string, category: string) => {
    const items = navigationItems.filter(item => item.category === category);
    if (items.length === 0) return null;
    return (
      <div className="space-y-1 pt-3 border-t border-zinc-900/40">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 px-3">{title}</span>
        <nav className="space-y-1">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition ${
                activeTab === item.id 
                  ? 'bg-purple-950/30 border border-purple-500/20 text-purple-400 font-bold' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {activeTab === item.id && <ChevronRight className="w-3 h-3" />}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-mesh bg-grid bg-zinc-950 text-zinc-100 flex flex-col relative select-none">
      {/* Custom Cursor Effects */}
      <CustomCursor />

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center space-x-3">
          {user && (
            <button 
              onClick={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center space-x-2 cursor-pointer font-bold select-none group"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-md font-black tracking-tight text-white bg-clip-text">CV Analyzer</span>
              <span className="text-[8px] uppercase block tracking-widest text-zinc-500 font-mono leading-none">Intelligence SaaS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Mobile Sim Toggle */}
          <button
            onClick={() => setIsMobileSimOpen(!isMobileSimOpen)}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 transition"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>{isMobileSimOpen ? "Hide Simulator" : "Show Simulator"}</span>
          </button>

          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={handleNotifClick}
                  className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  )}
                </button>
              </div>

              {/* User Dropdown */}
              <div className="flex items-center space-x-2.5 pl-2 border-l border-zinc-800">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30">
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-tight truncate max-w-[100px]">{user.name}</p>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">Profile Level</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => setActiveTab('auth')}
              className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 rounded-lg text-xs font-bold shadow-md transition"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Framework Body */}
      <div className="flex-1 flex w-full relative">
        {/* Navigation Sidebar (Desktop) */}
        {user && activeTab !== 'landing' && (
          <aside className="hidden lg:flex w-64 bg-zinc-950/60 border-r border-zinc-800/50 p-4 shrink-0 flex-col justify-between sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
            <div className="space-y-4">
              {renderNavSection('Dashboards', 'dashboards')}
              {renderNavSection('CV Builder & Core Tools', 'builder')}
              {renderNavSection('Career Planning & Insights', 'career-insights')}
              {renderNavSection('AI Rewriters & Writers', 'ai-rewriters')}
              {renderNavSection('Scanners & Audits', 'audit-scanners')}
              {renderNavSection('Job Search & Dev', 'job-search')}
              {renderNavSection('Integrations & History', 'integrations')}
            </div>

            <div className="border-t border-zinc-900 pt-4 mt-6">
              <div className="glass-panel border-purple-500/10 rounded-xl p-3 text-center space-y-1 relative overflow-hidden">
                <p className="text-[10px] font-black text-cyan-400 tracking-wider">ENTERPRISE CORE</p>
                <p className="text-[9px] text-zinc-400">100% Free - All Features Unlocked</p>
              </div>
            </div>
          </aside>
        )}

        {/* Navigation Sidebar Drawer (Mobile) */}
        {user && isSidebarMobileOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
            <aside className="w-72 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col justify-between h-full overflow-y-auto no-scrollbar animate-slide-in">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-bold text-white">Menu Navigation</span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarMobileOpen(false)}
                    className="p-1 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {renderNavSection('Dashboards', 'dashboards')}
                  {renderNavSection('CV Builder & Core Tools', 'builder')}
                  {renderNavSection('Career Planning & Insights', 'career-insights')}
                  {renderNavSection('AI Rewriters & Writers', 'ai-rewriters')}
                  {renderNavSection('Scanners & Audits', 'audit-scanners')}
                  {renderNavSection('Job Search & Dev', 'job-search')}
                  {renderNavSection('Integrations & History', 'integrations')}
                </div>
              </div>
            </aside>
            <div className="flex-1" onClick={() => setIsSidebarMobileOpen(false)} />
          </div>
        )}

        {/* Main Center Content Frame */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {children}
          </div>
        </main>
      </div>

      {/* Notifications Drawer (Slide-out) */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-80 md:w-96 bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col h-full shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-900 mb-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-purple-400 animate-swing" />
                <h3 className="font-bold text-sm text-white">System Logs & Alerts</h3>
              </div>
              <button 
                onClick={() => setIsNotifOpen(false)}
                className="p-1 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-850 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-3 rounded-lg border text-xs relative ${notif.unread ? 'bg-purple-950/10 border-purple-500/20' : 'bg-zinc-900/30 border-zinc-900'}`}
                >
                  <h4 className="font-bold text-white mb-0.5">{notif.title}</h4>
                  <p className="text-zinc-400 text-[10px] leading-relaxed">{notif.message}</p>
                  <span className="text-[9px] text-zinc-600 block mt-1.5 font-mono">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsNotifOpen(false)} />
        </div>
      )}
    </div>
  );
};
