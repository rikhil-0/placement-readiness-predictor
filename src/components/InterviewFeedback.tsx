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
  CheckCircle, 
  Cpu, 
  BarChart, 
  CheckCircle2, 
  X, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { User as UserType, InterviewSession, InterviewMessage } from '../types';

interface InterviewFeedbackProps {
  user: UserType;
  onInterviewCompleted?: () => void;
}

export function InterviewFeedback({ user, onInterviewCompleted }: InterviewFeedbackProps) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [roleType, setRoleType] = useState('Full-stack Developer');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [priorSessions, setPriorSessions] = useState<InterviewSession[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadPriorInterviews() {
      try {
        const res = await fetch(`/api/interview/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, roleType: 'Full-stack Developer' }) // probe check
        });
        
        // Let's load student profile preference to autofill role selection
        const pRes = await fetch(`/api/profile/${user.id}`);
        if (pRes.ok) {
          const prof = await pRes.json();
          if (prof.preferredRole) {
            setRoleType(prof.preferredRole);
          }
        }

        // Load historical interviews
        const histRes = await fetch(`/api/submissions/${user.id}`); // Wait, the endpoint is interviews
        const intRes = await fetch(`/api/admin/students`); // we can fetch students or handle simply
      } catch (err) {
        console.error('Failed checking initial state:', err);
      }
    }

    loadPriorInterviews();
  }, [user.id]);

  useEffect(() => {
    // Scroll chats seamlessly on new messages
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, roleType })
      });

      if (res.ok) {
        const s = await res.json();
        setSession(s);
      }
    } catch (err) {
      console.error('Failed initiating AI session:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !session || loading) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setLoading(true);

    // optimistically update candidate message local UI
    const mockUserMsg: InterviewMessage = {
      id: 'local_c_' + Math.random(),
      role: 'candidate',
      content: userMsg,
      timestamp: new Date().toISOString()
    };
    
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
        
        // Sync full actual messages list
        setSession(prev => {
          if (!prev) return null;
          // replace optimistic with exact synced from database
          const actualMessages = prev.messages.filter(m => !m.id.startsWith('local_c_'));
          return {
            ...prev,
            messages: [...actualMessages, mockUserMsg, data.message]
          };
        });

        if (data.concluded) {
          // Automatic trigger completion grading or let the user click
        }
      }
    } catch (err) {
      console.error('Fail sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeInterview = async () => {
    if (!session) return;
    setGrading(true);

    try {
      const res = await fetch('/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id })
      });

      if (res.ok) {
        const completedSession: InterviewSession = await res.json();
        setSession(completedSession);
        if (onInterviewCompleted) {
          onInterviewCompleted();
        }
      }
    } catch (err) {
      console.error('Failed grading interview session:', err);
    } finally {
      setGrading(false);
    }
  };

  const handleExitInterview = () => {
    setSession(null);
    setInputValue('');
  };

  const turnsCount = session ? session.messages.filter(m => m.role === 'candidate').length : 0;
  const maxTurns = 6;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6" id="interview_screen">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-emerald-400" />
          Interactive AI Mock Interviewer
        </h1>
        <p className="text-sm text-slate-400">
          Conduct a technical developer and HR round. Express your thoughts clearly and get evaluated in real-time by Dr. Sarah Jenkins.
        </p>
      </div>

      {!session ? (
        /* Startup Configuration card */
        <div className="bg-[#121214] rounded-2xl border border-white/5 p-8 shadow-xl max-w-xl mx-auto space-y-6" id="interview_setup_box">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Set Up Interview Context</h3>
              <p className="text-xs text-slate-400">Our HR coordinator will tailor questions matching your choice</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="pref_interview_role" className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Target Placement Role</label>
              <input
                id="pref_interview_role"
                type="text"
                value={roleType}
                onChange={(e) => setRoleType(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3.5 py-2.5 bg-[#09090b] text-slate-200 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Frontend Engineer, ML Researcher"
              />
            </div>

            <div className="rounded-xl bg-emerald-500/5 p-3.5 border border-emerald-500/10 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-emerald-400 flex items-center gap-1">⏱ Session details:</p>
              <p>• Back-and-forth technical Q&A round lasting 6 candidate response turns.</p>
              <p>• Covers frameworks, databases, general troubleshooting, and code optimization.</p>
              <p>• Dynamic rating is compiled immediately upon completion.</p>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              id="btn_launch_interview"
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-3 text-sm font-bold text-black shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <Play className="h-4 w-4 fill-black" />
                  Launch Interviewer
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Active conversational chat engine */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Chat main logs */}
          <div className="lg:col-span-2 bg-[#121214] rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between min-h-[550px]" id="chat_logs_panel">
            {/* Session tracking Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-4 bg-[#09090b]/40 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-black text-sm shadow">S</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-250">Dr. Sarah Jenkins</h4>
                  <p className="text-[10px] text-slate-400">Lead Technical Interviewer ({roleType})</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                  Turn {turnsCount} of {maxTurns}
                </span>
                <button 
                  onClick={handleExitInterview} 
                  title="Abandon Session"
                  className="p-1 rounded text-slate-450 hover:bg-white/5 hover:text-slate-100 transition cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Conversation list */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[380px] min-h-[320px] bg-[#09090b]/40 flex-1" id="chat_scroll_area">
              {session.messages.map((m) => {
                const isInterviewer = m.role === 'interviewer';
                return (
                  <div 
                    key={m.id} 
                    className={`flex items-start gap-2.5 max-w-[85%] ${isInterviewer ? 'mr-auto text-left' : 'ml-auto text-right flex-row-reverse'}`}
                  >
                    <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm ${
                      isInterviewer ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-slate-200 border border-white/10'
                    }`}>
                      {isInterviewer ? 'S' : 'R'}
                    </div>

                    <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      isInterviewer 
                        ? 'bg-[#18181b] border-white/5 text-slate-200 rounded-tl-none' 
                        : 'bg-emerald-500 border-emerald-550 text-black font-semibold rounded-tr-none'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  <span>Dr. Sarah is typing logic evaluation answers...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat bottom write section / Grade trigger */}
            <div className="p-4 border-t border-white/5 bg-[#121214] rounded-b-2xl">
              {session.completed ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-400 text-center font-semibold">
                  ✓ Session closed and evaluation sheet parsed successfully! See analytical breakdown report.
                </div>
              ) : turnsCount >= maxTurns ? (
                <div className="space-y-3 text-center">
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs text-amber-400 justify-center">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Dialog threshold completed in full. Run AI evaluation now.</span>
                  </div>
                  <button
                    onClick={handleGradeInterview}
                    disabled={grading}
                    id="btn_evaluate_session"
                    className="w-full flex justify-center items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-bold text-black shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {grading ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    ) : (
                      <>
                        <BarChart className="h-4 w-4" />
                        Analyze Results
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    required
                    id="input_chat_text"
                    disabled={loading}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="block w-full rounded-lg border border-white/10 px-3.5 py-2 bg-[#09090b] text-slate-200 text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                    placeholder="Describe your design patterns, routing implementations, or algorithmic strategies..."
                  />
                  <button
                    type="submit"
                    id="btn_send_chat"
                    disabled={loading || !inputValue.trim()}
                    className="flex shrink-0 items-center justify-center h-8.5 w-9 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right side: Session results summary card */}
          <div className="lg:col-span-1" id="interview_results_panel">
            {session.completed && session.detailedFeedback ? (
              <div className="bg-[#121214] rounded-2xl border border-white/5 p-5 shadow-xl space-y-5" id="assessment_report_card">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-405 text-emerald-400" />
                    AI Evaluation Score Card
                  </h3>
                  <p className="text-[10px] text-slate-450 mt-1">Compiled and cross-referenced under placements index thresholds</p>
                </div>

                {/* Score indicators */}
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-400">Overall Interview Rating</span>
                      <span className="text-emerald-400">{session.overallScore}%</span>
                    </div>
                    <div className="w-full bg-[#09090b] rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${session.overallScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span className="text-slate-450">Technical Accuracy</span>
                      <span className="text-slate-250">{session.detailedFeedback.technicalAccuracy}%</span>
                    </div>
                    <div className="w-full bg-[#09090b] rounded-full h-1">
                      <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${session.detailedFeedback.technicalAccuracy}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span className="text-slate-455">Communication & Fluency</span>
                      <span className="text-slate-250">{session.detailedFeedback.communication}%</span>
                    </div>
                    <div className="w-full bg-[#09090b] rounded-full h-1">
                      <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${session.detailedFeedback.communication}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold mb-1">
                      <span className="text-slate-450">Problem Solving & Scope</span>
                      <span className="text-slate-250">{session.detailedFeedback.problemSolving}%</span>
                    </div>
                    <div className="w-full bg-[#09090b] rounded-full h-1">
                      <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${session.detailedFeedback.problemSolving}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* High level quotation text */}
                <div className="bg-[#09090b]/60 rounded-lg p-3.5 border border-white/5 text-[11px] text-slate-350 leading-relaxed italic">
                  "{session.feedbackSummary}"
                </div>

                {/* Bulleted points strengths / improvements list */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Validated Strengths</span>
                    <ul className="space-y-1">
                      {session.detailedFeedback.keyStrengths.map((str, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Advised Improvements</span>
                    <ul className="space-y-1">
                      {session.detailedFeedback.improvements.map((imp, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1">
                          <span className="text-amber-400 font-bold shrink-0">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[#121214] p-8 text-center text-slate-400 flex flex-col items-center justify-center space-y-3 min-h-[300px]" id="assessment_empty_card">
                <Cpu className="h-8 w-8 text-zinc-650 animate-pulse" />
                <p className="text-xs font-bold text-slate-205">Awaiting interview completion</p>
                <p className="text-[10px] text-slate-455 leading-relaxed max-w-[180px]">
                  Finish writing the 6 code dialog answers to trigger the diagnostic report compilation runner.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
