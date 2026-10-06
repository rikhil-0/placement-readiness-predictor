/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, CheckSquare, Loader2, Award, Zap, Compass } from 'lucide-react';
import { User, StudentProfile } from '../types';

interface LearningRoadmapProps {
  user: User;
}

export default function LearningRoadmap({ user }: LearningRoadmapProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmapProfile() {
      try {
        const res = await fetch(`/api/profile/${user.id}`);
        if (res.ok) {
          const p = await res.json();
          setProfile(p);
        }
      } catch (err) {
        console.error('Failed loading profile for roadmap:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRoadmapProfile();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-[#09090b]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  // Generate curricular timelines dynamically based on domain selection
  const getTimelineSteps = (domain: string) => {
    const dLower = domain.toLowerCase();
    if (dLower.includes('web') || dLower.includes('full-stack') || dLower.includes('apps') || dLower.includes('mobile')) {
      return [
        {
          week: 'Week 1-2',
          title: 'Algorithmic Complexity & Foundations',
          topic: 'Master Big O notation, array window traversals, and dynamic frequency maps.',
          action: 'Solve Two Sum and Longest Palindromic Solutions on the Sandbox.',
          urgency: 'High Alert'
        },
        {
          week: 'Week 3-4',
          title: 'Asynchronous State Management & APIs',
          topic: 'Explore structured TypeScript configurations, Node.js routers, and scalable JSON-based storage structures.',
          action: 'Integrate dummy database queries and handle response state arrays gracefully.',
          urgency: 'Medium Priority'
        },
        {
          week: 'Week 5-6',
          title: 'System Design & ATS CVS Density',
          topic: 'Focus heavily on matching exact key metrics. Clean redundant descriptions and add industry keywords.',
          action: 'Run ATS Resume Screener evaluations on multiple alternate templates.',
          urgency: 'High Alert'
        },
        {
          week: 'Week 7-8',
          title: 'Interactive Conversational Simulation',
          topic: 'Express architectural decisions verbally, explaining scalability blockages, Redis integration benefits, and caching.',
          action: 'Conduct technical interview rounds with Sarah chatbot regularly.',
          urgency: 'Strategic Goal'
        }
      ];
    }
    // Otherwise fallback/data science
    return [
      {
        week: 'Week 1-2',
        title: 'Analytical Scripting & Matrix Processing',
        topic: 'Learn NumPy index matching and Pandas dataframe manipulation parameters.',
        action: 'Write clean Python loops and relational SQL database joins.',
        urgency: 'High Alert'
      },
      {
        week: 'Week 3-4',
        title: 'Predictive Modelling Foundations',
        topic: 'Explore supervised learning, Linear Regression parameters, and decision boundary graphs.',
        action: 'Design and evaluate diagnostic predictors using scikit-learn models.',
        urgency: 'Medium Priority'
      },
      {
        week: 'Week 5-6',
        title: 'Academic Data Presentational Literacy',
        topic: 'Frame data outcomes sequentially. Learn to articulate ML model constraints and variables.',
        action: 'Practice verbal reviews using our conversational chat simulator panels.',
        urgency: 'Strategic Goal'
      }
    ];
  };

  const domain = profile?.domain || 'Web Development & APIs';
  const timeline = getTimelineSteps(domain);

  return (
    <div className="space-y-8" id="learning_roadmap_page">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-emerald-400" />
          Dynamically Generated Study Roadmap
        </h1>
        <p className="text-sm text-slate-400">
          Personalized week-by-week curriculum tailored for <span className="text-emerald-450 font-bold font-sans">{domain}</span> based on your predicted tech gap matrices.
        </p>
      </div>

      <div className="w-full space-y-6">
        
        {/* Weekly Cards timeline */}
        <div className="relative border-l border-white/5 pl-6 ml-4 space-y-8">
          {timeline.map((step, idx) => (
            <div key={idx} className="relative group">
              
              {/* Timeline marker node dot */}
              <div className="absolute -left-10 top-1.5 h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
                {idx + 1}
              </div>

              <div className="rounded-xl border border-white/5 bg-[#121214] p-5 space-y-4 hover:border-emerald-500/20 transition-all duration-300">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-450 flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    {step.week}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-slate-400">
                    {step.urgency}
                  </span>
                </div>

                <div className="space-y-2 font-sans text-xs">
                  <h3 className="text-sm font-bold text-slate-105">{step.title}</h3>
                  <p className="text-slate-420 leading-relaxed">{step.topic}</p>
                </div>

                <div className="rounded bg-[#09090b] border border-white/5 p-3 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-400">
                  <CheckSquare className="h-4 w-4 text-emerald-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-slate-350 mb-0.5">Remedial Sandbox Target:</span>
                    {step.action}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Action guidelines footer card */}
        <div className="rounded-2xl border border-white/5 bg-[#121214] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.1">
              <Compass className="h-4 w-4 text-emerald-400" />
              Keep up the momentum
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              As you solve code sandbox problems and refresh CV keywords, this roadmap and placement readiness score adjusts automatically.
            </p>
          </div>
          <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded font-mono text-[10px] text-emerald-400 font-bold shrink-0">
            AUTO-REGENERATOR: ONLINE
          </span>
        </div>

      </div>

    </div>
  );
}
