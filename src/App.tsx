import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { MobileSim } from './components/MobileSim';

// Pages
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { UploadResume } from './pages/UploadResume';
import { Analysis } from './pages/Analysis';
import { Accuracy } from './pages/Accuracy';
import { Builder } from './pages/Builder';
import { Templates } from './pages/Templates';
import { Fonts } from './pages/Fonts';
import { JobMatch } from './pages/JobMatch';
import { CoverLetter } from './pages/CoverLetter';
import { Interview } from './pages/Interview';
import { Career } from './pages/Career';
import { Chat } from './pages/Chat';
import { LinkedIn } from './pages/LinkedIn';
import { GitHub } from './pages/GitHub';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';

// New Extra Feature Pages
import { 
  SalaryPredictor, SkillRoadmap, InterviewQuestions, 
  CareerTimeline, ScoreBenchmarks, TargetCompanies, 
  HiringTrends, NegotiationGuide 
} from './pages/CareerTools';

import { 
  ResumeTranslator, BulletEnhancer, HeadlineGen, 
  ColdEmail, ElevatorPitch, CoverLetterHelper, 
  GrammarTuner, SummaryTuner 
} from './pages/AiRewriters';

import { 
  KeywordDensity, CertAuditor, HeaderAudits, 
  SkillMatrix, RoleFit, ReadabilityStats, 
  FormattingScanner, JdKeywords, ScoringLogs 
} from './pages/AuditScanners';

import { 
  AppTracker, PortfolioSite, ReferencesSheet, 
  PortalSync, ApiTelemetry, ActivityLog, 
  RecruiterConnect, ActionVerbs 
} from './pages/JobTrackers';

const AppContent: React.FC = () => {
  const { user, activeTab, setActiveTab } = useApp();

  // Route Protection: If guest attempts to access dashboards, redirect to Auth
  useEffect(() => {
    if (!user && activeTab !== 'landing' && activeTab !== 'auth') {
      setActiveTab('auth');
    }
  }, [user, activeTab, setActiveTab]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <Landing />;
      case 'auth':
        return <Auth />;
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <UploadResume />;
      case 'analysis':
        return <Analysis />;
      case 'accuracy':
        return <Accuracy />;
      case 'builder':
        return <Builder />;
      case 'templates':
        return <Templates />;
      case 'fonts':
        return <Fonts />;
      case 'jobmatch':
        return <JobMatch />;
      case 'coverletter':
        return <CoverLetter />;
      case 'interview':
        return <Interview />;
      case 'career':
        return <Career />;
      case 'chat':
        return <Chat />;
      case 'linkedin':
        return <LinkedIn />;
      case 'github':
        return <GitHub />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      case 'admin':
        return <Admin />;

      // New Extra Feature Cases (Group 1 - Career tools)
      case 'salary':
        return <SalaryPredictor />;
      case 'roadmap':
        return <SkillRoadmap />;
      case 'interview-questions':
        return <InterviewQuestions />;
      case 'timeline':
        return <CareerTimeline />;
      case 'benchmarks':
        return <ScoreBenchmarks />;
      case 'target-companies':
        return <TargetCompanies />;
      case 'hiring-trends':
        return <HiringTrends />;
      case 'negotiation-guide':
        return <NegotiationGuide />;

      // New Extra Feature Cases (Group 2 - AI writers)
      case 'translator':
        return <ResumeTranslator />;
      case 'bullet-enhancer':
        return <BulletEnhancer />;
      case 'headline':
        return <HeadlineGen />;
      case 'cold-email':
        return <ColdEmail />;
      case 'elevator-pitch':
        return <ElevatorPitch />;
      case 'cover-letter-helper':
        return <CoverLetterHelper />;
      case 'grammar-tuner':
        return <GrammarTuner />;
      case 'summary-tuner':
        return <SummaryTuner />;

      // New Extra Feature Cases (Group 3 - Scanners)
      case 'density':
        return <KeywordDensity />;
      case 'cert-auditor':
        return <CertAuditor />;
      case 'header-audits':
        return <HeaderAudits />;
      case 'skill-matrix':
        return <SkillMatrix />;
      case 'role-fit':
        return <RoleFit />;
      case 'readability-stats':
        return <ReadabilityStats />;
      case 'formatting-scanner':
        return <FormattingScanner />;
      case 'jd-keywords':
        return <JdKeywords />;
      case 'scoring-logs':
        return <ScoringLogs />;

      // New Extra Feature Cases (Group 4 - Job search & Dev)
      case 'tracker':
        return <AppTracker />;
      case 'portfolio':
        return <PortfolioSite />;
      case 'references':
        return <ReferencesSheet />;
      case 'portal-sync':
        return <PortalSync />;
      case 'api-keys':
        return <ApiTelemetry />;
      case 'activity-log':
        return <ActivityLog />;
      case 'recruiter-connect':
        return <RecruiterConnect />;
      case 'action-verbs':
        return <ActionVerbs />;

      default:
        return <Landing />;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
        {/* Main Dashboard Panel */}
        <div className="flex-1 min-w-0 w-full">
          {renderActivePage()}
        </div>

        {/* Side-by-Side Mobile App Simulator (Persistently visible when logged in) */}
        {user && activeTab !== 'landing' && (
          <MobileSim />
        )}
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
