/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Award, Compass, Heart, Loader2, ArrowUpRight, TrendingUp, ShieldCheck, HelpCircle } from 'lucide-react';
import { User, PlacementReadinessResult, StudentProfile } from '../types';

interface PlacementReportProps {
  user: User;
}

export default function PlacementReport({ user }: PlacementReportProps) {
  const [readiness, setReadiness] = useState<PlacementReadinessResult | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReportMetrics() {
      try {
        const [readinessRes, profileRes] = await Promise.all([
          fetch(`/api/readiness/${user.id}`),
          fetch(`/api/profile/${user.id}`)
        ]);

        if (readinessRes.ok) {
          const r = await readinessRes.json();
          setReadiness(r);
        }
        if (profileRes.ok) {
          const p = await profileRes.json();
          setProfile(p);
        }
      } catch (err) {
        console.error('Failed loading report dossier:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReportMetrics();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-[#09090b]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  const overall = readiness?.overallScore || 40;

  const getReadinessVibe = (score: number) => {
    if (score >= 85) return { text: 'Tier-1 Elite Specialist', desc: 'Outstanding theoretical competence and sandbox scores. Ready for immediate technical hiring rounds with global firms.', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    if (score >= 70) return { text: 'High Level Preparedness', desc: 'Satisfies all core algorithmic and interview structures. Suitable for competitive tech-consulting roles and system software internships.', color: 'text-emerald-400/80 border-emerald-500/10 bg-emerald-500/5' };
    if (score >= 50) return { text: 'Intermediate Competence Gaps', desc: 'Capable coding foundation but exhibits minor limitations in ATS keywords density and conversational feedback.', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
    return { text: 'Core Foundation In Development', desc: 'Needs additional algorithmic practices and portfolio optimization structure before starting off campus application cycles.', color: 'text-red-400 border-red-500/20 bg-red-500/5' };
  };

  const vibe = getReadinessVibe(overall);

  return (
    <div className="space-y-8" id="placement_report_page">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <Award className="h-6 w-6 text-emerald-450" />
          Placement Readiness Dossier
        </h1>
        <p className="text-sm text-slate-400">
          Your unified performance index and predictive tier alignment generated via AI models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dossier status header */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#121214] p-6 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-405 border-b border-white/5 pb-3">
            Readiness Category Assessment
          </h2>

          <div className={`p-5 rounded-xl border space-y-3 ${vibe.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider">{vibe.text}</span>
              <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">Score: {overall}%</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{vibe.desc}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            
            <div className="rounded-xl bg-[#09090b] p-4 border border-white/5 text-center">
              <span className="text-xs text-slate-500 block">Coding Sandbox</span>
              <span className="text-xl font-extrabold text-white mt-1 block">{readiness?.codingScore || 0}%</span>
              <span className="text-[9px] uppercase font-bold text-emerald-450">Verified</span>
            </div>

            <div className="rounded-xl bg-[#09090b] p-4 border border-white/5 text-center">
              <span className="text-xs text-slate-500 block">Interview chatbot</span>
              <span className="text-xl font-extrabold text-white mt-1 block">{readiness?.interviewScore || 0}%</span>
              <span className="text-[9px] uppercase font-bold text-emerald-450">Verified</span>
            </div>

            <div className="rounded-xl bg-[#09090b] p-4 border border-white/5 text-center">
              <span className="text-xs text-slate-500 block font-sans">ATS CV Density</span>
              <span className="text-xl font-extrabold text-white mt-1 block font-mono">{readiness?.resumeScore || 0}%</span>
              <span className="text-[9px] uppercase font-bold text-emerald-450">Verified</span>
            </div>

            <div className="rounded-xl bg-[#09090b] p-4 border border-white/5 text-center">
              <span className="text-xs text-slate-500 block">Academic CGPA</span>
              <span className="text-xl font-extrabold text-white mt-1 block">{(profile?.currentCgpa || 8.0).toFixed(1)}/10</span>
              <span className="text-[9px] uppercase font-bold text-emerald-450">Self Reporting</span>
            </div>

          </div>

          <div className="space-y-3 pt-4 border-t border-white/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Diagnostic Insights Dashboard
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {readiness?.insightSummary || 'Perform sandboxed tests and upload resume parameters to kick off diagnostic loops.'}
            </p>
          </div>
        </div>

        {/* Predictive alignment indexes */}
        <div className="lg:col-span-1 rounded-2xl border border-white/5 bg-[#121214] p-6 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-350 border-b border-white/5 pb-3">
            Company Tier Compatibility
          </h2>

          <div className="space-y-4">
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Tier-1 FAANG/Product Firms</span>
                <span className="font-mono text-emerald-400 font-bold">{overall >= 85 ? 'High (95%)' : overall >= 75 ? 'Moderate (60%)' : 'Low (30%)'}</span>
              </div>
              <div className="h-1.5 w-full bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${overall >= 85 ? 95 : overall >= 75 ? 60 : 30}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Unicorns & Start-ups</span>
                <span className="font-mono text-emerald-400 font-bold">{overall >= 75 ? 'High (90%)' : overall >= 60 ? 'Moderate (70%)' : 'Low (40%)'}</span>
              </div>
              <div className="h-1.5 w-full bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${overall >= 75 ? 90 : overall >= 60 ? 70 : 40}%` }}></div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Tech Services & Consulting</span>
                <span className="font-mono text-emerald-400 font-bold">{overall >= 50 ? 'Strong Match (98%)' : 'Moderate (55%)'}</span>
              </div>
              <div className="h-1.5 w-full bg-[#09090b] rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${overall >= 50 ? 98 : 55}%` }}></div>
              </div>
            </div>

          </div>

          <div className="rounded-xl bg-[#09090b] border border-white/5 p-4 space-y-2">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
              Strategic action advise
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              To maximize Compatibility with Tier-1 companies, maintain a CGPA of 8.5+, pass all sandboxed test cases, and achieve 75%+ score on AI technical interviews.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
