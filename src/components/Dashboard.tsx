/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Compass, 
  TrendingUp, 
  Award, 
  BookOpen, 
  ArrowRight, 
  Github, 
  FileCheck, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { User, PlacementReadinessResult, StudentProfile } from '../types';

interface DashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [readiness, setReadiness] = useState<PlacementReadinessResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [profileRes, readinessRes] = await Promise.all([
          fetch(`/api/profile/${user.id}`),
          fetch(`/api/readiness/${user.id}`)
        ]);

        if (profileRes.ok) {
          const p = await profileRes.json();
          setProfile(p);
        }
        if (readinessRes.ok) {
          const r = await readinessRes.json();
          setReadiness(r);
        }
      } catch (err) {
        console.error('Failed to load dashboard parameters:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center bg-[#09090b]">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" id="dashboard_loader"></div>
          <p className="mt-4 text-slate-400 font-medium text-sm">Crunching intelligent scores...</p>
        </div>
      </div>
    );
  }

  // Categories metrics map
  const chartData = [
    { name: 'Coding Challenges', Score: readiness?.codingScore || 30, Target: 90 },
    { name: 'Interview Feedback', Score: readiness?.interviewScore || 40, Target: 85 },
    { name: 'Resume ATS Match', Score: readiness?.resumeScore || 50, Target: 85 },
    { name: 'Profile Depth', Score: readiness?.profileScore || 40, Target: 100 }
  ];

  // Helper colors based on score levels
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 border';
    if (score >= 75) return 'text-emerald-450 bg-emerald-500/5 border-emerald-500/10 border';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20 border';
    return 'text-red-400 bg-red-500/10 border-red-500/20 border';
  };

  const getGuageStrokeColor = (score: number) => {
    if (score >= 75) return 'stroke-emerald-500';
    if (score >= 50) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="student_dashboard">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl bg-gradient-to-br from-neutral-900 via-zinc-950 to-black p-6 sm:p-8 text-white border border-white/5 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Compass className="h-4 w-4 text-emerald-400" />
            Empowered placement insights
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
            Welcome back, {profile?.fullName || user.name}!
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Focus Profile: <span className="font-semibold text-slate-200">{profile?.preferredRole || 'Software Development'}</span> | Group: <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded font-mono text-xs">{profile?.domain || 'Software Engineering'}</span>
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-3">
          <button
            id="dash_btn_roadmap"
            onClick={() => onNavigate('roadmap')}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 px-5 py-2.5 text-sm font-bold transition duration-200 shadow-md shadow-emerald-900/10 cursor-pointer"
          >
            Study Guide
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Metrics Gauge & Charts / Right is Status check and actionable prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Metric gauge scorecard */}
        <div className="lg:col-span-1 rounded-2xl border border-white/5 bg-[#121214] p-6 shadow-xl flex flex-col items-center justify-between text-center space-y-6">
          <div className="w-full text-left">
            <h2 className="text-lg font-bold text-slate-100">Placement Score card</h2>
            <p className="text-xs text-slate-400">Overall Readiness Index</p>
          </div>

          {/* Svg Radial Score Gauge */}
          <div className="relative flex items-center justify-center">
            <svg className="h-40 w-40" viewBox="0 0 100 100">
              <circle
                className="stroke-zinc-800"
                strokeWidth="10"
                fill="transparent"
                r="38"
                cx="50"
                cy="50"
              />
              <circle
                className={`transition-all duration-1000 ease-out ${getGuageStrokeColor(readiness?.overallScore || 0)}`}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 38}`}
                strokeDashoffset={`${2 * Math.PI * 38 * (1 - (readiness?.overallScore || 40) / 100)}`}
                strokeLinecap="round"
                fill="transparent"
                r="38"
                cx="50"
                cy="50"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold tracking-tight text-white">{readiness?.overallScore || 40}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Readiness</span>
            </div>
          </div>

          <div className={`w-full rounded-xl p-3.5 text-sm leading-relaxed ${getScoreColor(readiness?.overallScore || 40)}`}>
            <span className="block font-bold mb-1">
              Status: {readiness?.decisionStatus || 'Developing'}
            </span>
            <span className="text-xs opacity-90">
              {readiness?.insightSummary || 'Complete tests to refresh your status metrics.'}
            </span>
          </div>

          <div className="w-full text-left border-t border-white/5 pt-4">
            <p className="text-xs text-center text-slate-500 font-medium">
              Last updated: {readiness?.lastUpdated ? new Date(readiness.lastUpdated).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Categories Analysis Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#121214] p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Skill Domain Performance</h2>
            <p className="text-xs text-slate-400">Comparative analysis vs average tier-1 target requirements</p>
          </div>

          {/* Recharts Bar representation */}
          <div className="h-64 cursor-pointer" id="dash_chart_container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#f4f4f5' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#a1a1aa' }} />
                <Bar dataKey="Score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Target" fill="#27272a" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid bottom: Learning action triggers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Coding assessments trigger card */}
        <div className="rounded-xl border border-white/5 bg-[#121214] p-5 shadow-sm space-y-4 hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-2">
            <div className="h-9 w-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-200">Coding Assessments</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compile algorithmic solutions and pass rigorous unit test runs matching Leetcode platforms.
            </p>
          </div>
          <button
            id="dash_card_coding"
            onClick={() => onNavigate('coding')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2 cursor-pointer w-fit"
          >
            Start Assessment
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Resume ATS trigger */}
        <div className="rounded-xl border border-white/5 bg-[#121214] p-5 shadow-sm space-y-4 hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-2">
            <div className="h-9 w-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-200">Resume ATS Screener</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload or update your CV text parameters to scan matching keyword density ratios using Gemini logic.
            </p>
          </div>
          <button
            id="dash_card_resume"
            onClick={() => onNavigate('resume')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2 cursor-pointer w-fit"
          >
            Check Alignment
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Interview round mock simulator */}
        <div className="rounded-xl border border-white/5 bg-[#121214] p-5 shadow-sm space-y-4 hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-2">
            <div className="h-9 w-9 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-slate-200">AI Mock Interview rounds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Attend a conversational, rigorous Q&A chatbot slot evaluating design, scale and general tech.
            </p>
          </div>
          <button
            id="dash_card_interview"
            onClick={() => onNavigate('interview')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2 cursor-pointer w-fit"
          >
            Launch Interviewer
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>

      {/* Target setup disclaimer info if score is low */}
      {(!readiness || readiness.overallScore < 70) && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-450">
              Increase placement score to Ready Category (75% or higher)
            </p>
            <p className="text-xs text-slate-400">
              Complete your student profile with resume text scans, get correct answers on assessments, and finish mock chats to enhance your overall alignment matrix score.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
