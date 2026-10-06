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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ShieldAlert, 
  Users, 
  FileCheck, 
  Video, 
  Percent, 
  GraduationCap, 
  Search, 
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { User } from '../types';

interface StudentRow {
  id: string;
  email: string;
  name: string;
  role: string;
  fullName: string;
  preferredRole: string;
  domain: string;
  cgpa: number;
  overallScore: number;
  decisionStatus: string;
}

interface AnalyticsData {
  studentCount: number;
  completedResumes: number;
  completedInterviews: number;
  codingSubmissionsCount: number;
  averageScore: number;
  domainDistribution: { name: string; value: number }[];
  categoryAverages: {
    coding: number;
    resume: number;
    profile: number;
    interview: number;
  };
  scoringTiers: { name: string; count: number }[];
}

export function AdminDashboard() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('All');

  useEffect(() => {
    async function loadAdminMetrics() {
      try {
        const [studRes, analRes] = await Promise.all([
          fetch('/api/admin/students'),
          fetch('/api/admin/analytics')
        ]);

        if (studRes.ok) {
          const list = await studRes.ok ? await studRes.json() : [];
          setStudents(list);
        }
        if (analRes.ok) {
          const stats = await analRes.json();
          setAnalytics(stats);
        }
      } catch (err) {
        console.error('Failed loading admin database arrays:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center bg-[#09090b]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-450" />
      </div>
    );
  }

  // Pre-configured colors for tier pie plots
  const COLORS = ['#3f3f46', '#eab308', '#10b981', '#34d399'];

  // Match list against client filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.preferredRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'All' || student.decisionStatus === tierFilter;
    return matchesSearch && matchesTier;
  });

  const categoryChartData = analytics ? [
    { name: 'Coding Code runs', Average: analytics.categoryAverages.coding },
    { name: 'Interview Feedback', Average: analytics.categoryAverages.interview },
    { name: 'Resume ATS scans', Average: analytics.categoryAverages.resume },
    { name: 'Profiles completeness', Average: analytics.categoryAverages.profile }
  ] : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" id="admin_dashboard_screen">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-emerald-400" />
          University Placement Analytics & Admin Console
        </h1>
        <p className="text-sm text-slate-400">
          Executive view of campus recruitment indices. Screen individual alignments, assess cohort averages, and distribute targeted coaching plans.
        </p>
      </div>

      {/* Stats Counter tiles */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="admin_stats_grid">
          
          <div className="rounded-2xl border border-white/5 bg-[#121214] p-5 shadow-xl flex items-center gap-4">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Onboarded Students</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{analytics.studentCount}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#121214] p-5 shadow-xl flex items-center gap-4">
            <div className="rounded-xl bg-[#18181b] p-3 text-emerald-450 shrink-0">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Resumes Screened</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{analytics.completedResumes}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#121214] p-5 shadow-xl flex items-center gap-4">
            <div className="rounded-xl bg-[#18181b] p-3 text-slate-400 shrink-0">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Mock Interviews</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{analytics.completedInterviews}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#121214] p-5 shadow-xl flex items-center gap-4">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-450 shrink-0">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase text-slate-400">Placements Avg Index</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{analytics.averageScore}%</span>
            </div>
          </div>

        </div>
      )}

      {/* Visual Analytics graphs grids */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="admin_graphs_grid">
          
          {/* Section: category averages */}
          <div className="bg-[#121214] rounded-2xl border border-white/5 p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">Placements Category performance</h3>
              <p className="text-xs text-slate-400">Average scoring profiles for students in cohort</p>
            </div>

            <div className="h-64 cursor-pointer" id="average_distribution_chart_container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" fontSize={11} stroke="#64748b" tickLine={false} />
                  <YAxis domain={[0, 100]} fontSize={11} stroke="#64748b" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="Average" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section: scoring tiers limits pie */}
          <div className="bg-[#121214] rounded-2xl border border-white/5 p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">Placement Cohort Distribution</h3>
              <p className="text-xs text-slate-400">Student shares segregated by recruitment categorizing scales</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4" id="cohort_distribution_tiers">
              <div className="h-48 cursor-pointer relative" id="pie_chart_container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.scoringTiers}
                      cx="55%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {analytics.scoringTiers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="space-y-2">
                {analytics.scoringTiers.map((tier, rIdx) => (
                  <div key={rIdx} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[rIdx % COLORS.length] }}></span>
                      <span className="text-slate-350 truncate max-w-[150px]">{tier.name}</span>
                    </div>
                    <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold mr-1">{tier.count} stud</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Cohort Candidates tracking list table */}
      <div className="bg-[#121214] rounded-2xl border border-white/5 p-6 shadow-xl space-y-4" id="cohorts_table_section">
        
        {/* Table header inputs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Onboarded Candidate Tracking sheet</h3>
            <p className="text-xs text-slate-400">Verify specific diagnostics outputs, code completions, and portfolios links</p>
          </div>

          {/* Filters controls */}
          <div className="flex flex-wrap gap-2">
            
            {/* Search */}
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                id="search_cand_input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-white/10 pl-9 pr-3 py-1.5 bg-[#09090b] text-slate-100 text-xs focus:border-emerald-500 outline-none"
                placeholder="Search candidates name..."
              />
            </div>

            {/* Selector */}
            <select
              id="filter_tier_selector"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#09090b] text-slate-250 px-3 py-1.5 text-xs focus:border-emerald-500 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Excellent Match">Excellent Matches</option>
              <option value="Ready with Minor Gaps">Ready with Gaps</option>
              <option value="Developing">Developing Candidates</option>
              <option value="Needs Attention">Requires Attention</option>
            </select>

          </div>
        </div>

        {/* Tabular data structure */}
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="min-w-full divide-y divide-white/5 text-left text-xs text-slate-400">
            <thead className="bg-[#09090b]/80 text-slate-205 font-bold">
              <tr>
                <th scope="col" className="px-5 py-3.5">Name / Email</th>
                <th scope="col" className="px-5 py-3.5">Position Pref</th>
                <th scope="col" className="px-5 py-3.5">Focus Domain</th>
                <th scope="col" className="px-5 py-3.5">CGPA</th>
                <th scope="col" className="px-5 py-3.5">Matching Index</th>
                <th scope="col" className="px-5 py-3.5 text-center">ATS Status Alignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#121214]" id="admin_candidates_tbody">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((stud) => {
                  const getBadgeColor = (st: string) => {
                    if (st === 'Excellent Match') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    if (st === 'Ready with Minor Gaps') return 'text-emerald-305 bg-emerald-500/5 border-emerald-500/10';
                    if (st === 'Developing') return 'text-amber-400 bg-amber-500/15 border-amber-500/20';
                    return 'text-red-400 bg-red-500/15 border-red-500/20';
                  };

                  return (
                    <tr key={stud.id} className="hover:bg-white/5 transition">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-100">{stud.fullName}</div>
                        <div className="text-[10px] text-slate-450 mt-0.5">{stud.email}</div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-200">{stud.preferredRole}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-[11px]">{stud.domain}</td>
                      <td className="px-5 py-4 whitespace-nowrap font-bold font-mono text-slate-300">{stud.cgpa.toFixed(1)}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold font-mono text-emerald-400 text-sm">{stud.overallScore}%</span>
                          <span className="text-[10px] text-slate-450">Match</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-center">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getBadgeColor(stud.decisionStatus)}`}>
                          {stud.decisionStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 italic">
                    No candidates matched the current search or filters criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
