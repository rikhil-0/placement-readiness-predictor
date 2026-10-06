/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, LogIn, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing login request');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (roleType: 'student' | 'admin') => {
    if (roleType === 'student') {
      setEmail('student@predictor.com');
      setPassword('password123');
    } else {
      setEmail('admin@predictor.com');
      setPassword('admin123');
    }
    setError(null);
  };

  return (
    <div className="flex min-h-[90vh] flex-col justify-center bg-[#09090b] text-slate-100 py-12 px-4 sm:px-6 lg:px-8" id="login_page_container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3">
            <GraduationCap className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif italic text-white tracking-tight">
            Predict Placement Readiness
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to analyze candidate readiness with Gemini AI indexes
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#121214] py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-white/5">
          
          {error && (
            <div className="mb-4 rounded-lg bg-red-950/30 p-4 text-sm text-red-400 border border-red-900/40" id="login_error">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login_email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="login_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 pl-10 pr-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 sm:text-sm outline-none transition"
                  placeholder="e.g. candidate@predictor.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login_pass" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="login_pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 pl-10 pr-3 py-2.5 bg-[#09090b] text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-emerald-500 focus:ring-1 sm:text-sm outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 text-sm font-bold transition duration-200 shadow-md shadow-emerald-950/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <LogIn className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick Demographics triggers */}
          <div className="mt-8 border-t border-white/5 pt-6">
            <span className="block text-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Developer sandbox fast access
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillQuickCredentials('student')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-xs font-semibold text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-450 hover:border-emerald-500/20 transition cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                Demo Student
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials('admin')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-xs font-semibold text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-450 hover:border-emerald-500/20 transition cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Demo Admin
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Don't have an onboarding profile?{' '}
            <Link to="/register" className="font-bold text-emerald-450 hover:text-emerald-400 transition underline underline-offset-4">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
