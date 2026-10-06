/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { FileText, Cpu, AlertCircle, CheckCircle2, FileCheck, ArrowUpRight, HelpCircle } from 'lucide-react';
import { User, ResumeAnalysis, StudentProfile } from '../types';

const SAMPLE_RESUMES = {
  frontend: `CANDIDATE NAME
your.email@example.com | github.com/your-username

OBJECTIVE
Passionate software engineer aiming for a Frontend Developer or Full-stack role focusing on high-performance React applications and modern Node.js backend architectures.

TECHNICAL SKILLS
- Frontend: HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), React 18, TypeScript, Next.js
- Backend: Node.js, Express web servers, REST API integration
- Databases: PostgreSQL, MongoDB, caching with Redis
- Tools: Git, GitHub, VS Code, Docker, Webpack/Vite

EXPERIENCE
Frontend Developer Intern | Tech Innovations Inc. (June 2025 - August 2025)
- Engineered scalable responsive dashboards using Tailwind CSS utility patterns.
- Integrated third-party REST endpoints to render dynamic, high-performance web visuals.
- Maintained complex state synchronizations using modern React context and custom hooks.

PROJECTS
Full-Stack Product Catalog
- Designed fluid layouts with React and local storage caching.
- Authored REST endpoints via Express and PostgreSQL queries to persist item catalog.`,
  
  dataScience: `CANDIDATE NAME
your.email@example.com | github.com/your-username

OBJECTIVE
Aspiring Data Scientist with strong technical foundations in statistical analysis, machine learning algorithms, and deep relational databases.

TECHNICAL SKILLS
- Core Programming: Python (Pandas, NumPy, Scikit-Learn), SQL queries
- Databases: PostgreSQL, SQLite, MySQL
- Predictive Modeling: Regression, Decision Trees, Random Forests, XGBoost
- Tools: Jupyter Notebook, Tableau, Github, Docker, Hadoop

EXPERIENCE
Data Analyst Intern | Global Analytics Systems (March 2025 - June 2025)
- Automated academic logs processing pipeline using Python to predict registration trends.
- Co-developed data-cleaning modules handling complex datasets using Pandas.
- Crafted interactive dashboard reports in Tableau for stakeholders presentations.

PROJECTS
Performance Forester
- Programmed a random forest classifier to evaluate enrollment predictors.
- Utilized matplotlib to plot feature importance and high-contrast correlation matrices.`
};

interface ResumeAnalyzerProps {
  user: User;
}

