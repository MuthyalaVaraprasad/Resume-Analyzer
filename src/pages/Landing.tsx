import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  const { user, setActiveTab, setLoginRedirectTab } = useApp();

  const handleStart = () => {
    if (user) {
      setActiveTab('dashboard');
    } else {
      setLoginRedirectTab('dashboard');
      setActiveTab('auth');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center select-none py-12 relative overflow-hidden text-center">
      {/* 3D-like glowing backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      
      <div className="relative z-10">
        {/* The single, highly animated Start Button */}
        <button 
          onClick={handleStart}
          className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-white rounded-2xl text-xs font-black tracking-widest uppercase shadow-lg shadow-purple-500/20 flex items-center space-x-3 transition transform hover:-translate-y-1 hover:scale-105 active:scale-95 border border-purple-400/20 relative overflow-hidden cursor-pointer"
        >
          {/* Hover ripple overlay */}
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300" />
          
          <span>Start Resume Analyzer</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
        </button>
      </div>
    </div>
  );
};
