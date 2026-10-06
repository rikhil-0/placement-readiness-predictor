/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, UserPlus, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface RegisterProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function Register({ onLoginSuccess }: RegisterProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, role })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onLoginSuccess(data.user);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing registration request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] flex-col justify-center bg-[#09090b] text-slate-100 py-12 px-4 sm:px-6 lg:px-8" id="register_page_container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3">
            <GraduationCap className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif italic text-white tracking-tight">
            Create Onboarding Profile
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Get started in seconds with personalized placement predictive models
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#121214] py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-white/5">
          
          {error && (
            <div className="mb-4 rounded-lg bg-red-950/30 p-4 text-sm text-red-400 border border-red-900/40" id="register_error">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="reg_name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="reg_name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 pl-10 pr-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 sm:text-sm outline-none transition"
                  placeholder="e.g. Liam Parker"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg_email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="reg_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 pl-10 pr-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 sm:text-sm outline-none transition"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Role Selection
              </label>
              <div className="grid grid-cols-2 gap-3" id="role_selection">
                <button
                  type="button"
                  id="role_student_btn"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold border transition duration-150 cursor-pointer ${
                    role === 'student'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/5 bg-[#09090b] text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Student
                </button>
                <button
                  type="button"
                  id="role_admin_btn"
                  onClick={() => setRole('admin')}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold border transition duration-150 cursor-pointer ${
                    role === 'admin'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/5 bg-[#09090b] text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin Evaluation
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reg_pass" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="reg_pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 pl-10 pr-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 sm:text-sm outline-none transition"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 text-sm font-bold transition duration-200 shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating Profile...' : 'Complete Profile Setup'}
                <UserPlus className="h-4 w-4" />
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Already have an onboarding profile?{' '}
            <Link to="/login" className="font-bold text-emerald-450 hover:text-emerald-400 transition underline underline-offset-4">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