export default function ResumeAnalyzer({ user }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState('');
  const [preferredRole, setPreferredRole] = useState('Full-stack Developer');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Analyzing Resume...');
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLastAnalysis() {
      try {
        const pRes = await fetch(`/api/profile/${user.id}`);
        if (pRes.ok) {
          const profile: StudentProfile = await pRes.json();
          setPreferredRole(profile.preferredRole || 'Full-stack Developer');
        }

        const res = await fetch(`/api/resume/${user.id}`);
        if (res.ok) {
          const r = await res.json();
          setCurrentAnalysis(r);
          setResumeText(r.resumeText || '');
        } else {
          setResumeText('');
        }
      } catch (err) {
        console.error('Failed fetching prior ATS logs:', err);
      }
    }

    fetchLastAnalysis();
  }, [user.id]);

  useEffect(() => {
    if (!loading) return;
    const stages = [
      'Analyzing Resume...',
      'Generating ATS Report...',
      'Matching Keywords...'
    ];
    let currentStage = 0;
    setLoadingMessage(stages[0]);
    const interval = setInterval(() => {
      currentStage = (currentStage + 1) % stages.length;
      setLoadingMessage(stages[currentStage]);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  const loadTemplate = (type: 'frontend' | 'dataScience') => {
    setResumeText(SAMPLE_RESUMES[type]);
    if (type === 'frontend') {
      setPreferredRole('Full-stack Developer');
    } else {
      setPreferredRole('Data Scientist');
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please copy-paste or write your resume text first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          filename: 'cv_profile_scan.txt',
          resumeText,
          preferredRole
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute ATS scanner');
      }

      setCurrentAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Error occurred during parsing runs');
    } finally {
      setLoading(false);
    }
  };

  const score = currentAnalysis?.score || 0;
  const isVeryShort = resumeText.trim().length > 0 && resumeText.trim().length < 150;

  return (
    <div className="space-y-8" id="resume_analyzer_page">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-400" />
          ATS Resume Screener & Enhancer
        </h1>
        <p className="text-sm text-slate-400">
          Paste your professional CV text. Gemini will evaluate matching density rates and suggest actionable missing keyword components.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Form area */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-white/5 bg-[#121214] p-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Enter Resume Text Data</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => loadTemplate('frontend')}
                  className="rounded px-2 py-1 text-[10px] font-bold bg-white/5 border border-white/5 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-450 hover:border-emerald-500/15 transition cursor-pointer"
                >
                  Frontend Dev Template
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate('dataScience')}
                  className="rounded px-2 py-1 text-[10px] font-bold bg-white/5 border border-white/5 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-450 hover:border-emerald-500/15 transition cursor-pointer"
                >
                  Data Science Template
                </button>
              </div>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label htmlFor="target_role" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-1.5">Target Placement Role</label>
                <input
                  id="target_role"
                  type="text"
                  required
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 px-3.5 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-650 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
                  placeholder="e.g. Full-stack Developer, backend Engineer"
                />
              </div>

              <div>
                <label htmlFor="cv_text_input" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 mb-1.5">Resume / CV text stream</label>
                <textarea
                  id="cv_text_input"
                  rows={14}
                  required
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 p-3.5 bg-[#09090b] text-slate-300 font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                  placeholder="Copy and paste entire CV content segments here..."
                />
              </div>

              {isVeryShort && (
                <div className="rounded-lg bg-amber-955/20 p-3.5 text-xs text-amber-400 border border-amber-900/30 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>⚠️ <strong>Highly Recommended:</strong> Your resume text appears to be very short (under 150 characters). For a valid ATS keyword scan, consider pasting your complete education, skills, and projects sections.</span>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-950/30 p-3.5 text-xs text-red-400 border border-red-900/40 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 text-sm font-bold transition duration-200 shadow-md shadow-emerald-900/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Analyzing with Gemini...' : 'Scan Resume Alignment Score'}
                <Cpu className="h-4 w-4" />
              </button>

            </form>
          </div>
        </div>

        {/* ATS Insights report column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-white/5 bg-[#121214] p-5 space-y-6 h-full min-h-[400px]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2.5">
              ATS Keyword Alignment Report
            </h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                  <FileText className="h-5 w-5 text-emerald-400 absolute top-3.5 left-3.5 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-200">{loadingMessage}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">calculating NLP parameters</p>
                </div>
              </div>
            ) : currentAnalysis ? (
              <div className="space-y-6" id="ats_analysis_content">
                
                {/* Score rating segment */}
                <div className="flex items-center gap-4 bg-zinc-950/40 rounded-xl p-4 border border-white/5">
                  <div className="relative flex items-center justify-center">
                    <svg className="h-16 w-16" viewBox="0 0 36 36">
                      <circle className="stroke-zinc-800" strokeWidth="3" fill="none" r="16" cx="18" cy="18" />
                      <circle
                        className={`transition-all duration-700 ease-out ${
                          score >= 75 ? 'stroke-emerald-500' : score >= 50 ? 'stroke-amber-500' : 'stroke-red-500'
                        }`}
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={100 - score}
                        strokeLinecap="round"
                        fill="none"
                        r="16"
                        cx="18"
                        cy="18"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                    <span className="absolute text-sm font-extrabold text-white">{score}%</span>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">ATS Compatibility Score</h4>
                    <p className="text-sm font-bold text-slate-200 mt-1">
                      {score >= 75 ? 'Strong Competitive Match' : score >= 50 ? 'Moderate alignment gaps' : 'Improvement Needed'}
                    </p>
                  </div>
                </div>

                {/* Executive Summary & Dynamic ATS Review */}
                {currentAnalysis.summary && (
                  <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-lg border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block pb-1">Executive Summary & Feedback</span>
                    <p className="font-sans leading-relaxed text-slate-300">{currentAnalysis.summary}</p>
                  </div>
                )}

                {/* Detected Keywords and Missing items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-450 block">Key Strengths</span>
                    {currentAnalysis.strengths && currentAnalysis.strengths.length > 0 ? (
                      <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4 leading-relaxed font-sans">
                        {currentAnalysis.strengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">None analyzed yet</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block">Suggested ATS Keywords</span>
                    {currentAnalysis.suggestedKeywords && currentAnalysis.suggestedKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {currentAnalysis.suggestedKeywords.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/5 text-amber-400 border border-amber-500/10 font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">None compiled yet</p>
                    )}
                  </div>
                </div>

                {/* Bullet items list */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Content Gaps & Improvements</span>
                  {currentAnalysis.weaknesses && currentAnalysis.weaknesses.length > 0 ? (
                    <ul className="space-y-2 pl-3 list-disc text-xs text-slate-300 leading-relaxed">
                      {currentAnalysis.weaknesses.map((bullet, idx) => (
                        <li key={idx} className="marker:text-emerald-450">{bullet}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-450 font-bold italic">Perfect alignment analyzed! No additional gaps reported.</p>
                  )}
                </div>

                {/* Interactive help box */}
                <div className="rounded-lg bg-[#18181b] border border-white/5 p-4 flex gap-3 text-xs leading-relaxed text-slate-300">
                  <span className="mt-0.5 text-xs">💡</span>
                  <p>
                    <strong>Action:</strong> Copy some of the Suggested ATS Keywords list and integrate them smoothly into your technology fields inside the <code className="text-emerald-455 bg-[#09090b] px-1 py-0.5 rounded font-mono text-[10px]">Academic Profile</code> route.
                  </p>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 italic text-xs text-center space-y-2">
                <FileCheck className="h-10 w-10 text-zinc-700" />
                <p>Submit your resume strings to generate compatibility indexes, parsing reports, and bullet advice instantly.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
