/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Percent, 
  Grid, 
  Search, 
  UserCheck, 
  GraduationCap, 
  RefreshCw, 
  Loader2,
  FileSpreadsheet
} from 'lucide-react';
import { User } from '../types';

interface StudentRow {
  id: string;
  name: string;
  email: string;
  fullName: string;
  preferredRole: string;
  domain: string;
  cgpa: number;
  overallScore: number;
  decisionStatus: string;
}

interface AdminAnalytics {
  totalStudents: number;
  averageScore: number;
  readyCount: number;
  domainDispersal: Record<string, number>;
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try {
      const [studentsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/students'),
        fetch('/api/admin/analytics')
      ]);

      if (studentsRes.ok) {
        const list = await studentsRes.ok ? await studentsRes.json() : [];
        setStudents(list);
      }
      if (analyticsRes.ok) {
        const stats = await analyticsRes.json();
        setAnalytics(stats);
      }
    } catch (err) {
      console.error('Failed loading admin analytics records:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.preferredRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.decisionStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-[#09090b]">
        <div className="text-center font-mono text-zinc-500 space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400 mx-auto" />
          <p className="text-xs uppercase tracking-widest animate-pulse">Scanning relational analytics databases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="admin_dashboard_panel">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-450" />
            Administrative Placement Analytics
          </h1>
          <p className="text-sm text-slate-400">
            Audit campus cohort readiness ratios, search student records, and evaluate general readiness percentiles.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-[#121214] border border-white/5 rounded-xl text-slate-300 hover:bg-neutral-950 transition cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          {refreshing ? 'Syncing...' : 'Sync Tables'}
        </button>
      </div>

      {/* Analytics Summary Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="admin_stats_cards">
        
        {/* Total enrolled students */}
        <div className="bg-[#121214] border border-white/5 p-5 rounded-2xl shadow flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-slate-500 block font-semibold">Total Students</span>
            <span className="text-3xl font-extrabold tracking-tight text-white block">{analytics?.totalStudents || students.length}</span>
            <span className="text-[10px] text-zinc-450 block">Active predictive onboarding</span>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 rounded-xl border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Global Average Readiness */}
        <div className="bg-[#121214] border border-white/5 p-5 rounded-2xl shadow flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-slate-500 block font-semibold">Cohort Avg Rating</span>
            <span className="text-3xl font-extrabold tracking-tight text-white block">{Math.round(analytics?.averageScore || 50)}%</span>
            <span className="text-[10px] text-zinc-450 block">Aggregated sandbox & ATS</span>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 rounded-xl border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        {/* Confirmed Ready Cohort Count */}
        <div className="bg-[#121214] border border-white/5 p-5 rounded-2xl shadow flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-slate-500 block font-semibold">Ready Students</span>
            <span className="text-3xl font-extrabold tracking-tight text-white block">{analytics?.readyCount || 0}</span>
            <span className="text-[10px] text-zinc-450 block">Placement readiness index &gt;= 75%</span>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 rounded-xl border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Student Audit lists table card */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl shadow-xl overflow-hidden space-y-4 p-5">
        
        {/* Table top control bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-350 flex items-center gap-1.5 self-start">
            <FileSpreadsheet className="h-4 w-4 text-emerald-450" />
            Enrolled Student Directory
          </h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="h-4 w-4 text-slate-500 absolute top-3 left-3" />
            <input
              type="text"
              id="student_directory_search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-white/10 pl-9 pr-3.5 py-2.1 bg-[#09090b] text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition duration-150 h-9"
              placeholder="Filter names, roles, or status directives..."
            />
          </div>
        </div>

        {/* Actual Table */}
        <div className="overflow-x-auto" id="student_records_table_wrapper">
          <table className="min-w-full text-xs text-slate-300">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-550 uppercase font-mono">
                <th className="py-3 px-4 font-bold">NAME / PROFILE</th>
                <th className="py-3 px-4 font-bold">STREAM / FOCUS</th>
                <th className="py-3 px-4 font-bold">PREFERRED TARGET</th>
                <th className="py-3 px-4 font-bold">CGPA</th>
                <th className="py-3 px-4 font-bold">ALIGN SCORE</th>
                <th className="py-3 px-4 font-bold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition duration-150">
                    <td className="py-4 px-4 font-medium text-white">
                      <div>
                        <span className="block font-bold">{s.fullName}</span>
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{s.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-medium">{s.domain}</td>
                    <td className="py-4 px-4 font-bold text-slate-300">{s.preferredRole}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-400">{(s.cgpa || 8.0).toFixed(1)}</td>
                    <td className="py-4 px-4 font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        s.overallScore >= 75 ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/15' : 'bg-amber-500/10 text-amber-500 border border-amber-500/15'
                      }`}>
                        {s.overallScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        s.decisionStatus === 'Placed' || s.decisionStatus === 'Ready' || s.decisionStatus === 'Excellent'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : s.decisionStatus === 'Borderline' || s.decisionStatus === 'Developing'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {s.decisionStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                    No student directory matches. Keep candidate filters clear.
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
