import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Sparkles, ArrowLeft } from 'lucide-react';

export const Chat: React.FC = () => {
  const { currentCV, triggerAdminAction, setActiveTab } = useApp();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: `Hello! I am your AI Career Assistant. I have successfully scanned your active resume profile as '${currentCV.name}'. Ask me anything about improving your summary details, ATS ratings, or targeted roles.` }
  ]);

  const suggestionChips = [
    "How can I improve my professional summary?",
    "Suggest 3 technical keywords for engineering roles.",
    "Explain why a single-column layout is better for ATS."
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    triggerAdminAction(`[CHAT] Query: ${text.slice(0, 40)}...`);

    setTimeout(() => {
      let reply = "Your active resume looks solid. Try highlighting quantifiable outcome verbs in experience descriptions. Instead of 'helped team build', write 'Architected automated pipelines reducing deployment lags by 50%'.";
      
      const query = text.toLowerCase();
      if (query.includes('summary')) {
        reply = `Here is an optimized rewrite for your summary: "Result-driven Senior Engineer with 6+ years of experience spearheading microservice pipelines and React frontend frameworks. Proven capability to optimize page speeds by 35% and streamline team workflow."`;
      } else if (query.includes('keyword') || query.includes('skills')) {
        reply = "For modern development roles, you should include skills like: Kubernetes, Docker, AWS Solutions Architecture, CI/CD automated test frameworks, and GraphQL API query setups.";
      } else if (query.includes('ats') || query.includes('layout')) {
        reply = "Applicant Tracking Systems (ATS) compile documents vertically. Multi-column tables or text-box coordinates often cause parse overflows. Renders on single-column, clean templates ensure 100% extraction indices.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1000);
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
          <h2 className="text-xl font-bold tracking-tight text-white">AI Chat Assistant</h2>
          <p className="text-xs text-zinc-500 mt-1">Converse with the career intelligence agent for real-time overrides and edits.</p>
        </div>
      </div>

      <div className="glass-panel border-zinc-900 rounded-3xl p-5 flex flex-col h-[500px] bg-zinc-950/40 relative">
        {/* Chat message Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2 pr-1 no-scrollbar text-xs">
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex space-x-2 items-start max-w-[80%]">
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  </div>
                )}
                <div 
                  className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion Chips */}
        <div className="p-2 border-t border-zinc-900/60 pt-3 flex flex-wrap gap-2 select-none print:hidden">
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-purple-500/20 rounded-xl text-[10px] text-zinc-400 hover:text-white transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input panel bar */}
        <div className="p-3 border-t border-zinc-900 flex items-center space-x-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(inputText); }}
            placeholder="Ask questions about improving your resume details..."
            className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-purple-500 text-zinc-200"
          />
          
          <button 
            onClick={() => handleSend(inputText)}
            className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
