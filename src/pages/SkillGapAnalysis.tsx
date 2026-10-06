/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { User, StudentProfile } from '../types';

interface SkillGapAnalysisProps {
  user: User;
}

export default function SkillGapAnalysis({ user }: SkillGapAnalysisProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGapParameters() {
      try {
        const res = await fetch(`/api/profile/${user.id}`);
        if (res.ok) {
          const p = await res.json();
          setProfile(p);
        }
      } catch (err) {
        console.error('Failed fetching profile for skill gaps:', err);
      } finally {
        setLoading(false);
      }
    }

    loadGapParameters();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-[#09090b]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  // Derive standard target skills according to student's preferred role
  const getStandardExpectations = (role: string) => {
    const rLower = role.toLowerCase();
    if (rLower.includes('frontend') || rLower.includes('web') || rLower.includes('full-stack') || rLower.includes('developer')) {
      return {
        tech: ['TypeScript', 'React', 'CSS Grid & Flexbox', 'Node/Express APIs', 'MySQL / Postgres PG SQL', 'System Design fundamentals'],
        soft: ['Technical Dialogue articulation', 'Algorithmic logic explanation', 'Peer review collaboration']
      };
    }
    if (rLower.includes('data') || rLower.includes('machine') || rLower.includes('model') || rLower.includes('science')) {
      return {
        tech: ['Python (Pandas/Numpy)', 'SQL relational queries', 'Linear Regression Models', 'Scikit-learn', 'Data scrubbing & cleaning'],
        soft: ['Analytical data presentation', 'Hypothesis testing dialogue', 'Cross-functional telemetry syncing']
      };
    }
    return {
      tech: ['Data Structures & Algorithms', 'REST API Architecture', 'Git command lines', 'SQL fundamentals'],
      soft: ['Articulating edge cases', 'Resume layout framing', 'System diagnostic logs verbalization']
    };
  };

  const currentRole = profile?.preferredRole || 'Full-stack Developer';
  const target = getStandardExpectations(currentRole);

  const parsedSkills = profile?.skills || [];
  const lowercaseOwnSkills = parsedSkills.map(s => s.toLowerCase().trim());

  // Tech items matched / missed
  const matchedTech = target.tech.filter(std => lowercaseOwnSkills.some(own => own.includes(std.toLowerCase()) || std.toLowerCase().includes(own)));
  const missingTech = target.tech.filter(std => !lowercaseOwnSkills.some(own => own.includes(std.toLowerCase()) || std.toLowerCase().includes(own)));

  return (
    <div className="space-y-8" id="skill_gap_analysis_page">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <Layers className="h-6 w-6 text-emerald-400" />
          Intellectual Skill Gap Index
        </h1>
        <p className="text-sm text-slate-400">
          Target role: <span className="font-semibold text-slate-200">{currentRole}</span>. A dynamic comparison of your Technology Inventory against industry expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Visual Comparison cards */}
        <div className="rounded-2xl border border-white/5 bg-[#121214] p-6 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-350 border-b border-white/5 pb-3">
            Core Target Capabilities Alignment
          </h2>

          <div className="space-y-4">
            
            {/* Matched box */}
            <div className="bg-[#09090b] rounded-xl p-4 border border-white/5 space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-450 block">Matched Technology Targets</span>
              {matchedTech.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedTech.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 text-xs text-emerald-400 font-medium">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No exact matches yet. Complete your technology inventory tags inside your Academic Profile page.</p>
              )}
            </div>

            {/* Gaps box */}
            <div className="bg-[#09090b] rounded-xl p-4 border border-white/5 space-y-3 animate-pulse">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block">Identified Technical Gaps</span>
              {missingTech.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingTech.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1 text-xs text-amber-450 font-medium">
                      ! {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-450 font-bold italic">No technical gaps! You align with all market expectation standards.</p>
              )}
            </div>

          </div>
        </div>

        {/* Diagnostic remediation guides */}
        <div className="rounded-2xl border border-white/5 bg-[#121214] p-6 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-350 border-b border-white/5 pb-3">
            Non-Technical / Behavioral Gaps
          </h2>

          <div className="space-y-4">
            {target.soft.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#0a0a0c] p-3.5 rounded-xl border border-white/5">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-200">{item}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Requires consistent conversational exercise. Use the Mock Interview simulator chatbot to develop clear verbal explanations for technical complexities.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
