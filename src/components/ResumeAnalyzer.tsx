/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { FileText, Cpu, AlertCircle, CheckCircle2, FileCheck, ArrowUpRight, HelpCircle } from 'lucide-react';
import { User, ResumeAnalysis, StudentProfile } from '../types';

const SAMPLE_RESUMES = {
  frontend: `RIKHIL ROY
New Delhi, India | email@predictor.com | github.com/rikhil-roy

OBJECTIVE
Passionate software developer aiming for a Full-stack Developer role focusing on reliable React and Node backend architectures.

TECHNICAL SKILLS
- Frontend: HTML5, CSS3, Tailwind CSS, Javascript (ES6), React 18
- Backend: Basic Node.js, Express web servers
- Databases: MongoDB
- Tools: Git, VS Code

EXPERIENCE
Software Intern | Cloud Systems (June 2025 - August 2025)
- Created static dashboard templates using React and tailwind utility configurations
- Integrated third party REST endpoints to display dynamic metrics
- Documented internal API payloads

PROJECTS
Full-Stack E-store
- Designed interactive product grids with pagination using basic React hooks
- Written Express app endpoints to persist items inside a JSON file database`,
  
  dataScience: `JANE DOE
Mumbai, India | jane.doe@predictor.com | github.com/janedoe

OBJECTIVE
Aspiring Data Scientist with strong foundational academic background in analytical data processing and relational databases.

TECHNICAL SKILLS
- Core Languages: Python (Pandas, Numpy), SQL queries
- Databases: Postgres, SQLite
- Predictive: Simple Linear Regression models, Decision Trees
- Tools: Jupyter notebook, Git, Tableau

EXPERIENCE
Undergrad Research Intern | Systems Informatics (March 2025 - June 2025)
- Parsed academic survey logs to predict student demographics drop-offs
- Wrote nested SQL join statements to clean academic repositories datasets
- Modeled campus results predictions with average 85% accuracy using Pandas

PROJECTS
Academic Admissions Forester
- Programmed a random forest classifier to score candidates admissions factors
- Leveraged matplotlib graphs to plot core data matrices and correlations`
};

interface ResumeAnalyzerProps {
  user: User;
  onAnalysisSuccess?: () => void;
}

export function ResumeAnalyzer({ user, onAnalysisSuccess }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState('');
  const [preferredRole, setPreferredRole] = useState('Full-stack Developer');
  const [loading, setLoading] = useState(false);
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
          setResumeText(SAMPLE_RESUMES.frontend); // initial default
        }
      } catch (err) {
        console.error('Failed fetching prior ATS logs:', err);
      }
    }

    fetchLastAnalysis();
  }, [user.id]);

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
      if (onAnalysisSuccess) {
        onAnalysisSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred during parsing runs');
    } finally {
      setLoading(false);
    }
  };

  const score = currentAnalysis?.score || 0;
  const getScoreColor = (sc: number) => {
    if (sc >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (sc >= 70) return 'text-emerald-350 bg-emerald-500/5 border-emerald-500/10';
    return 'text-amber-450 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="resume_analyzer_screen">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-400" />
          AI Resume ATS & Screening Analyzer
        </h1>
        <p className="text-sm text-slate-400">
          Determine applicant-tracking-system matching index scores and get actionable guidance to survive automatic resume filter screens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Side: Text pasting panel */}
        <form onSubmit={handleAnalyze} className="lg:col-span-2 bg-[#121214] rounded-2xl border border-white/5 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h2 className="text-sm font-bold text-slate-200">CV / Resume Text Inputs</h2>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Templates:</span>
              <button
                type="button"
                id="btn_load_fe_cv"
                onClick={() => loadTemplate('frontend')}
                className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold transition cursor-pointer"
              >
                Fullstack
              </button>
              <button
                type="button"
                id="btn_load_ds_cv"
                onClick={() => loadTemplate('dataScience')}
                className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold transition cursor-pointer"
              >
                Data Sci
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="pref_role_input" className="block text-xs font-semibold text-slate-400 uppercase mb-1">Target Placement Role</label>
            <input
              id="pref_role_input"
              type="text"
              required
              value={preferredRole}
              onChange={(e) => setPreferredRole(e.target.value)}
              className="block w-full rounded-lg border border-white/10 px-3 py-1.5 bg-[#09090b] text-slate-200 sm:text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. Software Engineer, React Developer"
            />
          </div>

          <div>
            <label htmlFor="resume_content_area" className="block text-xs font-semibold text-slate-400 uppercase mb-1">Paste CV Contents</label>
            <textarea
              id="resume_content_area"
              required
              rows={14}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="block w-full rounded-lg border border-white/10 px-3 py-2 bg-[#09090b] text-slate-250 font-mono text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="Paste details, skills list, objective, projects and internships here..."
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 font-medium" id="resume_alert_error">
              {error}
            </div>
          )}

          <button
            type="submit"
            id="btn_analyzer_run"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-bold text-black shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Cpu className="h-4 w-4" />
            {loading ? 'Executing NLP evaluation...' : 'Analyze CV Metrics'}
          </button>
        </form>

        {/* Right Side: Diagnostic Reports */}
        <div className="lg:col-span-3 space-y-6">
          
          {currentAnalysis ? (
            <div className="bg-[#121214] rounded-2xl border border-white/5 p-6 shadow-xl space-y-6" id="resume_report_container">
              {/* Report Header stats */}
              <div className="flex justify-between items-center bg-[#09090b]/40 border border-white/5 p-4 rounded-xl">
                <div>
                  <h2 className="text-base font-bold text-slate-200">Screening Diagnostic</h2>
                  <p className="text-xs text-slate-400">ATS matching report against: <span className="font-semibold text-slate-300">{preferredRole}</span></p>
                </div>
                <div className={`flex flex-col items-center justify-center p-3 rounded-lg border border-white/5 ${getScoreColor(score)}`}>
                  <span className="text-3xl font-extrabold">{score}</span>
                  <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">ATS score</span>
                </div>
              </div>

              {/* parsed summary overview */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">AI Summary Scorecard</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#09090b]/60 p-3.5 rounded-lg border border-white/5">
                  {currentAnalysis.summary}
                </p>
              </div>

              {/* Strengths / Weaknesses listing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Validated Strengths (3)
                  </h3>
                  <ul className="space-y-2">
                    {currentAnalysis.strengths.map((str, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses focus */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    ATS Optimization Gaps (3)
                  </h3>
                  <ul className="space-y-2">
                    {currentAnalysis.weaknesses.map((we, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed bg-amber-500/5 p-2 rounded border border-amber-500/10">
                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">!</span>
                        {we}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Suggested core technical keywords tag system */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1">
                  <FileCheck className="h-4 w-4 text-emerald-400" />
                  Recommended Core Technical Keywords (ATS Optimized)
                </span>
                <p className="text-xs text-slate-500 italic pb-1">
                  Injecting these industry keywords inside your CV list will enhance your model placement relevance score:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.suggestedKeywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 text-xs font-semibold"
                    >
                      {kw}
                      <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 border-dashed bg-[#121214] p-12 text-center text-slate-400 space-y-4 shadow-xl" id="resume_empty_state">
              <FileText className="h-10 w-10 text-zinc-650 mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-slate-200">No screening results available</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Paste your CV content block on the left and specify your preferred alignment target to analyze industry compatibility indices.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
