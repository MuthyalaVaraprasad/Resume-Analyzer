import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, Award, Volume2, ArrowLeft } from 'lucide-react';

export const Interview: React.FC = () => {
  const { triggerAdminAction, setActiveTab } = useApp();
  const [role, setRole] = useState('Software Engineer');
  const [type, setType] = useState('Technical');
  const [isStarted, setIsStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{ score: number; feedback: string } | null>(null);

  const questions = {
    'Software Engineer': {
      'Technical': [
        "Explain how React 19 handles server components and concurrent renders.",
        "How do you audit API latencies and what steps would you take to decrease response delays by 40%?",
        "What are the core differences between SQL and NoSQL database indexing schemes?"
      ],
      'HR': [
        "Tell me about a time you had a technical disagreement with a teammate. How did you resolve it?",
        "Why do you want to join our organization and how does it align with your career targets?",
        "Describe a challenging bug you fixed under pressure."
      ]
    },
    'Product Manager': {
      'Technical': [
        "How would you run an A/B test for a new checkout conversion flow?",
        "Explain the metrics you track to identify user churn pipelines.",
        "How do you prioritize features in a product roadmap when developers have limited bandwidth?"
      ],
      'HR': [
        "How do you handle feature requests from stakeholders when they clash with the product roadmap?",
        "Tell me about a failed feature launch and what you learned from auditing the telemetry logs.",
        "How do you align design and developer groups to hit deadlines?"
      ]
    }
  };

  const activeQuestions = questions[role as 'Software Engineer' | 'Product Manager']?.[type as 'Technical' | 'HR'] || [];

  const speakQuestion = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Professional speed
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis not supported in this environment", e);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    setCurrentQIndex(0);
    setUserAnswer('');
    setEvaluation(null);
    triggerAdminAction(`[AI] Started interview coach for: ${role} (${type})`);
    // Speak first question automatically
    setTimeout(() => {
      speakQuestion(activeQuestions[0]);
    }, 400);
  };

  const handleEvaluate = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setEvaluation(null);

    setTimeout(() => {
      setIsEvaluating(false);
      const score = Math.floor(Math.random() * 20) + 75; // Score 75 to 95
      let feedback = "Excellent answer structure. You utilized strong technical terms. To improve, try adding more quantifiable metrics to highlight personal contributions.";
      if (userAnswer.toLowerCase().includes('latency') || userAnswer.toLowerCase().includes('react')) {
        feedback = "Outstanding response! Good inclusion of specific performance terms and system designs. Score reflects deep technical competence.";
      }
      setEvaluation({ score, feedback });
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setUserAnswer('');
      setEvaluation(null);
      // Speak next question
      setTimeout(() => {
        speakQuestion(activeQuestions[nextIdx]);
      }, 300);
    } else {
      setIsStarted(false);
    }
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
          <h2 className="text-xl font-bold tracking-tight text-white">AI Interview Coach</h2>
          <p className="text-xs text-zinc-500 mt-1">Practice role-based technical & HR questions with real-time feedback ratings.</p>
        </div>
      </div>

      {!isStarted ? (
        /* Configuration Screen */
        <div className="max-w-md mx-auto bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-6 space-y-5 glass-panel">
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mx-auto">
            <Mic className="w-6 h-6 text-purple-400" />
          </div>
          
          <div className="text-center space-y-1">
            <h3 className="text-md font-bold text-white">Mock Interview Setup</h3>
            <p className="text-xs text-zinc-500">Configure parameters to start verbal simulator.</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Target Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 outline-none focus:border-purple-500"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Interview Category</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300 outline-none focus:border-purple-500"
              >
                <option value="Technical">Technical Audit</option>
                <option value="HR">HR / Leadership Behavior</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95"
          >
            Start Coach Session
          </button>
        </div>
      ) : (
        /* Interview Simulator Active */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Question panel */}
          <div className="lg:col-span-7 glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 bg-zinc-950/40">
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase">
              <span>Question {currentQIndex + 1} of {activeQuestions.length}</span>
              <span className="text-purple-400 font-mono">{type} Check</span>
            </div>

            <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex items-center justify-between gap-4 text-xs leading-relaxed text-zinc-200">
              <span>"{activeQuestions[currentQIndex]}"</span>
              <button 
                onClick={() => speakQuestion(activeQuestions[currentQIndex])}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/30 text-zinc-400 hover:text-white rounded-xl shrink-0 transition"
                title="Speak Question Aloud"
              >
                <Volume2 className="w-4 h-4 text-purple-400" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase">Your Response</label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or record your mock response here..."
                rows={5}
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl p-3 text-xs outline-none resize-none leading-relaxed text-zinc-200 focus:border-purple-500"
              />
            </div>

            {/* Mic and submit triggers */}
            <div className="flex space-x-3 items-center">
              <button
                onClick={() => {
                  setIsRecording(!isRecording);
                  if (!isRecording) {
                    setUserAnswer("In my experience, React 19 handles concurrent rendering very well. By utilizing concurrent hooks and bundling components, we optimize DOM updates and can reduce UI latency by up to 35% on high-traffic pipelines.");
                  }
                }}
                className={`p-3 rounded-xl border flex items-center justify-center transition shrink-0 ${
                  isRecording 
                    ? 'bg-red-950/25 border-red-500/30 text-red-400 animate-pulse' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                }`}
                title="Mock Voice Recording Input"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !userAnswer.trim()}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 active:scale-95"
              >
                {isEvaluating ? "Evaluating Response..." : "Evaluate Answer"}
              </button>
            </div>
          </div>

          {/* Evaluation card */}
          <div className="lg:col-span-5 space-y-4">
            {isEvaluating && (
              <div className="glass-panel border-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[200px]">
                <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-zinc-400 font-bold">Auditing answer semantics...</p>
              </div>
            )}

            {!isEvaluating && evaluation === null && (
              <div className="glass-panel border-zinc-900 rounded-2xl p-8 text-center text-zinc-650 text-xs py-16 min-h-[200px] flex items-center justify-center">
                Submit your response to output AI scorecard evaluations.
              </div>
            )}

            {!isEvaluating && evaluation !== null && (
              <div className="glass-panel border-zinc-900 rounded-2xl p-5 space-y-4 animate-float">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Scorecard Results</span>
                  <div className="flex items-center space-x-1.5 text-purple-400 text-xs font-mono font-bold">
                    <Award className="w-4 h-4" />
                    <span>{evaluation.score} / 100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-cyan-400 font-mono tracking-wider">AI Feedback</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{evaluation.feedback}</p>
                </div>

                <button
                  onClick={nextQuestion}
                  className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 transition"
                >
                  {currentQIndex < activeQuestions.length - 1 ? "Next Question" : "Complete Session"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
