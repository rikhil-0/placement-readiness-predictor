/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  GraduationCap, 
  Play, 
  CheckCircle2, 
  Cpu, 
  BarChart, 
  X, 
  Loader2,
  AlertCircle,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { User as UserType, InterviewSession, InterviewMessage } from '../types';

interface InterviewFeedbackProps {
  user: UserType;
}

export default function InterviewFeedback({ user }: InterviewFeedbackProps) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [roleType, setRoleType] = useState('Full-stack Developer');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadPriorInterviews() {
      try {
        const pRes = await fetch(`/api/profile/${user.id}`);
        if (pRes.ok) {
          const prof = await pRes.json();
          if (prof.preferredRole) {
            setRoleType(prof.preferredRole);
          }
        }
      } catch (err) {
        console.error('Failed checking initial state:', err);
      }
    }

    loadPriorInterviews();
  }, [user.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, roleType })
      });

      if (res.ok) {
        const s = await res.json();
        setSession(s);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed initiating AI session. Please try again.');
      }
    } catch (err) {
      console.error('Failed initiating AI session:', err);
      setError('Connection failed. Please verify the backend service is active.');
    } finally {
      setLoading(false);
    }
  };

  // Keep both names in case check calls either
  const handleStartInterview = startInterview;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !session || loading) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setLoading(true);
    setError(null);

    const mockUserMsg: InterviewMessage = {
      id: 'local_c_' + Math.random(),
      role: 'candidate',
      content: userMsg,
      timestamp: new Date().toISOString()
    };
    
    // Add candidate reply locally for instant feedback
    setSession(prev => prev ? { ...prev, messages: [...prev.messages, mockUserMsg] } : null);

    try {
      const res = await fetch('/api/interview/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          userMessage: userMsg
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        setSession(prev => {
          if (!prev) return null;
          const actualMessages = prev.messages.filter(m => !m.id.startsWith('local_c_'));
          return {
            ...prev,
            messages: [...actualMessages, mockUserMsg, data.message],
            completed: prev.completed
          };
        });
      } else {
        setError('Failed responding to session. Please try resending.');
      }
    } catch (err) {
      console.error('Fail sending message:', err);
      setError('Connection disrupted. Please check your internet connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeInterview = async () => {
    if (!session) return;
    setGrading(true);
    setError(null);

    try {
      const res = await fetch('/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id })
      });

      if (res.ok) {
        const completedSession: InterviewSession = await res.json();
        setSession(completedSession);
      } else {
        setError('Failed evaluating conversational logs. Please retry.');
      }
    } catch (err) {
      console.error('Failed grading interview session:', err);
      setError('Service unavailable while calculating scorecard.');
    } finally {
      setGrading(false);
    }
  };

  const handleExitInterview = () => {
    setSession(null);
    setInputValue('');
    setError(null);
  };

  const turnsCount = session ? session.messages.filter(m => m.role === 'candidate').length : 0;
  const maxTurns = 6;

  return (
    <div className="space-y-6" id="interview_chat_page">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-emerald-400" />
          Interactive AI Mock Interviewer
        </h1>
        <p className="text-sm text-slate-400">
          Conduct a technical developer and HR round. Express your thoughts clearly and get evaluated in real-time by Dr. Sarah Jenkins.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-left" id="interview_error_alert">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-400" />
          <p className="font-mono">{error}</p>
        </div>
      )}

      {!session ? (
        /* Startup Configuration card */
        <div className="bg-[#121214] rounded-2xl border border-[#white/5] border-white/5 p-8 shadow-xl w-full space-y-6" id="interview_setup_box">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Set Up Interview Context</h3>
              <p className="text-xs text-slate-400">Configure parameters before requesting Sarah back online</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="int_role_input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Target Developer Role</label>
              <input
                id="int_role_input"
                type="text"
                value={roleType}
                onChange={(e) => setRoleType(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3.5 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-650 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
              />
            </div>

            <div className="rounded-lg bg-zinc-950/40 p-4 border border-white/5 text-xs text-slate-400 leading-relaxed space-y-2">
              <p className="font-bold text-slate-350">⚠️ Chat Simulation Limits:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>You will take turns answering technical and behavioral questions.</li>
                <li>Write comprehensive structured paragraphs for maximum scoring weights.</li>
                <li>The interface calculates grammar correctness and response latency.</li>
              </ul>
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 text-sm font-bold transition duration-205 shadow-md shadow-emerald-900/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Booting Interview Session...' : 'Start Interview'}
              <Play className="h-4 w-4 text-black" />
            </button>
          </div>
        </div>
      ) : (
        /* Chat Simulator and Outcomes splits */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chat Window: spans 2 cols */}
          <div className="lg:col-span-2 flex flex-col h-[520px] bg-[#121214] rounded-2xl border border-white/5 overflow-hidden shadow-xl" id="interview_dashboard_grid">
            
            {/* Header control */}
            <div className="bg-[#18181b] border-b border-white/5 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-xs font-bold text-emerald-450 uppercase tracking-widest font-mono">
                  CHAT ACTIVE: DR. SARAH JENKINS
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-mono">
                  Turns: {turnsCount} / {maxTurns}
                </span>
                <button
                  onClick={handleExitInterview}
                  className="rounded text-slate-400 hover:text-white transition duration-150 cursor-pointer"
                  title="Exit chat session"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages body with correct vertical styling */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0c0c0e] flex flex-col">
              {session.messages.map((m) => {
                const isSarah = m.role === 'interviewer';
                return (
                  <div key={m.id} className={`flex gap-3 max-w-[85%] ${isSarah ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border ${
                      isSarah 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-mono' 
                        : 'bg-zinc-800 border-white/10 text-slate-100 font-mono'
                    }`}>
                      {isSarah ? 'SJ' : 'ME'}
                    </div>
                    <div className={`rounded-xl p-3.5 text-xs leading-relaxed ${
                      isSarah 
                        ? 'bg-[#121214] text-slate-200 border border-white/5' 
                        : 'bg-emerald-500/10 text-slate-100 border border-emerald-500/15'
                    }`}>
                      <p className="whitespace-pre-line">{m.content}</p>
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex items-center gap-3 max-w-[80%] self-start">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">SJ</div>
                  <div className="rounded-xl px-4 py-2.5 bg-[#121214] text-slate-400 border border-white/5 text-xs flex items-center gap-1.5 font-mono">
                    <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                    typing out diagnostic evaluation...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Message form dock */}
            <div className="p-4 bg-[#18181b] border-t border-white/5">
              {session.completed ? (
                <div className="text-center py-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/10 rounded px-2.5 py-1">
                    ✓ Chat complete. See scorecard report on the side panel!
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 rounded-lg border border-white/10 px-3.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs transition duration-150 py-2.5 h-10"
                    placeholder={turnsCount >= maxTurns ? 'Dialogue quota complete! Please click "Grade Session" on the right now.' : 'Answer the query clearly. Maintain strong paragraphs...'}
                  />
                  <button
                    type="submit"
                    disabled={loading || turnsCount >= maxTurns}
                    className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-4 flex items-center justify-center font-bold transition disabled:opacity-40 cursor-pointer h-10 shrink-0"
                  >
                    <Send className="h-4 w-4 text-black" />
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Rating Assessment list */}
          <div className="lg:col-span-1 rounded-2xl border border-white/5 bg-[#121214] p-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-350 border-b border-white/5 pb-2.5">
                Live Evaluation Metrics
              </h3>

              {session.completed ? (
                <div className="space-y-5" id="graded_results_segment">
                  
                  {/* Visual scorecard feedback */}
                  <div className="bg-emerald-500/5 rounded-xl border border-emerald-500/15 p-4 text-center space-y-3">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400 mx-auto" />
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Conversational Score</h4>
                      <p className="text-3xl font-extrabold text-white mt-0.5">{session.overallScore || 40}%</p>
                    </div>
                  </div>

                  {/* Diagnostic notes summary */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Sarah's Diagnostic Notes</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-[#0a0a0c] p-3 rounded-xl border border-white/5 whitespace-pre-wrap">{session.feedbackSummary}</p>
                  </div>

                  {/* Detailed metrics categories */}
                  {session.detailedFeedback && (
                    <div className="space-y-3 border-t border-white/5 pt-4 text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Category Grades</span>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Technical Accuracy</span>
                            <span className="font-mono text-emerald-400">{session.detailedFeedback.technicalAccuracy}%</span>
                          </div>
                          <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${session.detailedFeedback.technicalAccuracy}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Fluency & Communication</span>
                            <span className="font-mono text-emerald-400">{session.detailedFeedback.communication}%</span>
                          </div>
                          <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${session.detailedFeedback.communication}%` }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Problem Solving</span>
                            <span className="font-mono text-emerald-400">{session.detailedFeedback.problemSolving}%</span>
                          </div>
                          <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${session.detailedFeedback.problemSolving}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Display Key Strengths & Improvements */}
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        {session.detailedFeedback.keyStrengths && session.detailedFeedback.keyStrengths.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-400 font-mono">Key Highlights</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-400">
                              {session.detailedFeedback.keyStrengths.map((str, index) => (
                                <li key={index}>{str}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {session.detailedFeedback.improvements && session.detailedFeedback.improvements.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-amber-500 font-mono">Recommended Focus</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-400">
                              {session.detailedFeedback.improvements.map((imp, index) => (
                                <li key={index}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  <button
                    onClick={handleExitInterview}
                    className="block w-full text-center rounded-xl border border-white/10 hover:bg-white/5 text-xs text-slate-300 py-2.5 transition cursor-pointer font-bold"
                  >
                    Restart New Session
                  </button>

                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block font-mono">Current Session ID</span>
                    <code className="block bg-[#09090b] text-[10px] font-mono text-emerald-400 p-2.5 rounded border border-white/5 truncate">
                      {session.id}
                    </code>
                  </div>

                  <div className="rounded-lg bg-zinc-950/40 border border-white/5 p-4 text-xs text-slate-400 space-y-3 leading-relaxed">
                    <p className="font-semibold text-slate-250 flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-emerald-400" />
                      Wrap up instructions
                    </p>
                    <p>When you have completed at least 3 rounds of QA exchange, compile your scorecard. Dr. Sarah Jenkins will analyze your detailed transcript dynamically.</p>
                  </div>

                  <button
                    onClick={handleGradeInterview}
                    disabled={grading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black hover:-translate-y-0.5 px-4 py-3 text-xs font-bold transition duration-200 shadow-lg shadow-emerald-900/10 cursor-pointer disabled:opacity-50"
                  >
                    {grading ? 'Evaluating Transcript...' : 'Analyze & Grade Dialogue'}
                    <BarChart className="h-4 w-4 text-black" />
                  </button>
                </div>
              )}
            </div>

            {/* Quick link button to roadmap if complete */}
            {session.completed && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <a
                  href="/roadmap"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0c] border border-white/5 text-xs hover:border-emerald-505/20 transition cursor-pointer text-slate-300"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-400" />
                    Load Skill-Gap Roadmap
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
                </a>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
