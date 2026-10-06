/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { UserCircle, GraduationCap, Github, Link2, Plus, Save, SquareUser, CheckCircle2 } from 'lucide-react';
import { User, StudentProfile as StudentProfileType } from '../types';

interface StudentProfileProps {
  user: User;
}

export default function StudentProfile({ user }: StudentProfileProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [domain, setDomain] = useState('Web Development & APIs');
  const [graduationYear, setGraduationYear] = useState('2026');
  const [cgpa, setCgpa] = useState<number>(8.0);
  const [preferredRole, setPreferredRole] = useState('Full-stack Developer');
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [leetcodeUrl, setLeetcodeUrl] = useState('');
  const [experience, setExperience] = useState('');
  const [projects, setProjects] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${user.id}`);
        if (res.ok) {
          const p: StudentProfileType = await res.json();
          setFullName(p.fullName || '');
          setDomain(p.domain || 'Web Development & APIs');
          setGraduationYear(p.graduationYear || '2026');
          setCgpa(p.currentCgpa || 8.0);
          setPreferredRole(p.preferredRole || 'Full-stack Developer');
          setSkills(p.skills || []);
          setGithubUrl(p.githubUrl || '');
          setLeetcodeUrl(p.leetcodeUrl || '');
          setExperience(p.experience || '');
          setProjects(p.projects || '');
        }
      } catch (err) {
        console.error('Failed to load profile parameters:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user.id]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const payload: Partial<StudentProfileType> = {
      fullName,
      domain,
      graduationYear,
      currentCgpa: Number(cgpa),
      preferredRole,
      skills,
      githubUrl,
      leetcodeUrl,
      experience,
      projects
    };

    try {
      const res = await fetch(`/api/profile/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed saving profile changes:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center bg-[#09090b]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6" id="student_profile_page">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-serif italic text-white flex items-center gap-2">
          <SquareUser className="h-6 w-6 text-emerald-450" />
          Academic & Professional Profile
        </h1>
        <p className="text-sm text-slate-400">
          Sync your academic metrics and portfolios so our AI analysis module can correctly predict readiness metrics.
        </p>
      </div>

      {success && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-400 flex items-center gap-2" id="profile_alert_success">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold">Profile configuration saved successfully! Re-calculated alignment metrics in your background analysis.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Info section */}
        <div className="rounded-2xl border border-white/5 bg-[#121214] p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-350 border-b border-white/5 pb-3 flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-emerald-500" />
            Personal & Academic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="p_fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
              <input
                id="p_fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="p_prefRole" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Preferred Target Role</label>
              <input
                id="p_prefRole"
                type="text"
                required
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
                placeholder="e.g. Frontend Engineer, ML Specialist"
              />
            </div>

            <div>
              <label htmlFor="p_domain" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Academic focus / Stream</label>
              <select
                id="p_domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3 py-2 bg-[#09090b] text-slate-300 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition h-10"
              >
                <option value="Web Development & APIs">Web Development & APIs</option>
                <option value="Data Informatics & Systems">Data Informatics & Systems</option>
                <option value="Machine Learning Models">Machine Learning Models</option>
                <option value="Android & iOS mobile Apps">Android & iOS mobile Apps</option>
                <option value="Cyber security and Cloud systems">Cyber security and Cloud systems</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="p_gradYear" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Graduation Year</label>
                <input
                  id="p_gradYear"
                  type="text"
                  required
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 px-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="p_cgpa" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Current CGPA Score</label>
                <input
                  id="p_cgpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                  className="block w-full rounded-lg border border-white/10 px-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolios links & Resume metadata references */}
        <div className="rounded-2xl border border-white/5 bg-[#121214] p-6 shadow-xl space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-350 border-b border-white/5 pb-3 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-500" />
            Core Portfolios & Project Summaries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="p_git" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Github className="h-4 w-4 text-slate-400" />
                GitHub Portfolio URL
              </label>
              <input
                id="p_git"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-700 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label htmlFor="p_leetcode" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                <Link2 className="h-4 w-4 text-amber-500" />
                LeetCode Profile URL
              </label>
              <input
                id="p_leetcode"
                type="url"
                value={leetcodeUrl}
                onChange={(e) => setLeetcodeUrl(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-700 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
                placeholder="https://leetcode.com/..."
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="p_projectSummary" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Project Portfolio Description</label>
              <textarea
                id="p_projectSummary"
                rows={3}
                value={projects}
                onChange={(e) => setProjects(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-650 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
                placeholder="Briefly detail main full-stack apps or repository builds you have launched..."
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="p_exp" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Internships & Professional engagements</label>
              <textarea
                id="p_exp"
                rows={3}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="block w-full rounded-lg border border-white/10 px-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-650 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none transition"
                placeholder="Briefly describe summer internships or software developer engagements..."
              />
            </div>
          </div>
        </div>

        {/* Skills inventory tagger */}
        <div className="rounded-2xl border border-white/5 bg-[#121214] p-6 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-350">
              ⚙️ Technology & Language Inventory
            </h2>
            <p className="text-xs text-slate-450">Add the key frameworks, libraries and methodologies you have mastered</p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="skill_tag_input"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="block w-full max-w-xs rounded-lg border border-white/10 px-3 py-2 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm outline-none"
              placeholder="e.g. TypeScript, Redis, AWS"
            />
            <button
              type="button"
              id="btn_add_skill"
              onClick={handleAddSkill}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-400 border border-emerald-500/10 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Tag
            </button>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2" id="skills_list">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-emerald-450 hover:text-emerald-300 font-bold ml-1.5 hover:scale-110 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No technology tags added yet. Add a few to satisfy ATS requirements!</p>
          )}
        </div>

        {/* Submit action panel */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            id="btn_save_profile"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-bold text-black transition disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-900/10"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Syncing...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
