import React, { createContext, useContext, useState, useEffect } from 'react';

// Definitions
export interface UserSession {
  name: string;
  email: string;
  avatar: string;
  loggedIn: boolean;
  timestamp: string;
}

export interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  summary: string;
  experience: Array<{ id: string; role: string; company: string; duration: string; bullets: string[] }>;
  education: Array<{ id: string; degree: string; school: string; duration: string; gpa?: string }>;
  skills: string[];
  projects: Array<{ id: string; name: string; description: string; tech: string[]; link?: string }>;
  certifications: string[];
  achievements: string[];
  languages: string[];
  interests: string[];
  atsScore?: number;
  grammarScore?: number;
  keywordScore?: number;
  formattingScore?: number;
  leadershipScore?: number;
  technicalScore?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface CVHistoryItem {
  id: string;
  filename: string;
  date: string;
  score: number;
  atsScore: number;
  data: CVData;
}

interface AppContextType {
  user: UserSession | null;
  login: (provider: string, mockData?: { name?: string; email?: string; avatar?: string }) => void;
  logout: () => void;
  currentCV: CVData;
  updateCurrentCV: (updater: (prev: CVData) => CVData) => void;
  setCurrentCVData: (data: CVData) => void;
  cvHistory: CVHistoryItem[];
  addCVToHistory: (filename: string, score: number, atsScore: number, data: CVData) => void;
  deleteCVFromHistory: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginRedirectTab: string | null;
  setLoginRedirectTab: (tab: string | null) => void;
  googleClientId: string;
  setGoogleClientId: (clientId: string) => void;
  isMobileSimOpen: boolean;
  setIsMobileSimOpen: (open: boolean) => void;
  activeMobileScreen: string;
  setActiveMobileScreen: (screen: string) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string) => void;
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
  activeFont: string;
  setActiveFont: (font: string) => void;
  adminStats: {
    totalUsers: number;
    activeUsers: number;
    uploadsCount: number;
    apiCost: number;
    cpuUsage: number;
    ramUsage: number;
    logs: string[];
  };
  triggerAdminAction: (log: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  playUIBeep: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial empty CV template
const defaultCV: CVData = {
  name: "Alex Morgan",
  title: "Senior Software Engineer",
  email: "alex.morgan@techstack.io",
  phone: "+1 (555) 234-5678",
  website: "github.com/alexmorgan",
  location: "San Francisco, CA",
  summary: "Driven and innovative Senior Software Engineer with over 6 years of experience building scalable web applications. Expert in React, TypeScript, Node.js, and cloud architectures. Proven track record of spearheading cross-functional teams to deliver enterprise-grade SaaS platforms and reducing API latency by 40%.",
  experience: [
    {
      id: "exp-1",
      role: "Lead Full-Stack Developer",
      company: "CloudVibe Solutions",
      duration: "2023 - Present",
      bullets: [
        "Spearheaded development of 5 high-traffic microservices handling over 10M daily API requests.",
        "Refactored legacy React architectures into modern React 19 / TypeScript, increasing UI speed by 35%.",
        "Collaborated with UI/UX engineers to implement high-fidelity design systems, boosting user engagement metrics."
      ]
    },
    {
      id: "exp-2",
      role: "Software Engineer III",
      company: "DataSync Corp",
      duration: "2020 - 2023",
      bullets: [
        "Architected an automated data ingestion pipeline using Node.js and AWS Lambda, reducing processing times by 50%.",
        "Led team of 4 junior developers, introducing clean code audits, testing automation, and CI/CD pipelines."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      school: "Stanford University",
      duration: "2016 - 2020",
      gpa: "3.8"
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS", "AWS", "Docker", "GraphQL", "Python", "CI/CD"],
  projects: [
    {
      id: "proj-1",
      name: "Resume Intelligence Engine",
      description: "An AI-powered SaaS system analyzing resume compliance and job profile alignment using OpenAI GPT APIs.",
      tech: ["React", "TypeScript", "Node.js", "TailwindCSS"],
      link: "github.com/alexmorgan/cv-analyzer"
    },
    {
      id: "proj-2",
      name: "Microservice Sync Node",
      description: "High-performance event broker syncing data models between MongoDB instances in real-time.",
      tech: ["Go", "Redis", "Docker", "MongoDB"]
    }
  ],
  certifications: ["AWS Certified Solutions Architect", "Certified ScrumMaster (CSM)"],
  achievements: ["Winner of TechCrunch Hackathon 2022", "Published article in JS Weekly Journal on micro-frontends"],
  languages: ["English (Native)", "Spanish (Conversational)"],
  interests: ["Generative AI", "Cybersecurity", "Backpacking", "Open Source Contribution"],
  atsScore: 88,
  grammarScore: 92,
  keywordScore: 85,
  formattingScore: 90,
  leadershipScore: 82,
  technicalScore: 94
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load session from LocalStorage
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('cv_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentCV, setCurrentCV] = useState<CVData>(() => {
    const saved = localStorage.getItem('cv_current_data');
    return saved ? JSON.parse(saved) : defaultCV;
  });

  const [cvHistory, setCvHistory] = useState<CVHistoryItem[]>(() => {
    const saved = localStorage.getItem('cv_history');
    if (saved) return JSON.parse(saved);
    
    // Add default initial history element
    return [{
      id: "hist-default",
      filename: "Alex_Morgan_Resume_v1.pdf",
      date: "2026-06-10",
      score: 89,
      atsScore: 88,
      data: defaultCV
    }];
  });

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [loginRedirectTab, setLoginRedirectTab] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string>(() => {
    const saved = localStorage.getItem('cv_google_client_id');
    if (!saved || saved === '1071239851410-mockid.apps.googleusercontent.com') {
      return '1082732589460-pbbr7dv7cvbae9l6g0t6fjj3fqfdu4p2.apps.googleusercontent.com';
    }
    return saved;
  });
  const [isMobileSimOpen, setIsMobileSimOpen] = useState<boolean>(true);
  const [activeMobileScreen, setActiveMobileScreen] = useState<string>('01_splash');
  const [activeTemplate, setActiveTemplate] = useState<string>('Modern');
  const [activeFont, setActiveFont] = useState<string>('Inter');
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('cv_theme') || 'purple');

  // Persist googleClientId
  useEffect(() => {
    localStorage.setItem('cv_google_client_id', googleClientId);
  }, [googleClientId]);

  // Play micro beep sound when scanning finishes
  const playUIBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800Hz beep tone
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.18);
      oscillator.stop(audioCtx.currentTime + 0.18);
    } catch (e) {
      console.warn("Audio playback not allowed or not supported in this shell", e);
    }
  };

  // Adjust theme variables dynamically
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('cv_theme', theme);
    if (theme === 'purple') {
      root.style.setProperty('--color-brand-primary', '#a855f7');
      root.style.setProperty('--color-brand-secondary', '#06b6d4');
    } else if (theme === 'cyan') {
      root.style.setProperty('--color-brand-primary', '#06b6d4');
      root.style.setProperty('--color-brand-secondary', '#3b82f6');
    } else if (theme === 'pink') {
      root.style.setProperty('--color-brand-primary', '#ec4899');
      root.style.setProperty('--color-brand-secondary', '#a855f7');
    } else if (theme === 'green') {
      root.style.setProperty('--color-brand-primary', '#22c55e');
      root.style.setProperty('--color-brand-secondary', '#eab308');
    }
  }, [theme]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Analysis Complete",
      message: "Your resume 'Alex_Morgan_Resume_v1.pdf' was analyzed successfully. ATS Score: 88%.",
      time: "2 hours ago",
      unread: true
    },
    {
      id: "notif-2",
      title: "AI Suggestion",
      message: "Add 'Kubernetes' and 'System Design' to match the targeted Senior Developer jobs.",
      time: "1 day ago",
      unread: false
    }
  ]);

  const [adminStats, setAdminStats] = useState({
    totalUsers: 1420,
    activeUsers: 84,
    uploadsCount: 5293,
    apiCost: 47.62,
    cpuUsage: 12,
    ramUsage: 45,
    logs: [
      "[INFO] System initialized successfully on Node.js v20.12.0",
      "[OAUTH] User john.doe@gmail.com logged in via Google OAuth.",
      "[AI] Resume parsed. Score calculated: 78%",
      "[SERVER] API endpoint /api/v1/analyze responded in 420ms"
    ]
  });

  // Persist session
  useEffect(() => {
    if (user) {
      localStorage.setItem('cv_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('cv_user_session');
    }
  }, [user]);

  // Persist current CV data
  useEffect(() => {
    localStorage.setItem('cv_current_data', JSON.stringify(currentCV));
  }, [currentCV]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('cv_history', JSON.stringify(cvHistory));
  }, [cvHistory]);

  const login = (provider: string, mockData?: { name?: string; email?: string; avatar?: string }) => {
    const defaultAvatars: Record<string, string> = {
      google: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      github: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      linkedin: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    };

    const newSession: UserSession = {
      name: mockData?.name || (provider === 'google' ? 'Alex Rivera' : provider === 'github' ? 'Octocat coder' : 'Sarah Jenkins'),
      email: mockData?.email || `${provider === 'google' ? 'alex.rivera' : provider === 'github' ? 'octocoder' : 'sarah.j'}@${provider}.com`,
      avatar: mockData?.avatar || defaultAvatars[provider.toLowerCase()] || defaultAvatars.google,
      loggedIn: true,
      timestamp: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString()
    };

    setUser(newSession);
    addNotification("Authentication Successful", `Welcome back, ${newSession.name}! Authenticated via ${provider}.`);
    
    // Log to admin
    triggerAdminAction(`[OAUTH] User ${newSession.email} logged in via ${provider} OAuth.`);

    // Handle redirect
    if (loginRedirectTab) {
      setActiveTab(loginRedirectTab);
      setLoginRedirectTab(null);
    } else {
      setActiveTab('dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    setActiveTab('landing');
  };

  const updateCurrentCV = (updater: (prev: CVData) => CVData) => {
    setCurrentCV(prev => updater(prev));
  };

  const setCurrentCVData = (data: CVData) => {
    setCurrentCV(data);
  };

  const addCVToHistory = (filename: string, score: number, atsScore: number, data: CVData) => {
    const newItem: CVHistoryItem = {
      id: 'hist-' + Date.now(),
      filename,
      date: new Date().toISOString().split('T')[0],
      score,
      atsScore,
      data
    };
    setCvHistory(prev => [newItem, ...prev]);
    addNotification("New Resume Scanned", `Resume '${filename}' has been successfully analyzed.`);
    
    // Update admin stats
    setAdminStats(prev => ({
      ...prev,
      uploadsCount: prev.uploadsCount + 1,
      apiCost: parseFloat((prev.apiCost + 0.04).toFixed(2)),
      logs: [`[AI] Saved file ${filename} with Score: ${score}%`, ...prev.logs]
    }));
  };

  const deleteCVFromHistory = (id: string) => {
    setCvHistory(prev => prev.filter(item => item.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const addNotification = (title: string, message: string) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
    playUIBeep();
  };

  const triggerAdminAction = (log: string) => {
    setAdminStats(prev => {
      const updatedLogs = [log, ...prev.logs.slice(0, 49)];
      return {
        ...prev,
        logs: updatedLogs
      };
    });
  };

  // Mock server CPU/RAM usage changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAdminStats(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 20) + 5,
        ramUsage: Math.floor(Math.random() * 5) + 42
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      currentCV, updateCurrentCV, setCurrentCVData,
      cvHistory, addCVToHistory, deleteCVFromHistory,
      activeTab, setActiveTab,
      loginRedirectTab, setLoginRedirectTab,
      googleClientId, setGoogleClientId,
      isMobileSimOpen, setIsMobileSimOpen,
      activeMobileScreen, setActiveMobileScreen,
      notifications, markAllNotificationsRead, addNotification,
      activeTemplate, setActiveTemplate,
      activeFont, setActiveFont,
      adminStats, triggerAdminAction,
      theme, setTheme, playUIBeep
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside an AppProvider");
  return context;
};
